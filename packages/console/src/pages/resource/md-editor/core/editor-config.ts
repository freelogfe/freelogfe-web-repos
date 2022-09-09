/** 编辑器配置 */

import { IToolbarConfig, IEditorConfig, Boot } from '@wangeditor/editor';
import { importMenuConfig, pictureMenuConfig } from './custom-buttons';

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
    {
      key: 'group-image',
      title: '图片',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
      menuKeys: ['insertImage', 'uploadImage'],
    },
    {
      key: 'group-video',
      title: '视频',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z"></path></svg>',
      menuKeys: ['insertVideo', 'uploadVideo'],
    },
    'picture',
    'picture',
    '|',
    'picture',
    'import',
  ],
};

/** 编辑器配置 */
export const editorConfig: Partial<IEditorConfig> = {
  placeholder: '输入内容...',
  hoverbarKeys: {
    link: {
      // 重写 link 元素的 hoverbar
      menuKeys: [],
    },
  },
};

Boot.registerMenu(pictureMenuConfig);
Boot.registerMenu(importMenuConfig);
