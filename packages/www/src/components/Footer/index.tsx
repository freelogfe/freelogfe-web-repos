import FComponentsLib from '@freelog/components-lib';
import './index.less';
import { Popover } from 'antd';

function FFooter() {
  return (
    <div
      className='footer flex-column align-center w-100x'
      style={{ zIndex: 20 }}
    >
      <i className={'freelog fl-icon-feather bottom-logo'} />
      <div className='title'>Freelog，专业免费的资源发行和运营平台</div>
      <div className='title2'>
        支持图片、小说、游戏、漫画、视频、音乐、主题、插件等各类型资源快速变现
      </div>
      <FComponentsLib.FPageFooter PopoverPatch={Popover} />
    </div>
  );
}

export default FFooter;
