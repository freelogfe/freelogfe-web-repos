/** 切图详情弹窗组件 */

import './index.less';
import { Drawer } from 'antd';
import { FI18n } from '@freelog/tools-lib';
import { useEffect } from 'react';
import { ImgInComicTool } from '../../utils/interface';
import { conversionSize } from '../../utils/common';

interface Props {
  show: boolean;
  close: () => void;
  data: ImgInComicTool[];
}

export const CutDrawer = (props: Props) => {
  const { show, close, data } = props;

  return (
    <Drawer
      className="cut-drawer-wrapper"
      width={700}
      title={FI18n.i18nNext.t('cbformatter_slice_preview_title')}
      closable={false}
      open={show}
      onClose={close}
      extra={<i className="freelog fl-icon-guanbi close-btn" onClick={close} />}
      destroyOnClose
    >
      <>
        {data.map((item) => (
          <div className="cut-img-box" key={item.name}>
            <div className="cut-mark">
              <i className="freelog fl-icon-jiandao"></i>
              <div className="line"></div>
            </div>
            <div className="name-size">
              <span>{item.name}</span>
              <span>{conversionSize(item.size)}</span>
            </div>
            <img className="cut-img" src={item.base64} loading="lazy" />
          </div>
        ))}
      </>
    </Drawer>
  );
};
