/** 编辑器自定义元素-文档 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { CustomResource } from '../../../core/interface';
import { ResourceToolbar } from '../toolbar';
import { FI18n } from '@freelog/tools-lib';

/** 授权状态遮罩 */
const DocumentAuthStatus = (data: CustomResource, editor: any): VNode => {
  if (!data.authType) {
    return h('div');
  }

  const authStatusMapping = {
    1: h('div.document-auth', {}, [
      h('div.tip', {}, [
        h('i.freelog fl-icon-suoding'),
        h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_getauth')]),
      ]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              editor.openPolicyDrawer(data);
            },
          },
        },
        [FI18n.i18nNext.t('insert_toolbar_btn_getauth')],
      ),
    ]),
    2: h('div.document-auth', {}, [
      h('div.tip', {}, [
        h('i.freelog fl-icon-suoding'),
        h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_noauth')]),
      ]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              editor.openPolicyDrawer(data);
            },
          },
        },
        [FI18n.i18nNext.t('insert_toolbar_btn_authmanager')],
      ),
    ]),
    3: h('div'),
    4: h('div.document-auth', {}, [
      h('div.tip upcast', {}, [
        h('i.freelog fl-icon-shangpao'),
        h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_upcasted')]),
      ]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              editor.openPolicyDrawer(data);
            },
          },
        },
        [FI18n.i18nNext.t('insert_toolbar_btn_authmanager')],
      ),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 文档资源 DOM */
export const DocumentResource = (data: CustomResource, editor: any): VNode => {
  // 未授权通过
  const unauthorizedDocument = h('div.unauthorized-document', {}, [
    ResourceToolbar(data, editor),
    h('div.main-area', {}, [
      // 默认 ui
      h('div.row', {}, [h('div.mini'), h('div.mini')]),
      h('div.row', {}, [h('div.small'), h('div.small'), h('div.small')]),
      h('div.row', {}, [h('div.large'), h('div.large')]),
      h('div.row', {}, [h('div.middle')]),
      DocumentAuthStatus(data, editor),
    ]),
  ]);

  // 已授权通过
  const authorizedDocment = h('div.authorized-document', {}, [
    ResourceToolbar(data, editor),
    // 文档
    h('div.document-area', { props: { innerHTML: data.content } }, [
      h('div#docContent'),
    ]),
  ]);

  return data.authType === 3 ? authorizedDocment : unauthorizedDocument;
};
