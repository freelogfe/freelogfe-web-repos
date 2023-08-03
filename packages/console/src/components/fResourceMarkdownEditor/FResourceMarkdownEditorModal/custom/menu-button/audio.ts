/** 编辑器自定义菜单按钮-插入音频资源 */

import { FI18n } from '@freelog/tools-lib';
import { IButtonMenu, IDomEditor } from '@wangeditor/editor';

class AudioBtnMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = FI18n.i18nNext.t('tooltip_insert_audio');
    this.iconSvg =
      '<svg t="1663038314224" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4658" width="200" height="200"><path d="M503.580444 52.451556a85.333333 85.333333 0 0 0-51.939555 24.576L272.611556 256H113.777778A85.333333 85.333333 0 0 0 28.444444 341.333333v341.333334l0.398223 8.192A85.333333 85.333333 0 0 0 113.777778 768h158.890666l178.972445 178.972444a85.333333 85.333333 0 0 0 145.692444-60.302222V137.329778A85.333333 85.333333 0 0 0 512 51.996444l-8.419556 0.455112zM512 108.885333a28.444444 28.444444 0 0 1 28.444444 28.444445v749.340444a28.444444 28.444444 0 0 1-48.583111 20.081778L296.220444 711.111111H113.777778a28.444444 28.444444 0 0 1-28.444445-28.444444V341.333333a28.444444 28.444444 0 0 1 28.444445-28.444444h182.442666l195.697778-195.697778A28.444444 28.444444 0 0 1 512 108.942222zM702.805333 321.194667c121.400889 121.457778 124.757333 249.400889 10.069334 371.143111l-10.069334 10.467555-40.277333-40.277333c99.498667-99.441778 102.570667-192.398222 9.329778-291.498667l-9.329778-9.557333 40.277333-40.277333z" p-id="4659"></path><path d="M816.583111 150.528c234.382222 234.382222 238.535111 475.477333 12.515556 710.144l-12.515556 12.8-40.277333-40.277333c212.48-212.423111 216.405333-418.190222 11.832889-630.385778l-11.832889-12.003556 40.277333-40.277333z" p-id="4660"></path></svg>';
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
    editor.setDrawerType('audio');
  }
}

export const audioMenuBtnConfig = {
  key: 'audio',
  factory() {
    return new AudioBtnMenu();
  },
};
