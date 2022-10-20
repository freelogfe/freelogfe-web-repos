/** 编辑器自定义元素-资源 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { SlateElement } from '@wangeditor/editor';

interface HashImgUrlResult {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  width: number;
  height: number;
}

/** 解析资源文件路径参数 */
const hashImgUrl = (str: string): HashImgUrlResult => {
  let params = str.split('#')[1];
  let param = params.split('&');
  let obj: { [key: string]: number } = {};
  for (const kv of param) {
    let [key, value] = kv.split('=');
    obj[key] = Number(value);
  }
  if (typeof obj['r'] !== 'number') {
    obj['r'] = 0;
  }
  return obj as any;
};

/** 获取资源信息与授权状态 */
const getResourceData = async (id: string) => {
  const [resourceRes, authRes] = await Promise.all([
    FServiceAPI.Resource.info({ resourceIdOrName: id }),
    FServiceAPI.Resource.batchAuth({ resourceIds: id }),
  ]);
  if (resourceRes.errCode !== 0 || authRes.errCode !== 0) return null;

  const resourceData = resourceRes.data;
  const authData = authRes.data[0];
  return [resourceData, authData];
};

/** 未授权资源 DOM */
const unauthorizedResource = (data: any): VNode => {
  const {
    resourceId,
    coverImages,
    resourceName,
    resourceType,
    latestVersion,
    policies,
  } = data;

  // 整理封面尺寸与坐标
  const cover =
    coverImages[0] ||
    FUtil.Format.completeUrlByDomain('static') + '/static/default_cover.png';
  let coverStyle = {
    width: '100%',
    height: '100%',
    transform: 'none',
  };
  if (cover.includes('#')) {
    const { x, y, w, width: wh, height: ht } = hashImgUrl(cover);
    const scale: number = 280 / w;
    coverStyle = {
      width: wh * scale + 'px',
      height: ht * scale + 'px',
      transform: `translateX(${-x * scale}px) translateY(${-y * scale}px)`,
    };
  }

  // 整理上架策略
  const onlinePolicies = policies.filter(
    (item: { status: number }) => item.status === 1,
  );

  return h(
    'div.unauthorized-resource-wrapper',
    {
      props: { contentEditable: false },
    },
    [
      // 左侧区域
      h(
        'div.left-area',
        {
          on: {
            click() {
              window.open(
                FUtil.LinkTo.resourceDetails({
                  resourceID: resourceId,
                }),
              );
            },
          },
        },
        [
          // 封面
          h('div.cover', {}, [
            h('img', {
              props: { src: cover },
              style: coverStyle,
            }),
          ]),
          // 资源名称
          h('div.name', {}, [resourceName]),
          // 资源类型与版本号
          h('div.info', {}, [
            h('div', {}, [
              FUtil.Format.resourceTypeKeyArrToResourceType(resourceType),
            ]),
            h('div', {}, [
              latestVersion
                ? FI18n.i18nNext.t('latest_version') + ' ' + latestVersion
                : '暂无版本',
            ]),
          ]),
          // 标签
          onlinePolicies.length
            ? h('div.tags-wrapper', {}, [
                ...onlinePolicies.map((policy: { policyName: string }) =>
                  h('div.tag', {}, [policy.policyName]),
                ),
              ])
            : h('div.no-policy', {}, ['暂无策略…']),
        ],
      ),
      // 右侧区域
      h('div.right-area', {}, [
        h('i.freelog fl-icon-warningxiaochicun', {}),
        h('div.tip', {}, [FI18n.i18nNext.t('msg_posteditor_getauth')]),
        h(
          'div.auth-btn',
          {
            on: {
              click() {
                console.error('打开授权弹窗');
              },
            },
          },
          [FI18n.i18nNext.t('btn_posteditor_getauth')],
        ),
      ]),
    ],
  );
};

/** 图片资源 DOM */
const imageResource = (url: string): VNode => {
  return h('div.authorized-resource-wrapper', {}, [
    // 图片
    h('img', { props: { src: url } }),
    // 已授权按钮
    h('div.toolbar', {}, [
      h('i.freelog fl-icon-xuanzhong', {}),
      h('div', {}, ['已授权']),
    ]),
  ]);
};

/** 视频资源 DOM */
const videoResource = (url: string): VNode => {
  return h('div.authorized-resource-wrapper', {}, [
    // 视频
    h('video', { props: { src: url, controls: true } }),
    // 已授权按钮
    h('div.toolbar', {}, [
      h('i.freelog fl-icon-xuanzhong', {}),
      h('div', {}, ['已授权']),
    ]),
  ]);
};

/** 音频资源 DOM */
const audioResource = (url: string): VNode => {
  return h('div.authorized-resource-wrapper', {}, [
    // 音频
    h('audio', { props: { src: url, controls: true } }),
    // 已授权按钮
    h('div.toolbar', {}, [
      h('i.freelog fl-icon-xuanzhong', {}),
      h('div', {}, ['已授权']),
    ]),
  ]);
};

/** 文本资源 DOM */
const textResource = (content: string): VNode => {
  return h('div.authorized-resource-wrapper', {}, [
    // 文本
    h('div', {}, [content]),
    // 已授权按钮
    h('div.toolbar', {}, [
      h('i.freelog fl-icon-xuanzhong', {}),
      h('div', {}, ['已授权']),
    ]),
  ]);
};

/** 渲染资源元素 */
const renderResource = (data: any): VNode => {
  if (!data.isAuth) {
    // 未授权资源，无视资源类型，统一渲染未授权资源 DOM
    return unauthorizedResource(data);
  }

  const resourseFirstType = data.resourceType[0];
  if (['图片', '视频', '音频'].includes(resourseFirstType)) {
    // 媒体资源
    const url =
      'https://image.freelog.com/preview-image/f4f110bb9e55ec9910594ec5e8225f39a84c9375.jpg#x=266.51296912453944&y=813.2151264713248&r=0&w=389.2526206575793&h=291.9394654931845&width=720&height=1280';
    if (resourseFirstType === '图片') {
      console.error('图片');
      return imageResource(url);
    } else if (resourseFirstType === '视频') {
      console.error('视频');
      return videoResource(url);
    } else if (resourseFirstType === '音频') {
      console.error('音频');
      return audioResource(url);
    }
  } else if (resourseFirstType === '阅读') {
    // 文本资源
    console.error('阅读');
    return textResource('未授权资源，无视资源类型，统一渲染未授权资源');
  }
  return h('div');
};

/** 将资源元素转为 HTML */
const resourceToHtml = (data: any): string => {
  const html = `
  <span
    data-w-e-type="resource" 
    data-w-e-is-void 
    data-w-e-is-inline 
    data-id="${data.resourceId}"
  >
    此资源来自于 freelog
  </span>`;

  return html;
};

/** 将 HTML 渲染为 DOM */
/** TODO: 不接受异步，目前方案是在 setHtml 前将数据整理好，将数据写入标签 data */
const htmlToResource = (domElem: Element): SlateElement => {
  // const res = await getResourceData(data.id);
  // if (!res) return h('div', {}, []);

  // const link = domElem.getAttribute('data-link') || '';
  // const fileName = domElem.getAttribute('data-fileName') || '';

  const data = {
    type: 'resource',
    resourceId: '61b9a6947841ed002e5c995f',
    resourceName: 'ZhuC/奥克斯的缝',
    resourceType: ['图片'],
    latestVersion: '1.0.3',
    policies: ['免费', 'asdf', 'wcwccw'],
    coverImages: [
      'https://image.freelog.com/preview-image/f4f110bb9e55ec9910594ec5e8225f39a84c9375.jpg#x=266.51296912453944&y=813.2151264713248&r=0&w=389.2526206575793&h=291.9394654931845&width=720&height=1280',
    ],
    isAuth: true,
    children: [{ text: '' }],
  };

  return data;
};

export const renderResourceConfig = {
  type: 'resource',
  renderElem: renderResource,
};

export const resourceToHtmlConfig = {
  type: 'resource',
  elemToHtml: resourceToHtml,
};

export const htmlToResourceConfig = {
  selector: 'span[data-w-e-type="resource"]',
  parseElemHtml: htmlToResource,
};
