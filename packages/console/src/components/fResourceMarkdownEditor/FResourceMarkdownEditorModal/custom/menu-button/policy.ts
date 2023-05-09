/** 编辑器自定义菜单按钮-获取授权 */

import { FI18n } from '@freelog/tools-lib';
import { IButtonMenu } from '@wangeditor/editor';

class PolicyBtnMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = FI18n.i18nNext.t('tooltip_posteditor_getauth');
    this.iconSvg =
      '<svg t="1667358792216" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4390" width="200" height="200"><path d="M392 536H152c-61.856 0-112 50.144-112 112v240c0 61.856 50.144 112 112 112h240c61.856 0 112-50.144 112-112V648c0-61.856-50.144-112-112-112z m-240 64h240a48 48 0 0 1 48 48v240a48 48 0 0 1-48 48H152a48 48 0 0 1-48-48V648a48 48 0 0 1 48-48zM392 24H152C90.144 24 40 74.144 40 136v240c0 61.856 50.144 112 112 112h240c61.856 0 112-50.144 112-112V136c0-61.856-50.144-112-112-112z m-240 64h240a48 48 0 0 1 48 48v240a48 48 0 0 1-48 48H152a48 48 0 0 1-48-48V136a48 48 0 0 1 48-48z" p-id="4391"></path><path d="M362.744 168.08l42.512 47.84L238.72 363.96 137.376 262.624l45.248-45.248 58.664 58.656zM362.744 680.08l42.512 47.84-166.544 148.04-101.336-101.336 45.248-45.248 58.664 58.656zM984 328v64H600v-64zM984 120v64H600v-64zM984 632v64H600v-64zM984 840v64H600v-64z" p-id="4392"></path></svg>';
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
    editor.openPolicyDrawer();
  }
}

export const policyMenuBtnConfig = {
  key: 'policy',
  factory() {
    return new PolicyBtnMenu();
  },
};
