/** 编辑器自定义菜单按钮-导入文档 */

import { FI18n } from '@freelog/tools-lib';
import { IButtonMenu } from '@wangeditor/editor';

class ImportDocumentBtnMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = FI18n.i18nNext.t('tooltip_importpost');
    this.iconSvg =
      '<svg t="1662440340178" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4655" width="200" height="200"><path d="M113.777778 682.666667v227.555555h796.444444v-227.555555h56.888889v284.444444H56.888889v-284.444444h56.888889zM512 85.333333a28.444444 28.444444 0 0 1 27.989333 23.324445L540.444444 113.777778v500.224l178.972445-179.029334a28.444444 28.444444 0 0 1 36.295111-3.242666l3.982222 3.242666a28.444444 28.444444 0 0 1 3.242667 36.295112l-3.242667 3.982222-227.555555 227.555555-0.739556 0.625778a28.615111 28.615111 0 0 1-2.218667 1.877333l2.958223-2.503111A28.558222 28.558222 0 0 1 512 711.111111h-1.137778a28.615111 28.615111 0 0 1-2.958222-0.284444L512 711.111111a28.558222 28.558222 0 0 1-16.156444-5.063111l-1.024-0.739556a28.615111 28.615111 0 0 1-2.275556-1.877333l-0.682667-0.625778-227.555555-227.555555a28.444444 28.444444 0 0 1 36.295111-43.52l3.982222 3.242666L483.555556 614.001778V113.777778a28.444444 28.444444 0 0 1 28.444444-28.444445z" fill="#333333" p-id="4656"></path></svg>';
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
    editor.openUploadDrawer();
  }
}

export const importDocumentMenuBtnConfig = {
  key: 'importDocument',
  factory() {
    return new ImportDocumentBtnMenu();
  },
};
