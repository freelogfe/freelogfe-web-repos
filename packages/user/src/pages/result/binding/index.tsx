import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import useUrlState from '@ahooksjs/use-url-state';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';

interface BindingProps {

}

const types = {
  wechat: '微信',
  weibo: '微博',
} as const;

const states = {
  '1': '绑定成功',
  '2': '绑定失败',
  '3': FI18n.i18nNext.t('msg_wechataccountconnected'),
};

const stateIcons = {
  '1': <FComponentsLib.FIcons.FBinding style={{ color: '#44C28C' }} />,
  '2': <FComponentsLib.FIcons.FFail style={{ color: '#EE4040' }} />,
  '3': <FComponentsLib.FIcons.FWarning style={{ color: '#E9A923' }} />,
};

function Binding({}: BindingProps) {

  // 状态 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
  const [urlParams] = useUrlState<{ type: 'wechat' | 'weibo'; status: '1' | '2' | '3'; }>();

  return (<div>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      {
        stateIcons[urlParams.status as '1']
      }
      <div style={{ height: 20 }} />
      <FComponentsLib.FTipText
        type='second'
        text={types[urlParams.type as 'wechat'] + states[urlParams.status as '1']}
        style={{ maxWidth: 500 }}
      />

      {
        urlParams.status === '1' && (<>
          <div style={{ height: 60 }} />
          <FComponentsLib.FRectBtn
            onClick={() => {
              self.close();
            }}
          >关闭页面</FComponentsLib.FRectBtn>
        </>)
      }

      {
        urlParams.status === '3' && (<>
          <div style={{ height: 60 }} />
          <FComponentsLib.FRectBtn
            onClick={() => {
              self.location.replace(FUtil.LinkTo.binding());
            }}
          >重新扫码</FComponentsLib.FRectBtn>
        </>)
      }
    </div>
  </div>);
}

export default Binding;
