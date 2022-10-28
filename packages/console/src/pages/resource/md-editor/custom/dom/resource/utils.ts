/** 资源 dom 相关方法 */

import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import showdown from 'showdown';
import { CustomResource } from '../../../core/interface';

const converter = new showdown.Converter();

/** 插入资源 dom */
export const insertResource = async (data: CustomResource, editor: any) => {
  const {
    resourceId,
    resourceName,
    coverImages,
    resourceType,
    latestVersion,
    version,
    policies,
    authType,
  } = data;
  const insertData: CustomResource = {
    resourceId,
    resourceName,
    coverImages,
    resourceType,
    latestVersion,
    version: version || latestVersion,
    policies,
    authType,
    content: '',
    type: 'resource',
    children: [{ text: '' }],
  };
  if (authType === 3) {
    if (['图片', '视频', '音频'].includes(resourceType[0])) {
      // 媒体资源，获取 url
      const url = getMediaUrl(resourceId, version || latestVersion);
      insertData.content = url;
    } else if (['阅读'].includes(resourceType[0])) {
      // 文本资源，获取内容
      const res = await getDocContent(resourceId, version || latestVersion);
      insertData.content = await getRealContent(res, data);
    }
  }
  editor.insertNode(insertData);
  editor.insertBreak();
};

/** 整理依赖，获取真实内容 */
const getRealContent = async (
  content: string,
  data: CustomResource,
): Promise<string> => {
  let html = content;
  const { allDeps, requestDeps } = await getDeps(data.resourceId, data.version);

  let promiseArr = [] as Promise<any>[];
  requestDeps.forEach((dep) => {
    const depContent = getDocContent(dep.resourceId, dep.version);
    promiseArr.push(depContent);
  });

  const resArr = await Promise.all(promiseArr);

  // 以摊开的所有依赖为准，一个一个替换依赖资源，否则会有遗漏
  allDeps.forEach((dep) => {
    const isMedia = ['图片', '视频', '音频'].includes(dep.resourceType[0]);

    if (isMedia) {
      // 媒体资源
      const regText = `src=[\'"]freelog://${dep.resourceName}[\'"]`;
      const reg = new RegExp(regText, 'g');
      const url = getMediaUrl(dep.resourceId, dep.version);
      const replaceText = `src="${url}"`;
      html = html.replace(reg, replaceText);
    } else if (['阅读'].includes(dep.resourceType[0])) {
      // 非媒体资源
      const depResultIndex = requestDeps.findIndex(
        (requestDep) => requestDep.versionId === dep.versionId,
      );
      if (depResultIndex === -1) return;

      const regText = `{{freelog://${requestDeps[depResultIndex].resourceName}}}`;
      const reg = new RegExp(regText, 'g');
      const depResult = resArr[depResultIndex];
      const replaceText = converter.makeHtml(depResult);
      html = html.replace(reg, replaceText);
    }
  });

  return html;
};

/**
 * 获取媒体资源 url
 * @param resourceId 资源 id
 * @param version 资源版本号
 */
const getMediaUrl = (resourceId: string, version: string) => {
  const url = `${FUtil.Format.completeUrlByDomain(
    'qi',
  )}/v2/resources/${resourceId}/versions/${version}/download`;
  return url;
};

/**
 * 获取文档资源内容
 * @param resourceId 资源 id
 * @param version 资源版本号
 */
const getDocContent = (resourceId: string, version: string) => {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/versions/${version}/download`,
  });
};

/**
 * 获取所有依赖与文档依赖（文档依赖需要通过接口请求获取内容）
 * @param resourceId 资源 id
 * @param version 资源版本号
 */
const getDeps = async (resourceId: string, version: string) => {
  // 摊开的所有依赖
  const allDeps = [] as any[];
  // 摊开的所有依赖（不重复），用作请求依赖文件
  const requestDeps = [] as any[];
  // 第一层依赖，用于区别深层依赖
  let basicDeps = [] as any[];
  // 深层依赖，用于区别第一层依赖
  let deepDeps = [] as any[];

  const res = await FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/dependencyTree`,
    params: { version },
  });
  basicDeps = res.data;

  const getSubDeps = (subDeps: any[]) => {
    subDeps.forEach((dep) => {
      allDeps.push(dep);
      deepDeps.push(dep);
      const index = requestDeps.findIndex(
        (item) => item.versionId === dep.versionId,
      );
      if (index === -1 && dep.resourceType[0] === '阅读') requestDeps.push(dep);
      if (dep.dependencies.length) getSubDeps(dep.dependencies);
    });
  };

  getSubDeps(res.data);

  return { allDeps, requestDeps, basicDeps, deepDeps };
};

/**
 * 导入文档
 * @param content 文档内容
 * @param versionInfo 版本信息：resourceId - 资源 id，version - 版本号
 */
export const importDoc = async (
  content: string,
  versionInfo?: {
    resourceId: string;
    version: string;
  },
) => {
  if (!versionInfo) return converter.makeHtml(content);

  let html = content;
  const { allDeps, requestDeps, basicDeps, deepDeps } = await getDeps(
    versionInfo.resourceId,
    versionInfo.version,
  );

  // 请求依赖资源数据
  const resourceParams: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceNames: [
      ...new Set(
        allDeps.map((item: { resourceName: string }) => item.resourceName),
      ),
    ].join(),
  };
  const resourceRes = await FServiceAPI.Resource.batchInfo(resourceParams);

  // 请求文档依赖内容
  let promiseArr = [] as Promise<any>[];
  requestDeps.forEach((dep) => {
    const depContent = getDocContent(dep.resourceId, dep.version);
    promiseArr.push(depContent);
  });
  const resArr = await Promise.all(promiseArr);

  // 先处理第一层依赖，需处理资源 dom
  basicDeps.forEach((dep) => {
    const index = resourceRes.data.findIndex(
      (item) => item.resourceName === dep.resourceName,
    );
    if (index !== -1) {
      dep.coverImages = resourceRes.data[index].coverImages;
      dep.latestVersion = resourceRes.data[index].latestVersion;
      dep.policies = resourceRes.data[index].policies;
    }
    // TODO authType 目前写死
    dep.authType = 3;

    const resourceFirstType = dep.resourceType[0];
    let regText = '';

    if (resourceFirstType === '图片') {
      // 图片资源
      regText = `<img[^>]*?src=[\'"]freelog://${dep.resourceName}[\'"][^>]*?>`;
      dep.content = getMediaUrl(dep.resourceId, dep.version);
    } else if (resourceFirstType === '视频') {
      // 视频资源
      regText = `<video[^>]*?src=[\'"]freelog://${dep.resourceName}[\'"][^>]*?>`;
      dep.content = getMediaUrl(dep.resourceId, dep.version);
    } else if (resourceFirstType === '音频') {
      // 音频资源
      regText = `<audio[^>]*?src=[\'"]freelog://${dep.resourceName}[\'"][^>]*?>`;
      dep.content = getMediaUrl(dep.resourceId, dep.version);
    } else if (['阅读'].includes(dep.resourceType[0])) {
      // 文档资源
      const depResultIndex = requestDeps.findIndex(
        (requestDep) => requestDep.versionId === dep.versionId,
      );
      if (depResultIndex === -1) return;

      const depResult = resArr[depResultIndex];
      regText = `{{freelog://${requestDeps[depResultIndex].resourceName}}}`;
      dep.content = converter.makeHtml(depResult);
    }
    const reg = new RegExp(regText, 'g');
    const replaceText = customResourceHtml(dep);
    html = html.replace(reg, replaceText);
  });

  // 处理深层依赖，此类依赖无需处理为资源 dom，解析为 html 即可
  deepDeps.forEach((dep) => {
    const index = resourceRes.data.findIndex(
      (item) => item.resourceName === dep.resourceName,
    );
    if (index !== -1) {
      dep.coverImages = resourceRes.data[index].coverImages;
      dep.latestVersion = resourceRes.data[index].latestVersion;
      dep.policies = resourceRes.data[index].policies;
    }
    // TODO authType 目前写死
    dep.authType = 3;

    const isMedia = ['图片', '视频', '音频'].includes(dep.resourceType[0]);

    if (isMedia) {
      // 媒体资源
      const url = getMediaUrl(dep.resourceId, dep.version);
      // 编辑器解析属性时 getAttribute 方法查询到双引号 " 截止，会导致字符串中的双引号错误地截断属性的 value，所以从 md 转为 html 时，将双引号先转为 ASCII 编码（&#34;）
      const replaceText = `src=&#34;${url}&#34;`;
      let regText = `src='freelog://${dep.resourceName}'`;
      let reg = new RegExp(regText, 'g');
      html = html.replace(reg, replaceText);
      regText = `src=&#34;freelog://${dep.resourceName}&#34;`;
      reg = new RegExp(regText, 'g');
      html = html.replace(reg, replaceText);
    } else if (['阅读'].includes(dep.resourceType[0])) {
      // 非媒体资源
      const depResultIndex = requestDeps.findIndex(
        (requestDep) => requestDep.versionId === dep.versionId,
      );
      if (depResultIndex === -1) return;

      const regText = `{{freelog://${requestDeps[depResultIndex].resourceName}}}`;
      const reg = new RegExp(regText, 'g');
      const depResult = resArr[depResultIndex];
      const replaceText = converter.makeHtml(depResult);
      html = html.replace(reg, replaceText.replace(/"/g, '&#34;'));
    }
  });

  return `<p>${html}</p>`;
};

/** 获取资源自定义 html */
const customResourceHtml = (data: CustomResource) => {
  // 编辑器解析属性时 getAttribute 方法查询到双引号 " 截止，会导致字符串中的双引号错误地截断属性的 value，所以从 md 转为 html 时，将双引号先转为 ASCII 编码（&#34;）
  const html = `
    <span
      data-w-e-type="resource"
      data-w-e-is-void
      data-w-e-is-inline
      data-resourceId="${data.resourceId}"
      data-authType="${data.authType}"
      data-resourceName="${data.resourceName}"
      data-coverImages="${JSON.stringify(data.coverImages).replace(
        /"/g,
        '&#34;',
      )}"
      data-resourceType="${JSON.stringify(data.resourceType).replace(
        /"/g,
        '&#34;',
      )}"
      data-latestVersion="${data.latestVersion}"
      data-version="${data.version}"
      data-policies="${JSON.stringify(data.policies).replace(/"/g, '&#34;')}"
      data-content="${data.content.replace(/"/g, '&#34;')}"
    >
      此资源来自于 freelog
    </span>
  `;

  return html;
};
