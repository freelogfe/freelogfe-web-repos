/** 编辑器配置 */

import { FI18n } from '@freelog/tools-lib';
import { IToolbarConfig, IEditorConfig, Boot } from '@wangeditor/editor';
import {
  audioMenuConfig,
  textMenuConfig,
  importMenuConfig,
  pictureMenuConfig,
  policyMenuConfig,
  videoMenuConfig,
} from './custom-buttons';

/** 工具栏配置 */
export const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    'blockquote',
    '|',
    'bold',
    'through',
    'italic',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'insertLink',
    'insertTable',
    'code',
    'codeBlock',
    'divider',
    'picture',
    'video',
    'audio',
    'text',
    '|',
    'policy',
    'import',
  ],
};

/** 编辑器配置 */
export const editorConfig: Partial<IEditorConfig> = {
  placeholder: FI18n.i18nNext.t('hint_posteditor_contentfiled'),
  hoverbarKeys: {
    link: {
      // 重写 link 元素的 hoverbar
      menuKeys: [],
    },
  },
};

Boot.registerMenu(pictureMenuConfig);
Boot.registerMenu(videoMenuConfig);
Boot.registerMenu(audioMenuConfig);
Boot.registerMenu(textMenuConfig);
Boot.registerMenu(policyMenuConfig);
Boot.registerMenu(importMenuConfig);
