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
      '<svg t="1678159427346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4493" width="200" height="200"><path d="M170.642286 0C95.305143 0 33.645714 58.660571 28.745143 132.900571l-0.292572 9.289143v739.620572c0 75.337143 58.660571 137.069714 132.827429 141.897143l9.362286 0.292571h568.905143c75.410286 0 137.142857-58.660571 141.897142-132.900571l0.365715-9.289143h-56.905143c0 44.324571-33.865143 80.749714-77.165714 84.845714l-8.192 0.438857H170.642286a85.357714 85.357714 0 0 1-84.918857-77.092571l-0.365715-8.192V142.189714c0-44.324571 33.792-80.749714 77.092572-84.845714l8.192-0.438857h568.905143c44.397714 0 80.822857 33.792 84.918857 77.092571l0.438857 8.192h56.905143c0-75.337143-58.733714-137.069714-132.900572-141.897143L739.547429 0H170.642286z" p-id="4494"></path><path d="M853.357714 256L625.810286 512l227.474285 256V597.357714H1024V426.642286h-170.642286V256z" p-id="4495"></path><path d="M568.905143 256v73.142857H227.474286v-73.142857zM568.905143 711.094857v73.142857H227.474286v-73.142857zM455.094857 483.547429v73.142857h-227.474286v-73.142857z" p-id="4496"></path></svg>';
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
