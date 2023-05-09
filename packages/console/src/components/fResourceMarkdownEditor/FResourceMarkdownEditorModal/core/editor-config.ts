/** 编辑器配置 */

import { FI18n } from '@freelog/tools-lib';
import {
  IToolbarConfig,
  IEditorConfig,
  Boot,
  IModuleConf,
  IDomEditor,
  DomEditor,
} from '@wangeditor/editor';
import { audioMenuBtnConfig } from '../custom/menu-button/audio';
import { imageMenuBtnConfig } from '../custom/menu-button/image';
import { importDocumentMenuBtnConfig } from '../custom/menu-button/import-document';
import { policyMenuBtnConfig } from '../custom/menu-button/policy';
import { documentMenuBtnConfig } from '../custom/menu-button/document';
import { videoMenuBtnConfig } from '../custom/menu-button/video';
import {
  htmlToResourceConfig,
  renderResourceConfig,
  resourceToHtmlConfig,
} from '../custom/dom/resource';

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
    'image',
    'video',
    'audio',
    'document',
    '|',
    'policy',
    'importDocument',
  ],
};

/** 编辑器配置 */
export const editorConfig: Partial<IEditorConfig> = {
  placeholder: FI18n.i18nNext.t('hint_posteditor_contentfiled'),
  hoverbarKeys: {
    divider: { menuKeys: [] },
    image: { menuKeys: [] },
    pre: { menuKeys: ['codeBlock', 'codeSelectLang'] },
    table: {
      menuKeys: [
        'tableHeader',
        'insertTableRow',
        'deleteTableRow',
        'insertTableCol',
        'deleteTableCol',
        'deleteTable',
      ],
    },
    video: { menuKeys: [] },
    text: {
      menuKeys: [
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
        'code',
        'codeBlock',
      ],
    },
  },
};

/** 编辑器插件（部分方法重写） */
const plugin = <T extends IDomEditor>(editor: T) => {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (elem) => {
    const type = DomEditor.getNodeType(elem);
    if (['resource'].includes(type)) return true;
    return isInline(elem);
  };

  newEditor.isVoid = (elem) => {
    const type = DomEditor.getNodeType(elem);
    if (['resource'].includes(type)) return true;
    return isVoid(elem);
  };

  return newEditor;
};

const customModule: Partial<IModuleConf> = {
  menus: [
    imageMenuBtnConfig,
    videoMenuBtnConfig,
    audioMenuBtnConfig,
    documentMenuBtnConfig,
    policyMenuBtnConfig,
    importDocumentMenuBtnConfig,
  ],

  editorPlugin: plugin,

  renderElems: [renderResourceConfig],
  elemsToHtml: [resourceToHtmlConfig],
  parseElemsHtml: [htmlToResourceConfig],
};

Boot.registerModule(customModule);
