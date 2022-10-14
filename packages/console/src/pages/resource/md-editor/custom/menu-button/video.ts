/** 编辑器自定义菜单按钮-插入视频资源 */

import { IButtonMenu } from '@wangeditor/editor';

class VideoMenuBtn implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = '插入视频资源';
    this.iconSvg =
      '<svg t="1663038226022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4357" width="200" height="200"><path d="M896 128H128a128 128 0 0 0-128 128v512a128 128 0 0 0 128 128h768a128 128 0 0 0 128-128V256a128 128 0 0 0-128-128z m0 64a64 64 0 0 1 64 64v512a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V256a64 64 0 0 1 64-64h768z" p-id="4358"></path><path d="M672 512l-256 160v-320z" p-id="4359"></path></svg>';
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
    editor.openDrawer('video');
  }
}

export const videoMenuBtnConfig = {
  key: 'video',
  factory() {
    return new VideoMenuBtn();
  },
};
