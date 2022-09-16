/** 编辑器自定义菜单按钮 */

import { IButtonMenu } from '@wangeditor/editor';

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
    editor.openDrawer('image');
  }
}
export const pictureMenuConfig = {
  key: 'picture',
  factory() {
    return new PictureMenu();
  },
};

/** 插入视频资源 */
class VideoMenu implements IButtonMenu {
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
export const videoMenuConfig = {
  key: 'video',
  factory() {
    return new VideoMenu();
  },
};

/** 插入音频资源 */
class AudioMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = '插入音频资源';
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
  isDisabled(): boolean {
    return false;
  }
  exec(editor: any) {
    editor.openDrawer('audio');
  }
}
export const audioMenuConfig = {
  key: 'audio',
  factory() {
    return new AudioMenu();
  },
};

/** 插入文档资源 */
class TextMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = '插入文档资源';
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
    editor.openDrawer('text');
  }
}
export const textMenuConfig = {
  key: 'text',
  factory() {
    return new TextMenu();
  },
};

/** 获取授权 */
class PolicyMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = '获取授权';
    this.iconSvg =
      '<svg t="1663038568850" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4960" width="200" height="200"><path d="M768 56.888889l9.329778 0.284444a142.222222 142.222222 0 0 1 132.551111 132.551111L910.222222 199.111111v113.777778h-56.888889v-113.777778l-0.398222-8.192a85.333333 85.333333 0 0 0-76.743111-76.8L768 113.777778h-568.888889l-8.192 0.398222a85.333333 85.333333 0 0 0-76.8 76.743111L113.777778 199.111111v682.666667l0.398222 8.192a85.333333 85.333333 0 0 0 76.743111 76.8L199.111111 967.111111h170.666667v56.888889h-170.666667l-9.329778-0.284444a142.222222 142.222222 0 0 1-132.551111-132.551112L56.888889 881.777778v-682.666667l0.284444-9.329778a142.222222 142.222222 0 0 1 132.551111-132.551111L199.111111 56.888889h568.888889zM682.666667 426.666667a256 256 0 0 1 193.422222 423.708444l86.243555 129.422222-47.331555 31.516445-81.351111-121.912889A256 256 0 1 1 682.666667 426.666667z m0 56.888889a199.111111 199.111111 0 1 0 119.409777 358.456888l-0.853333-1.365333 13.482667-8.931555A199.111111 199.111111 0 0 0 682.666667 483.555556z m-312.888889 227.555555v56.888889h-113.777778v-56.888889h113.777778z m56.888889-227.555555v56.888888h-170.666667v-56.888888h170.666667z m284.444444-227.555556v56.888889h-455.111111v-56.888889h455.111111z" p-id="4961"></path></svg>';
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
    editor.openDrawer('policy');
  }
}
export const policyMenuConfig = {
  key: 'policy',
  factory() {
    return new PolicyMenu();
  },
};

/** 导入文档 */
class ImportMenu implements IButtonMenu {
  title: string;
  tag: string;
  iconSvg: string;

  constructor() {
    this.title = '导入文档';
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
export const importMenuConfig = {
  key: 'import',
  factory() {
    return new ImportMenu();
  },
};
