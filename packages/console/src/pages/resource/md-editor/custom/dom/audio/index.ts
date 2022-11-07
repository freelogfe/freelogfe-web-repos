/** 编辑器自定义元素-音频 */

import './index.less';
import { h, VNode } from 'snabbdom';
import { CustomResource } from '../../../core/interface';
import { ResourceToolbar } from '../toolbar';
import { FI18n } from '@freelog/tools-lib';

/** 授权状态遮罩 */
const AudioAuthStatus = (data: CustomResource): VNode => {
  if (!data.authType) {
    return h('div');
  }

  const authStatusMapping = {
    1: h('div.audio-auth', {}, [
      h('i.freelog fl-icon-suoding', {
        on: {
          click() {
            console.error('授权管理');
          },
        },
      }),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_getauth')]),
    ]),
    2: h('div.audio-auth', {}, [
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
    4: h('div.audio-auth upcast', {}, [
      h('i.freelog fl-icon-shangpao'),
      h('div.auth-text', {}, [FI18n.i18nNext.t('insert_msg_upcasted')]),
    ]),
  };

  return authStatusMapping[data.authType];
};

/** 音频资源 DOM */
export const AudioResource = (data: CustomResource): VNode => {
  const audio = h('div.audio-wrapper', {}, [
    ResourceToolbar(data),
    // 音频
    h('div.audio-area', {}, [
      h('audio', {
        props: {
          src: data.content,
          controls: true,
          controlsList: 'nodownload',
        },
      }),
      AudioAuthStatus(data),
    ]),
  ]);

  return audio;
};
