import * as React from 'react';
import styles from './index.less';
import { Tooltip } from 'antd';
import img_respiration from '@/assets/respiration.gif';
import { CSSProperties } from 'react';

// import img_Execute from '@/assets/execute.svg';

interface FHotspotTooltipProps {
  style?: CSSProperties;
  text: string;
}

function FHotspotTooltip({ style = {}, text }: FHotspotTooltipProps) {
  return (<Tooltip
    open
    placement='bottomRight'
    title={text}
    color='#FFFFFF linear-gradient(135deg, #4568DC 0%, #B06AB3 100%)'
    overlayInnerStyle={{
      padding: '12px 20px',
      borderRadius: 8,
      maxWidth: 240,
    }}
  >
    <div
      style={{
        ...style,
        width: 40,
      }}>
      <img
        className={styles.respiration}
        src={img_respiration}
        alt={''}
      />
    </div>
  </Tooltip>);
}

export default FHotspotTooltip;
