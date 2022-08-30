import {
  IToolbarConfig,
  IEditorConfig,
  IButtonMenu,
  IDomEditor,
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
    'myMenu',
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

/** TEST */
class MyMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = 'My menu title'; // 自定义菜单标题
    this.iconSvg =
      '<svg t="1661327645128" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4353" width="200" height="200"><path d="M682.666667 85.333333H341.333333A85.333333 85.333333 0 0 0 256 170.666667v85.333333h512V170.666667A85.333333 85.333333 0 0 0 682.666667 85.333333z m0 56.888889l5.12 0.455111A28.444444 28.444444 0 0 1 711.111111 170.666667v28.444444h-398.222222V170.666667a28.444444 28.444444 0 0 1 28.444444-28.444445h341.333334z" p-id="4354"></path><path d="M796.444444 199.111111H227.555556A85.333333 85.333333 0 0 0 142.222222 284.444444v85.333334h739.555556V284.444444A85.333333 85.333333 0 0 0 796.444444 199.111111z m0 56.888889l5.12 0.455111A28.444444 28.444444 0 0 1 824.888889 284.444444v28.444445h-625.777778V284.444444a28.444444 28.444444 0 0 1 28.444445-28.444444h568.888888z" p-id="4355"></path><path d="M910.222222 312.888889H113.777778A85.333333 85.333333 0 0 0 28.444444 398.222222v455.111111A85.333333 85.333333 0 0 0 113.777778 938.666667h796.444444a85.333333 85.333333 0 0 0 85.333334-85.333334V398.222222A85.333333 85.333333 0 0 0 910.222222 312.888889z m-796.444444 56.888889h796.444444a28.444444 28.444444 0 0 1 28.444445 28.444444v455.111111a28.444444 28.444444 0 0 1-28.444445 28.444445H113.777778a28.444444 28.444444 0 0 1-28.444445-28.444445V398.222222a28.444444 28.444444 0 0 1 28.444445-28.444444z" p-id="4356"></path><path d="M398.222222 512v227.555556l284.444445-113.777778z" p-id="4357"></path></svg>'; // 可选
    this.tag = 'button';
  }

  getValue(): string | boolean {
    return ' helloasdfasdf ';
  }
  isActive(): boolean {
    return false;
  }
  isDisabled(): boolean {
    return false;
  }
  exec(editor: any, value: string | boolean) {
    editor.test();
    editor.insertText(value as string);
  }
}
const myMenuConf = {
  key: 'myMenu',
  factory() {
    return new MyMenu();
  },
};
Boot.registerMenu(myMenuConf);
