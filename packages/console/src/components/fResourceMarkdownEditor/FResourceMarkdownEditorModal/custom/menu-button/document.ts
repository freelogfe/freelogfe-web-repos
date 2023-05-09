/** 编辑器自定义菜单按钮-插入文档资源 */

import { FI18n } from '@freelog/tools-lib';
import { IButtonMenu } from '@wangeditor/editor';

class DocumentBtnMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = FI18n.i18nNext.t('tooltips_insert_post');
    this.iconSvg =
      '<svg t="1663038423866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4809" width="200" height="200"><path d="M832 0H192a128 128 0 0 0-128 128v768a128 128 0 0 0 128 128h640a128 128 0 0 0 128-128V128a128 128 0 0 0-128-128z m0 64a64 64 0 0 1 64 64v768a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h640z" p-id="4810"></path><path d="M768 224v64H256v-64zM768 736v64H256v-64zM768 480v64H256v-64z" p-id="4811"></path></svg>';
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
    editor.setDrawerType('text');
  }
}

export const documentMenuBtnConfig = {
  key: 'document',
  factory() {
    return new DocumentBtnMenu();
  },
};
