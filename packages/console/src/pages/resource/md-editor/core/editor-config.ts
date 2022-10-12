/** 编辑器配置 */

import { FI18n } from '@freelog/tools-lib';
import {
  IToolbarConfig,
  IEditorConfig,
  Boot,
  IModuleConf,
} from '@wangeditor/editor';
import {
  audioMenuConfig,
  importMenuConfig,
  pictureMenuConfig,
  policyMenuConfig,
  textMenuConfig,
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

const customModule: Partial<IModuleConf> = {
  menus: [
    pictureMenuConfig,
    videoMenuConfig,
    audioMenuConfig,
    textMenuConfig,
    policyMenuConfig,
    importMenuConfig,
  ],
};

Boot.registerModule(customModule);
