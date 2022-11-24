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
  // TODO authType 目前写死，之后需要通过接口获取授权状态
  const authType = Number(sessionStorage.getItem('authorizeType') || 1) as
    | 1
    | 2
    | 3
    | 4;
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
      /** 媒体资源，获取 url */
      const url = getMediaUrl(resourceId, version || latestVersion);
      insertData.content = url;
    } else if (['阅读'].includes(resourceType[0])) {
      /** 文本资源，获取内容 */
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

  // 以摊开的所有依赖为准，循环替换依赖资源
  allDeps.forEach((dep) => {
    const isMedia = ['图片', '视频', '音频'].includes(dep.resourceType[0]);

    if (isMedia) {
      /** 媒体资源 */
      const regText = `src=[\'"]freelog://${dep.resourceName}[\'"]`;
      const reg = new RegExp(regText, 'g');
      const url = getMediaUrl(dep.resourceId, dep.version);
      // controlslist="nodownload" oncontextmenu="return false" 为了将依赖资源里的下载按钮隐藏、右键菜单隐藏
      const replaceText = `src="${url}" controlslist="nodownload" oncontextmenu="return false"`;
      html = html.replace(reg, replaceText);
    } else if (['阅读'].includes(dep.resourceType[0])) {
      /** 非媒体资源 */
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

  const res = await FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/dependencyTree`,
    params: { version },
  });
  basicDeps = res.data;

  const getSubDeps = (subDeps: any[]) => {
    subDeps.forEach((dep) => {
      allDeps.push(dep);
      const index = requestDeps.findIndex(
        (item) => item.versionId === dep.versionId,
      );
      if (index === -1 && dep.resourceType[0] === '阅读') requestDeps.push(dep);
      if (dep.dependencies.length) getSubDeps(dep.dependencies);
    });
  };

  getSubDeps(res.data);

  return { allDeps, requestDeps, basicDeps };
};

/**
 * 导入文档
 * @param content 文档内容
 * @param dataInfo 版本信息：type - 类型（资源/对象/上传/草稿），resourceId - 资源 id，version - 版本号
 */
export const importDoc = async (
  content: string,
  dataInfo: {
    type: 'resource' | 'object' | 'upload' | 'draft';
    resourceId?: string;
    version?: string;
    objectId?: string;
  },
) => {
  const { type, resourceId = '', version = '', objectId = '' } = dataInfo;
  const {
    mdImgContent,
    imgContent,
    videoContent,
    audioContent,
    docContent,
    newContent,
  } = getInternalResources(String(content));
  let html = newContent;

  let deps = [];

  if (type === 'resource') {
    const { basicDeps } = await getDeps(resourceId, version);
    deps = basicDeps;
  }

  /** 循环处理 md 语法图片标记 */
  for (const item of mdImgContent) {
    const url = item.match(/(?<=!\[[^\]]*?]\()[\s\S]*?(?=\))/i) || [];
    const domHtml = await dealInternalResources(url[0], '图片', deps);
    // 将图片文本替换标记
    html = html.replace(/`#mdImgContent#`/i, domHtml);
  }

  /** 循环处理图片标记 */
  for (const item of imgContent) {
    const url = item.match(/(?<=src=['"])[\s\S]*?(?=['"])/i) || [];
    const domHtml = await dealInternalResources(url[0], '图片', deps);
    // 将图片文本替换标记
    html = html.replace(/`#imgContent#`/i, domHtml);
  }

  /** 循环处理视频标记 */
  for (const item of videoContent) {
    const url = item.match(/(?<=src=['"])[\s\S]*?(?=['"])/i) || [];
    const domHtml = await dealInternalResources(url[0], '视频', deps);
    // 将视频文本替换标记
    html = html.replace(/`#videoContent#`/i, domHtml);
  }

  /** 循环处理音频标记 */
  for (const item of audioContent) {
    const url = item.match(/(?<=src=['"])[\s\S]*?(?=['"])/i) || [];
    const domHtml = await dealInternalResources(url[0], '音频', deps);
    // 将音频文本替换标记
    html = html.replace(/`#audioContent#`/i, domHtml);
  }

  /** 循环处理文档标记 */
  for (const item of docContent) {
    const url = item.match(/(?<={{)[\s\S]*?(?=}})/i) || [];
    const domHtml = await dealInternalResources(url[0], '阅读', deps);
    // 将文档文本替换标记
    html = html.replace(/`#docContent#`/i, domHtml);
  }

  return `<p>${html}</p>`;
};

/** 识别文档内容内部的资源引入 */
const getInternalResources = (content: string) => {
  let newContent = converter.makeHtml(content);
  // 储存 md 语法的图片（![]()）
  const mdImgContent = newContent.match(/!\[[^\]]*?]\([^\)]*?\)/gi) || [];
  // 储存图片（<img）
  const imgContent = newContent.match(/<img[^>]*?>/gi) || [];
  // 储存视频（<video）
  const videoContent = newContent.match(/<video[^>]*?>/gi) || [];
  // 储存音频（<video）
  const audioContent = newContent.match(/<audio[^>]*?>/gi) || [];
  // 储存文档（{{}}）
  const docContent = newContent.match(/{{[^}]*?}}/gi) || [];

  // 标记原文本中 md 语法的图片
  newContent = newContent.replace(
    /!\[[^\]]*?]\([^\)]*?\)/gi,
    '`#mdImgContent#`',
  );
  // 标记原文本中图片
  newContent = newContent.replace(/<img[^>]*?>/gi, '`#imgContent#`');
  // 标记原文本中视频
  newContent = newContent.replace(/<video[^>]*?>/gi, '`#videoContent#`');
  // 标记原文本中音频
  newContent = newContent.replace(/<audio[^>]*?>/gi, '`#audioContent#`');
  // 标记原文本中文档
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
 * 根据文件 sha1 识别文档内容的依赖
 * @param sha1 文件 sha1 值
 * @returns 依赖资源名称集合 string[]
 */
export const getDependences = async (sha1: string): Promise<string[]> => {
  const content = await FUtil.Request({
    url: `/v2/storages/files/${sha1}/download`,
  });
  return getDependencesByContent(String(content));
};

/**
 * 根据内容识别文档内容的依赖
 * @param content 文件内容
 * @returns 依赖资源名称集合 string[]
 */
export const getDependencesByContent = (content: string): string[] => {
  // 匹配 md 语法的图片依赖（![]()）
  const mdImgContent =
    content.match(/(?<=!\[[^\]]*?]\(freelog:\/\/)[\s\S]*?(?=\))/gi) || [];
  // 匹配图片依赖（<img）
  const imgContent =
    content.match(
      /(?<=<img[^>]*?src=['"]freelog:\/\/)[\s\S]*?(?=['"][^>]*?>)/gi,
    ) || [];
  // 匹配视频依赖（<video）
  const videoContent =
    content.match(
      /(?<=<video[^>]*?src=['"]freelog:\/\/)[\s\S]*?(?=['"][^>]*?>)/gi,
    ) || [];
  // 匹配音频依赖（<video）
  const audioContent =
    content.match(
      /(?<=<audio[^>]*?src=['"]freelog:\/\/)[\s\S]*?(?=['"][^>]*?>)/gi,
    ) || [];
  // 匹配文档依赖（{{}}）
  const docContent = content.match(/(?<={{freelog:\/\/)[\s\S]*?(?=}})/gi) || [];

  // 依赖列表（去重）
  const dependencesList: string[] = [
    ...new Set([
      ...mdImgContent,
      ...imgContent,
      ...videoContent,
      ...audioContent,
      ...docContent,
    ]),
  ];
  return dependencesList;
};

/**
 * 处理文档内容内部资源，将资源转为自定义 html
 * @param url 路径
 * @param type 资源类型
 * @param deps 第一层依赖
 */
const dealInternalResources = async (
  url: string,
  type: '图片' | '视频' | '音频' | '阅读',
  deps: any[],
) => {
  let data: CustomResource;
  // 是否为依赖路径
  const isRely = url.startsWith('freelog://');
  if (isRely) {
    /** 依赖资源 */
    // 从第一层依赖中找到当前处理的依赖信息
    const currentDep =
      deps.find((item) => item.resourceName === resourceName) || {};
    data = currentDep;
    // 取消依赖前缀
    const resourceName = url.replace('freelog://', '');

    // 请求依赖资源数据
    const resourceParams: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: resourceName,
    };
    const resourceRes = await FServiceAPI.Resource.info(resourceParams);
    if (resourceRes.data) {
      const {
        resourceId,
        resourceName,
        coverImages,
        resourceType,
        latestVersion,
      } = resourceRes.data;

      // TODO authType 目前写死，之后需要通过接口获取授权状态
      data.authType = Number(sessionStorage.getItem('authorizeType') || 1) as
        | 1
        | 2
        | 3
        | 4;
      data.originType = 1;
      data.resourceId = resourceId;
      data.resourceName = resourceName;
      data.coverImages = coverImages;
      data.resourceType = resourceType;
      data.latestVersion = latestVersion;
      // 以已处理的依赖版本为指定版本，如该依赖未处理，则以依赖资源最新版本为指定版本
      data.version = data.version || latestVersion;

      if (['图片', '视频', '音频'].includes(type)) {
        /** 媒体资源 */
        data.content = getMediaUrl(data.resourceId, data.version);
      } else if (type === '阅读') {
        /** 文档资源 */
        const docContent = await getDocContent(data.resourceId, data.version);
        data.content = converter.makeHtml(docContent);

        const { allDeps, requestDeps } = await getDeps(
          data.resourceId,
          data.version,
        );

        // 请求文档依赖内容
        let promiseArr = [] as Promise<any>[];
        requestDeps.forEach((dep) => {
          const depContent = getDocContent(dep.resourceId, dep.version);
          promiseArr.push(depContent);
        });
        const resArr = await Promise.all(promiseArr);

        /** 处理深层依赖，此类依赖无需处理为资源 dom，解析为 html 即可 */
        allDeps.forEach((dep) => {
          const isMedia = ['图片', '视频', '音频'].includes(
            dep.resourceType[0],
          );

          if (isMedia) {
            /** 媒体资源 */
            const url = getMediaUrl(dep.resourceId, dep.version);
            // 编辑器解析属性时，使用的 getAttribute 方法查询到双引号 " 截止，会导致字符串中的双引号错误地截断属性的 value，所以从 md 转为 html 时，属性值内的双引号需转为 ASCII 编码（&#34;）
            // controlslist="nodownload" oncontextmenu="return false" 为了将依赖资源里的下载按钮隐藏、右键菜单隐藏
            const replaceText = `src=&#34;${url}&#34; controlslist=&#34;nodownload&#34; oncontextmenu=&#34;return false&#34;`;

            /** 替换双引号引用文本 */
            let regText = `src=[\'"]freelog://${dep.resourceName}[\'"]`;
            let reg = new RegExp(regText, 'g');
            data.content = data.content.replace(reg, replaceText);

            /** 替换双引号 ASCII 编码 &#34; 的引用文本，此类文本从下文阅读内容替换时出现 */
            regText = `src=&#34;freelog://${dep.resourceName}&#34;`;
            reg = new RegExp(regText, 'g');
            data.content = data.content.replace(reg, replaceText);
          } else if (['阅读'].includes(dep.resourceType[0])) {
            /** 非媒体资源 */
            const depResultIndex = requestDeps.findIndex(
              (requestDep) => requestDep.versionId === dep.versionId,
            );
            if (depResultIndex === -1) return;

            const regText = `{{freelog://${requestDeps[depResultIndex].resourceName}}}`;
            const reg = new RegExp(regText, 'g');
            const depResult = resArr[depResultIndex];
            const replaceText = converter.makeHtml(depResult);
            data.content = data.content.replace(
              reg,
              replaceText.replace(/"/g, '&#34;'),
            );
          }
        });
      }
    }
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
  /**
   * 重要：
   * 编辑器解析属性时，使用的 getAttribute 方法查询到双引号 " 截止，会导致字符串中的双引号错误地截断属性的 value
   * 所以从 md 转为 html 时，属性值内的双引号需转为 ASCII 编码（&#34;）
   */
  const html = `<span
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
  </span>`;

  return html;
};
