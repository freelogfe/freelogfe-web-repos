/** 编辑器自定义元素组件-工具栏 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { CustomResource } from '../../../core/interface';

/** 工具栏授权状态 */
const ToolbarAuthStatus = (data: CustomResource, editor: any): VNode => {
  if (!data.authType) {
    return h('div');
  }

  const authStatusMapping = {
    1: h('div.toolbar-auth', {}, [
      h(
        'div.authorize-btn',
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
    2: h('div.toolbar-auth', {}, [
      h('i.freelog fl-icon-suoding'),
      h('div.auth-text unauthorized-text', {}, [
        FI18n.i18nNext.t('mdeditor_auth_noauth'),
      ]),
      h(
        'div.authorize-btn',
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
    3: h('div.toolbar-auth', {}, [
      h('i.freelog fl-icon-a-chenggongzhengqueduigou1'),
      h('div.auth-text authorize-text', {}, [
        FI18n.i18nNext.t('mdeditor_auth_authorized'),
      ]),
      h(
        'div.authorize-btn',
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
    4: h('div.toolbar-auth', {}, [
      h('i.freelog fl-icon-shangpao'),
      h('div.auth-text upcast-text', {}, [
        FI18n.i18nNext.t('mdeditor_auth_upcasted'),
      ]),
      h(
        'div.authorize-btn',
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
    5: h('div.toolbar-auth', {}, [
      h('div.auth-text upcast-text', {}, [
        FI18n.i18nNext.t('mdeditor_auth_abnormal'),
      ]),
      h(
        'div.authorize-btn',
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
    6: h('div'),
  };

  return authStatusMapping[data.authType];
};

/** 资源工具栏 */
export const ResourceToolbar = (data: CustomResource, editor: any): VNode => {
  const { originType, resourceName, resourceId, content } = data;
  if (originType === 1) {
    return h('div.resource-toolbar', {}, [
      h('div.toolbar', {}, [
        h('div.type', {}, [FI18n.i18nNext.t('insert_toolbar_type_resource')]),
        h(
          'div.name',
          {
            title: resourceName,
            on: {
              click() {
                window.open(
                  FUtil.LinkTo.resourceDetails({
                    resourceID: resourceId || '',
                  }),
                );
              },
            },
          },
          [resourceName],
        ),
        ToolbarAuthStatus(data, editor),
      ]),
    ]);
  } else if (originType === 2) {
    return h('div.resource-toolbar', {}, [
      h('div.toolbar', {}, [
        h('div.type', {}, [FI18n.i18nNext.t('insert_toolbar_type_url')]),
        h('div.url', { title: content }, [content]),
        ToolbarAuthStatus(data, editor),
      ]),
    ]);
  } else {
    return h('div');
  }
};
