/** 编辑器自定义元素-资源 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { FI18n, FUtil } from '@freelog/tools-lib';

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

const renderResource = (data: any): VNode => {
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

  /** 未授权资源 DOM */
  const unauthorizedResource = h(
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
          policies.length
            ? h('div.tags-wrapper', {}, [
                ...policies.map((policy: { policyName: string }) =>
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

  /** 已授权资源 DOM */
  // const authorizedResource = h('div.authorized-resource-wrapper', {}, [
  //   // 图片
  //   h('img', { props: { src: cover } }),
  //   // 已授权按钮
  //   h('div.toolbar', {}, [
  //     h('i.freelog fl-icon-xuanzhong', {}),
  //     h('div', {}, ['已授权']),
  //   ]),
  // ]);

  /** 已授权资源 DOM */
  // const authorizedResource = h('div.authorized-resource-wrapper', {}, [
  //   // 视频
  //   h('video', { props: { src: cover, controls: true } }),
  //   // 已授权按钮
  //   h('div.toolbar', {}, [
  //     h('i.freelog fl-icon-xuanzhong', {}),
  //     h('div', {}, ['已授权']),
  //   ]),
  // ]);

  /** 已授权资源 DOM */
  const authorizedResource = h('div.authorized-resource-wrapper', {}, [
    // 音频
    h('audio', { props: { src: cover, controls: true } }),
    // 已授权按钮
    h('div.toolbar', {}, [
      h('i.freelog fl-icon-xuanzhong', {}),
      h('div', {}, ['已授权']),
    ]),
  ]);

  return unauthorizedResource;
};

export const resourceDomConfig = {
  type: 'resource',
  renderElem: renderResource,
};
