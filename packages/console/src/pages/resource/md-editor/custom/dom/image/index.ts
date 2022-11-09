/** 编辑器自定义元素-图片 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { CustomResource } from '../../../core/interface';
import { hashImgUrl } from '../../../core/common';
import { defaultCover } from '../../../core/assets';
import { ResourceToolbar } from '../toolbar';
import { FI18n } from '@freelog/tools-lib';

/** 授权状态遮罩 */
const ImageAuthStatus = (data: CustomResource): VNode => {
  if (!data.authType) {
    return h('div');
  }

  const authStatusMapping = {
    1: h('div.image-auth', {}, [
      h('i.freelog fl-icon-suoding'),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_getauth')]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        [FI18n.i18nNext.t('insert_toolbar_btn_getauth')],
      ),
    ]),
    2: h('div.image-auth', {}, [
      h('i.freelog fl-icon-suoding'),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_noauth')]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        [FI18n.i18nNext.t('insert_toolbar_btn_authmanager')],
      ),
    ]),
    3: h('div'),
    4: h('div.image-auth', {}, [
      h('i.freelog fl-icon-shangpao'),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_upcasted')]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              console.error('授权管理');
            },
          },
        },
        [FI18n.i18nNext.t('insert_toolbar_btn_authmanager')],
      ),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 图片资源 DOM */
export const ImageResource = (data: CustomResource): VNode => {
  if ((data.originType === 1 && data.authType === 3) || data.originType === 2) {
    // 授权通过的资源或对象/url
    return h('div.authorized-image', {}, [
      ResourceToolbar(data),
      // 图片
      h('div.image-area', {}, [h('img', { props: { src: data.content } })]),
    ]);
  } else {
    // 未授权通过的资源
    const cover = (data.coverImages && data.coverImages[0]) || defaultCover;

    return h('div.unauthorized-image', {}, [
      ResourceToolbar(data),
      h('div.main-area', {}, [
        // 封面
        h('div.cover', {}, [
          h('img', { props: { src: cover }, style: getCoverStyle(cover) }),
          ImageAuthStatus(data),
        ]),
      ]),
    ]);
  }
};

/** 通过封面图 url 获取封面图片样式 */
const getCoverStyle = (cover: string) => {
  let coverStyle = { width: '100%', height: '100%', transform: 'none' };
  if (cover.includes('#')) {
    const { x, y, w, width: wh, height: ht } = hashImgUrl(cover);
    const scale: number = 400 / w;
    coverStyle = {
      width: wh * scale + 'px',
      height: ht * scale + 'px',
      transform: `translateX(${-x * scale}px) translateY(${-y * scale}px)`,
    };
  }

  return coverStyle;
};
