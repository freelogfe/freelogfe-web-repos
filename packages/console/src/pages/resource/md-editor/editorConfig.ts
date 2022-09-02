import {
  IToolbarConfig,
  IEditorConfig,
  IButtonMenu,
  Boot,
} from '@wangeditor/editor';

/** 工具栏配置 */
export const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    {
      key: 'headerSelect',
      title: 'H',
      menuKeys: ['header1', 'header2', 'header3', 'header4', 'header5'],
    },
    'bold',
    'italic',
    'through',
    'bulletedList',
    'numberedList',
    'blockquote',
    'insertLink',
    'emotion',
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
    'insertTable',
    'code',
    'codeBlock',
    'divider',
    '|',
    'undo',
    'redo',
    'fullScreen',
    'pictureMenu',
  ],
};

/** 编辑器配置 */
export const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容',
  hoverbarKeys: {
    link: {
      // 重写 link 元素的 hoverbar
      menuKeys: [],
    },
  },
};

/** 插入图片资源 */
class PictureMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = '插入图片资源';
    this.iconSvg =
      '<div class=""><svg t="1661926260314" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4207" width="200" height="200"><path d="M910.222222 113.777778a113.777778 113.777778 0 0 1 113.777778 113.777778v568.888888a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V227.555556a113.777778 113.777778 0 0 1 113.777778-113.777778h796.444444z m0 56.888889H113.777778a56.888889 56.888889 0 0 0-56.490667 50.232889L56.888889 227.555556v568.888888a56.888889 56.888889 0 0 0 50.232889 56.490667L113.777778 853.333333h796.444444a56.888889 56.888889 0 0 0 56.490667-50.232889L967.111111 796.444444V227.555556a56.888889 56.888889 0 0 0-50.232889-56.490667L910.222222 170.666667zM342.243556 323.925333l126.236444 315.562667 160.938667-107.178667 244.053333 244.053334-40.277333 40.220444-211.057778-211.114667-180.394667 120.32-101.376-253.269333-143.530666 335.132445-52.337778-22.414223 197.745778-461.368889zM682.666667 227.555556a113.777778 113.777778 0 1 1 0 227.555555 113.777778 113.777778 0 0 1 0-227.555555z m0 56.888888a56.888889 56.888889 0 1 0 0 113.777778 56.888889 56.888889 0 0 0 0-113.777778z" fill="#222222" p-id="4208"></path></svg></div>';
    this.tag = 'button';
  }

  getValue(): string | boolean {
    return false;
  }
  isActive(): boolean {
    return false;
  }
  isDisabled(): boolean {
    return false;
  }
  exec(editor: any) {
    editor.openDrawer('图片');
  }
}
const pictureMenuBtnConf = {
  key: 'pictureMenu',
  factory() {
    return new PictureMenu();
  },
};
Boot.registerMenu(pictureMenuBtnConf);
