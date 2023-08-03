/** 编辑器自定义菜单按钮-插入图片资源 */

import { FI18n } from '@freelog/tools-lib';
import { IButtonMenu, IDomEditor } from '@wangeditor/editor';

class ImageMenuBtn implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = FI18n.i18nNext.t('tooltips_insert_image');
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
  isDisabled(editor: IDomEditor): boolean {
    const fragments = editor.getFragment().map((item: any) => item.type);
    const disabled =
      fragments.length > 1 ||
      fragments.includes('pre') ||
      fragments.includes('table');
    return disabled;
  }
  exec(editor: any) {
    editor.setDrawerType('image');
  }
}

export const imageMenuBtnConfig = {
  key: 'image',
  factory() {
    return new ImageMenuBtn();
  },
};
