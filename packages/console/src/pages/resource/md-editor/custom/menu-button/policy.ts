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
    // editor.openDrawer('policy');

    const data = {
      type: 'resource',
      resourceName: 'ZhuC/奥克斯的缝难看懒得发手法十分是否奥克斯的缝难看懒得发手法十分是否奥克斯的缝难看懒得发手法十分是否',
      resourceType: '图片',
      version: '1.0.3',
      policy: ['免费', 'asdf', 'wcwccw'],
      auth: false,
      coverImages: [
        'https://image.freelog.com/preview-image/3cdcfa8ddf3340ef8dbfcaebae5a9720eeeca5a2.jpg#x=0&y=8&w=270&h=203&width=270&height=357',
      ],
      children: [{ text: '' }],
    };
    editor.insertNode(data);
  }
}

export const policyMenuBtnConfig = {
  key: 'policy',
  factory() {
    return new PolicyBtnMenu();
  },
};
