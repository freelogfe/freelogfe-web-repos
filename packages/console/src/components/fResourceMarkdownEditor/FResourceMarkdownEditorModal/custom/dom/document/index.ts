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
    5: h('div.document-auth', {}, [
      h('div.tip upcast', {}, [
        h('div.auth-text', {}, [FI18n.i18nNext.t('mdeditor_auth_abnormal')]),
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
    6: h('div.document-auth', {}, [
      h('div.tip upcast', {}, [
        h('div.auth-text', {}, [
          FI18n.i18nNext.t('posteditor_import_addrely_msg'),
        ]),
      ]),
      h(
        'div.auth-btn',
        {
          on: {
            click() {
              const target = {
                id: data.resourceId,
                name: data.resourceName,
                type: 'resource',
                versionRange: data.version || data.latestVersion,
              };
              editor.addRely(target);
              editor.openPolicyDrawer(data);
            },
          },
        },
        [FI18n.i18nNext.t('posteditor_import_addrely_btn')],
      ),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 文档资源 DOM */
export const DocumentResource = (data: CustomResource, editor: any): VNode => {
  if (data.originType === 3) {
    // 无效依赖（不存在依赖或类型错误依赖）
    return h('div.invalid-document', {}, [
      h('div.main-area', {}, [
        // 默认 ui
        h('div.row', {}, [h('div.mini'), h('div.mini')]),
        h('div.row', {}, [h('div.small'), h('div.small'), h('div.small')]),
        h('div.row', {}, [h('div.large'), h('div.large')]),
        h('div.row', {}, [h('div.middle')]),
      ]),
      h('div.invalid-tip', {}, [
        FI18n.i18nNext.t('posteditor_insert_error_invalid', {
          ContentInfo: data.resourceName,
        }),
      ]),
    ]);
  } else if (data.authType === 3) {
    // 已授权通过
    return h('div.authorized-document', {}, [
      ResourceToolbar(data, editor),
      // 文档
      h('div.document-area', { props: { innerHTML: data.content } }, [
        h('div#docContent'),
      ]),
    ]);
  } else {
    // 未授权通过
    return h('div.unauthorized-document', {}, [
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
  }
};
