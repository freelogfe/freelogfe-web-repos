/** 编辑器自定义元素-资源 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { SlateElement } from '@wangeditor/editor';
import { CustomResource } from '../../../core/interface';
import { hashImgUrl } from '../../../core/common';
import { defaultCover } from '../../../core/assets';

/** 获取资源信息与授权状态 */
const getResourceData = async (id: string) => {
  const [resourceRes, authRes] = await Promise.all([
    FServiceAPI.Resource.info({ resourceIdOrName: id }),
    FServiceAPI.Resource.batchAuth({ resourceIds: id }),
    FServiceAPI.Resource.info({ resourceIdOrName: id }),
  ]);
  if (resourceRes.errCode !== 0 || authRes.errCode !== 0) return null;

  const resourceData = resourceRes.data;
  const authData = authRes.data[0];
  return [resourceData, authData];
};

/** 未授权资源 DOM */
const unauthorizedResource = (data: CustomResource): VNode => {
  const {
    resourceId,
    coverImages,
    resourceName,
    resourceType,
    latestVersion,
    policies,
    authType,
  } = data;

  // 整理封面尺寸与坐标
  const cover = coverImages[0] || defaultCover;
  let coverStyle = { width: '100%', height: '100%', transform: 'none' };
  if (cover.includes('#')) {
    const { x, y, w, width: wh, height: ht } = hashImgUrl(cover);
    const scale: number = 280 / w;
    coverStyle = {
      width: wh * scale + 'px',
      height: ht * scale + 'px',
      transform: `translateX(${-x * scale}px) translateY(${-y * scale}px)`,
    };
  }

  // 过滤已上架策略
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
      authType === 0
        ? // 未授权
          h('div.right-area unauthorized', {}, [
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
          ])
        : // 上抛
          h('div.right-area upcast', {}, [
            h('i.freelog fl-icon-shangpao'),
            h('div.tip', {}, ['资源已上抛']),
            h('div.desc', {}, [FI18n.i18nNext.t('info_posteditor_upcast')]),
            h(
              'div.auth-btn',
              {
                on: {
                  click() {
                    console.error('打开授权弹窗');
                  },
                },
              },
              [FI18n.i18nNext.t('btn_view_authdetails')],
            ),
          ]),
    ],
  );
};

/** 工具栏授权状态 */
const ToolbarAuthStatus = (data: CustomResource): VNode => {
  const authStatusMapping = {
    1: h('div.toolbar-auth', {}, [
      h(
        'div.authorize-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        ['处理授权'],
      ),
    ]),
    2: h('div.toolbar-auth', {}, [
      h('i.freelog fl-icon-suoding'),
      h('div.auth-text unauthorized-text', {}, ['待授权']),
      h(
        'div.authorize-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        ['授权管理'],
      ),
    ]),
    3: h('div.toolbar-auth', {}, [
      h('i.freelog fl-icon-a-chenggongzhengqueduigou1'),
      h('div.auth-text authorize-text', {}, ['已授权']),
      h(
        'div.authorize-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        ['授权管理'],
      ),
    ]),
    4: h('div.toolbar-auth', {}, [
      h('i.freelog fl-icon-shangpao'),
      h('div.auth-text upcast-text', {}, ['已上抛']),
      h(
        'div.authorize-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        ['授权管理'],
      ),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 资源工具栏 */
const ResourceToolbar = (data: CustomResource): VNode => {
  const toolbar = h('div.resource-toolbar', {}, [
    h('div.toolbar', {}, [
      h('div.type', {}, [
        // TODO 类型，目前写死
        '资源',
      ]),
      h(
        'div.name',
        {
          title: data.resourceName,
          on: {
            click() {
              window.open(
                FUtil.LinkTo.resourceDetails({
                  resourceID: data.resourceId,
                }),
              );
            },
          },
        },
        [data.resourceName],
      ),
      ToolbarAuthStatus(data),
    ]),
  ]);

  return toolbar;
};

/** 图片 dom 授权状态 */
const ImageAuthStatus = (data: CustomResource): VNode => {
  const authStatusMapping = {
    1: h('div.image-auth', {}, [
      h('i.freelog fl-icon-suoding', {
        on: {
          click() {
            console.error('授权管理');
          },
        },
      }),
      h('div.auth-text', {}, ['引用资源作为文章的依赖，需处理授权']),
    ]),
    2: h('div.image-auth', {}, [
      h('i.freelog fl-icon-suoding', {
        on: {
          click() {
            console.error('授权管理');
          },
        },
      }),
      h('div.auth-text', {}, ['已签约，未获得授权']),
    ]),
    3: h('div'),
    4: h('div.image-auth', {}, [
      h('i.freelog fl-icon-shangpao'),
      h('div.auth-text', {}, ['已上抛，将由资源创作者/节点商处理授权']),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 图片资源 DOM */
const ImageResource = (data: CustomResource): VNode => {
  // 整理封面尺寸与坐标
  const cover = data.coverImages[0] || defaultCover;
  let coverStyle = { width: '100%', height: '100%', transform: 'none' };
  if (cover.includes('#')) {
    const { x, y, w, width: wh, height: ht } = hashImgUrl(cover);
    const scale: number = 280 / w;
    coverStyle = {
      width: wh * scale + 'px',
      height: ht * scale + 'px',
      transform: `translateX(${-x * scale}px) translateY(${-y * scale}px)`,
    };
  }

  // 未授权通过
  const unauthorizedImage = h('div.unauthorized-image', {}, [
    h('div.cover', {}, [
      h('img', {
        props: { src: cover },
        style: coverStyle,
      }),
      ImageAuthStatus(data),
    ]),
    ResourceToolbar(data),
  ]);

  // 已授权通过
  const authorizedImage = h('div.authorized-image', {}, [
    // 图片
    h('img', { props: { src: data.content } }),
    ResourceToolbar(data),
  ]);

  return data.authType === 3 ? authorizedImage : unauthorizedImage;
};

/** 视频资源 DOM */
const VideoResource = (url: string): VNode => {
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
const AudioResource = (url: string): VNode => {
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
const TextResource = (content: string): VNode => {
  setTimeout(() => {
    const docContent = document.getElementById('docContent');
    if (!docContent) return;
    docContent.innerHTML = content;
  }, 0);
  return h('div.authorized-resource-wrapper', {}, [
    // 文本
    h('div#docContent'),
    // 已授权按钮
    h('div.toolbar', {}, [
      h('i.freelog fl-icon-xuanzhong', {}),
      h('div', {}, ['已授权']),
    ]),
  ]);
};

/** 渲染资源元素 */
const renderResource = (data: CustomResource): VNode => {
  const resourseFirstType = data.resourceType[0];
  if (resourseFirstType === '图片') {
    return ImageResource(data);
  } else if (resourseFirstType === '视频') {
    return VideoResource(data.content);
  } else if (resourseFirstType === '音频') {
    return AudioResource(data.content);
  } else if (resourseFirstType === '阅读') {
    return TextResource(data.content);
  }
  return h('div');
};

/** 将资源元素转为 HTML */
const resourceToHtml = (data: CustomResource): string => {
  const html = `
    <span
      data-w-e-type="resource"
      data-w-e-is-void
      data-w-e-is-inline
      data-resourceId="${data.resourceId}"
      data-authType="${data.authType}"
      data-resourceName="${data.resourceName}"
      data-coverImages="${JSON.stringify(data.coverImages)}"
      data-resourceType="${JSON.stringify(data.resourceType)}"
      data-latestVersion="${data.latestVersion}"
      data-version="${data.version || data.latestVersion}"
      data-policies="${JSON.stringify(data.policies)}"
      data-content="${data.content}"
    >
      此资源来自于 freelog
    </span>
  `;

  return html;
};

/** 将 HTML 渲染为 DOM */
/** TODO: 不接受异步，目前方案是在 setHtml 前将数据整理好，将数据写入标签 data */
const htmlToResource = (domElem: Element): SlateElement => {
  const resourceId = domElem.getAttribute('data-resourceId') || '';
  const authType = domElem.getAttribute('data-authType') || '';
  const resourceName = domElem.getAttribute('data-resourceName') || '';
  const coverImages = domElem.getAttribute('data-coverImages') || '';
  const resourceType = domElem.getAttribute('data-resourceType') || '';
  const latestVersion = domElem.getAttribute('data-latestVersion') || '';
  const version = domElem.getAttribute('data-version') || '';
  const policies = domElem.getAttribute('data-policies') || '';
  const content = domElem.getAttribute('data-content') || '';

  const data = {
    resourceId,
    authType: Number(authType),
    resourceName,
    coverImages: JSON.parse(coverImages),
    resourceType: JSON.parse(resourceType),
    latestVersion,
    version,
    policies: JSON.parse(policies),
    content,
    type: 'resource',
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
