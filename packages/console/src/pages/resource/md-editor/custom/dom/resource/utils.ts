/** 资源 dom 相关方法 */

import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import showdown from 'showdown';
import { ResourceInEditor, CustomResource } from '../../../core/interface';

const converter = new showdown.Converter();

/** 插入资源 */
export const insertResource = async (data: ResourceInEditor, editor: any) => {
  const {
    resourceId,
    resourceName,
    coverImages,
    resourceType,
    latestVersion,
    version,
  } = data;
  // TODO authType 目前写死
  const authType = 3;
  const insertData: CustomResource = {
    originType: 1,
    resourceId,
    resourceName,
    coverImages,
    resourceType,
    latestVersion,
    version: version || latestVersion,
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

/** 插入 url 资源 */
export const insertUrlResource = async (
  url: string,
  editor: any,
  type: string,
) => {
  const insertData: CustomResource = {
    originType: 2,
    resourceType: [type],
    content: url,
    type: 'resource',
    children: [{ text: '' }],
  };
  editor.insertNode(insertData);
  editor.insertBreak();
};

/** 整理依赖，获取真实内容 */
const getRealContent = async (
  content: string,
  data: ResourceInEditor,
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

  html = converter.makeHtml(html);

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
  // TODO!!! 解决文档依赖识别：从历史版本导入需要对应依赖版本号，否则以依赖最新版本号为版本插入
  console.error('versionInfo===>', versionInfo);
  if (!versionInfo) return converter.makeHtml(content);

  let html = content;

  const {
    mdImgContent,
    imgContent,
    videoContent,
    audioContent,
    docContent,
    newContent,
  } = getInternalResources(content);
  html = newContent;

  const { allDeps, requestDeps, basicDeps, deepDeps } = await getDeps(
    versionInfo.resourceId,
    versionInfo.version,
  );
  console.error('basicDeps===>', basicDeps);

  mdImgContent.forEach(async (item) => {
    const url = item.match(/(?<=!\[[^\]]*?]\()[\s\S]*?(?=\))/i) || [];
    const domHtml = await dealInternalResources(url[0], '图片', basicDeps);
    // 将图片文本替换标记
    html = html.replace(/`#mdImgContent#`/i, domHtml);
  });

  imgContent.forEach(async (item) => {
    const url = item.match(/(?<=src=['"])[\s\S]*?(?=['"])/i) || [];
    const domHtml = await dealInternalResources(url[0], '图片', basicDeps);
    // 将图片文本替换标记
    html = html.replace(/`#imgContent#`/i, domHtml);
  });

  videoContent.forEach(async (item) => {
    const url = item.match(/(?<=src=['"])[\s\S]*?(?=['"])/i) || [];
    const domHtml = await dealInternalResources(url[0], '视频', basicDeps);
    // 将图片文本替换标记
    html = html.replace(/`#videoContent#`/i, domHtml);
  });

  audioContent.forEach(async (item) => {
    const url = item.match(/(?<=src=['"])[\s\S]*?(?=['"])/i) || [];
    const domHtml = await dealInternalResources(url[0], '音频', basicDeps);
    // 将图片文本替换标记
    html = html.replace(/`#audioContent#`/i, domHtml);
  });

  docContent.forEach(async (item) => {
    const url = item.match(/(?<={{)[\s\S]*?(?=}})/i) || [];
    const domHtml = await dealInternalResources(url[0], '阅读', basicDeps);
    // 将图片文本替换标记
    html = html.replace(/`#docContent#`/i, domHtml);
  });
  console.error(html);

  return `<p>${html}</p>`;
};

/** 识别文档内容内部的资源引入 */
const getInternalResources = (content: string) => {
  let newContent = content;
  // 储存 md 语法的图片（![]()）
  const mdImgContent = newContent.match(/!\[[^\]]*?]\([^\)]*?\)/gi) || [];
  // 储存图片内容（<img）
  const imgContent = newContent.match(/<img[^>]*?>/gi) || [];
  // 储存视频内容（<video）
  const videoContent = newContent.match(/<video[^>]*?>/gi) || [];
  // 储存音频内容（<video）
  const audioContent = newContent.match(/<audio[^>]*?>/gi) || [];
  // 储存文档内容（{{}}）
  const docContent = newContent.match(/{{[^}]*?}}/gi) || [];
  // 标记原文本中 md 语法的图片内容
  newContent = newContent.replace(
    /!\[[^\]]*?]\([^\)]*?\)/gi,
    '`#mdImgContent#`',
  );
  // 标记原文本中图片内容
  newContent = newContent.replace(/<img[^>]*?>/gi, '`#imgContent#`');
  // 标记原文本中视频内容
  newContent = newContent.replace(/<video[^>]*?>/gi, '`#videoContent#`');
  // 标记原文本中音频内容
  newContent = newContent.replace(/<audio[^>]*?>/gi, '`#audioContent#`');
  // 标记原文本中文档内容
  newContent = newContent.replace(/{{[^}]*?}}/gi, '`#docContent#`');

  return {
    mdImgContent,
    imgContent,
    videoContent,
    audioContent,
    docContent,
    newContent,
  };
};

/**
 * 处理文档内容内部资源，将资源转为自定义 html
 * @param url 路径
 * @param type 资源类型
 * @param deps 第一层依赖
 */
const dealInternalResources = async (
  url: string,
  type: string,
  deps: any[],
) => {
  let data: CustomResource;
  // 是否为依赖路径
  const isRely = url.startsWith('freelog://');
  if (isRely) {
    // 依赖资源
    const dep = deps.find((item) => item.resourceName === resourceName) || {};
    data = dep;
    const resourceName = url.replace('freelog://', '');

    // 请求依赖资源数据
    const resourceParams: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] =
      { resourceNames: resourceName };
    const resourceRes = await FServiceAPI.Resource.batchInfo(resourceParams);
    if (resourceRes.data) {
      const { coverImages, latestVersion } = resourceRes.data[0];
      // TODO authType 目前写死
      data.authType = 3;
      data.coverImages = coverImages;
      data.latestVersion = latestVersion;

      if (['图片', '视频', '音频'].includes(type)) {
        // 媒体资源
        data.content = getMediaUrl(dep.resourceId, dep.version);
      } else if (type === '阅读') {
        // 文档资源
        const docContent = await getDocContent(dep.resourceId, dep.version);
        dep.content = converter.makeHtml(docContent);
      }
    }
    console.error(resourceRes);

    // // 请求文档依赖内容
    // let promiseArr = [] as Promise<any>[];
    // requestDeps.forEach((dep) => {
    //   const depContent = getDocContent(dep.resourceId, dep.version);
    //   promiseArr.push(depContent);
    // });
    // const resArr = await Promise.all(promiseArr);

    // // 先处理第一层依赖，需处理资源 dom
    // basicDeps.forEach((dep) => {
    //   const index = resourceRes.data.findIndex(
    //     (item) => item.resourceName === dep.resourceName,
    //   );
    //   if (index !== -1) {
    //     dep.coverImages = resourceRes.data[index].coverImages;
    //     dep.latestVersion = resourceRes.data[index].latestVersion;
    //   }
    //   // TODO authType 目前写死
    //   dep.authType = 3;

    //   const resourceFirstType = dep.resourceType[0];
    //   let regText = '';

    //   if (resourceFirstType === '图片') {
    //     // 图片资源
    //     regText = `<img[^>]*?src=[\'"]freelog://${dep.resourceName}[\'"][^>]*?>`;
    //     dep.content = getMediaUrl(dep.resourceId, dep.version);
    //   } else if (resourceFirstType === '视频') {
    //     // 视频资源
    //     regText = `<video[^>]*?src=[\'"]freelog://${dep.resourceName}[\'"][^>]*?>`;
    //     dep.content = getMediaUrl(dep.resourceId, dep.version);
    //   } else if (resourceFirstType === '音频') {
    //     // 音频资源
    //     regText = `<audio[^>]*?src=[\'"]freelog://${dep.resourceName}[\'"][^>]*?>`;
    //     dep.content = getMediaUrl(dep.resourceId, dep.version);
    //   } else if (['阅读'].includes(dep.resourceType[0])) {
    //     // 文档资源
    //     const depResultIndex = requestDeps.findIndex(
    //       (requestDep) => requestDep.versionId === dep.versionId,
    //     );
    //     if (depResultIndex === -1) return;

    //     const depResult = resArr[depResultIndex];
    //     regText = `{{freelog://${requestDeps[depResultIndex].resourceName}}}`;
    //     dep.content = converter.makeHtml(depResult);
    //   }
    //   const reg = new RegExp(regText, 'g');
    //   const replaceText = customResourceHtml(dep);
    //   html = html.replace(reg, replaceText);
    // });

    // // 处理深层依赖，此类依赖无需处理为资源 dom，解析为 html 即可
    // deepDeps.forEach((dep) => {
    //   const index = resourceRes.data.findIndex(
    //     (item) => item.resourceName === dep.resourceName,
    //   );
    //   if (index !== -1) {
    //     dep.coverImages = resourceRes.data[index].coverImages;
    //     dep.latestVersion = resourceRes.data[index].latestVersion;
    //     dep.policies = resourceRes.data[index].policies;
    //   }
    //   // TODO authType 目前写死
    //   dep.authType = 3;

    //   const isMedia = ['图片', '视频', '音频'].includes(dep.resourceType[0]);

    //   if (isMedia) {
    //     // 媒体资源
    //     const url = getMediaUrl(dep.resourceId, dep.version);
    //     // 编辑器解析属性时 getAttribute 方法查询到双引号 " 截止，会导致字符串中的双引号错误地截断属性的 value，所以从 md 转为 html 时，将双引号先转为 ASCII 编码（&#34;）
    //     const replaceText = `src=&#34;${url}&#34;`;
    //     let regText = `src='freelog://${dep.resourceName}'`;
    //     let reg = new RegExp(regText, 'g');
    //     html = html.replace(reg, replaceText);
    //     regText = `src=&#34;freelog://${dep.resourceName}&#34;`;
    //     reg = new RegExp(regText, 'g');
    //     html = html.replace(reg, replaceText);
    //   } else if (['阅读'].includes(dep.resourceType[0])) {
    //     // 非媒体资源
    //     const depResultIndex = requestDeps.findIndex(
    //       (requestDep) => requestDep.versionId === dep.versionId,
    //     );
    //     if (depResultIndex === -1) return;

    //     const regText = `{{freelog://${requestDeps[depResultIndex].resourceName}}}`;
    //     const reg = new RegExp(regText, 'g');
    //     const depResult = resArr[depResultIndex];
    //     const replaceText = converter.makeHtml(depResult);
    //     html = html.replace(reg, replaceText.replace(/"/g, '&#34;'));
    //   }
    // });
  } else {
    // 外部路径
    data = {
      originType: 2,
      resourceType: [type],
      content: url,
    };
  }
  return customResourceHtml(data);
};

/** 获取资源自定义 html */
const customResourceHtml = (data: CustomResource) => {
  // 编辑器解析属性时 getAttribute 方法查询到双引号 " 截止，会导致字符串中的双引号错误地截断属性的 value，所以从 md 转为 html 时，将双引号先转为 ASCII 编码（&#34;）
  const html = `
    <span
      data-w-e-type="resource"
      data-w-e-is-void
      data-w-e-is-inline
      data-originType="${data.originType}"
      data-resourceId="${data.resourceId || ''}"
      data-authType="${data.authType || ''}"
      data-resourceName="${data.resourceName || ''}"
      data-coverImages="${
        data.coverImages
          ? JSON.stringify(data.coverImages).replace(/"/g, '&#34;')
          : ''
      }"
      data-resourceType="${JSON.stringify(data.resourceType).replace(
        /"/g,
        '&#34;',
      )}"
      data-latestVersion="${data.latestVersion || ''}"
      data-version="${data.version || ''}"
      data-content="${data.content.replace(/"/g, '&#34;')}"
    >
      此资源来自于 freelog
    </span>
  `;

  return html;
};
