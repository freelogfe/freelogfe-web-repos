/** 编辑器自定义元素-文档 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { CustomResource } from '../../../core/interface';
import { ResourceToolbar } from '../toolbar';
import { FI18n } from '@freelog/tools-lib';

/** 授权状态遮罩 */
const DocumentAuthStatus = (data: CustomResource): VNode => {
  if (!data.authType) {
    return h('div');
  }
  
  const authStatusMapping = {
    1: h('div.document-auth', {}, [
      h('i.freelog fl-icon-suoding', {
        on: {
          click() {
            console.error('授权管理');
          },
        },
      }),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_getauth')]),
    ]),
    2: h('div.document-auth', {}, [
      h('i.freelog fl-icon-suoding', {
        on: {
          click() {
            console.error('授权管理');
          },
        },
      }),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_noauth')]),
    ]),
    3: h('div'),
    4: h('div.document-auth upcast', {}, [
      h('i.freelog fl-icon-shangpao'),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_upcasted')]),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 文档资源 DOM */
export const DocumentResource = (data: CustomResource): VNode => {
  // 未授权通过
  const unauthorizedDocument = h('div.unauthorized-document', {}, [
    ResourceToolbar(data),
    h('div.main-area', {}, [
      // 默认 ui
      h('div.row', {}, [h('div.mini'), h('div.mini')]),
      h('div.row', {}, [h('div.small'), h('div.small'), h('div.small')]),
      h('div.row', {}, [h('div.large'), h('div.large')]),
      h('div.row', {}, [h('div.middle')]),
      DocumentAuthStatus(data),
    ]),
  ]);

  // 已授权通过
  const authorizedDocment = h('div.authorized-document', {}, [
    ResourceToolbar(data),
    // 文档
    h('div.document-area', {}, [h('div#docContent')]),
  ]);

  if (data.authType === 3) {
    // 已授权通过，渲染文档 html
    setTimeout(() => {
      const docContent = document.getElementById('docContent');
      if (!docContent) return;
      docContent.innerHTML = data.content;
    }, 0);
  }

  return data.authType === 3 ? authorizedDocment : unauthorizedDocument;
};