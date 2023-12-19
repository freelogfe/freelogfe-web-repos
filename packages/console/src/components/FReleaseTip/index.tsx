import * as React from 'react';
import styles from './index.less';
import { Modal, Progress } from 'antd';
import * as AHooks from 'ahooks';
import { FUtil } from '@freelog/tools-lib';

interface ReleaseTipProps {
  visible: boolean;
}

export function ReleaseTip({ visible }: ReleaseTipProps) {

  const [$percent, set$percent, get$percent] = FUtil.Hook.useGetState(0);

  AHooks.useInterval(() => {
    set$percent(Math.min($percent + 1, 99));
  }, visible ? 8 : undefined);

  return (<Modal
    open={visible}
    closable={false}
    footer={null}
    width={920}
  >
    <div style={{
      height: 452,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div style={{ fontSize: 20, color: '#222', lineHeight: '28px' }}>{$percent}%</div>
      <div style={{ height: 20 }} />
      <div style={{ width: 300 }}>
        <Progress percent={$percent} showInfo={false} />
      </div>
      <div style={{ height: 40 }} />
      <div style={{ fontSize: 16, color: '#666', lineHeight: '22px' }}>资源版本正在发布，请稍后</div>

    </div>
  </Modal>);
}

export default ReleaseTip;
