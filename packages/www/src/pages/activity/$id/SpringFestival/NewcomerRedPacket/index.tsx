import * as React from 'react';
import styles from './index.less';
import img_newcomerTitle from '@/assets/activity/SpringFestival/newcomerTitle@2x.png';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import img_newcomerProcess from '@/assets/activity/SpringFestival/newcomerProcess@2x.png';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import sharedStyles from '@/pages/activity/$id/SpringFestival/shared.less';

interface NewcomerRedPacketProps {
  onClick?(): void;
}

function NewcomerRedPacket({ onClick }: NewcomerRedPacketProps) {
  return (<div className={styles.newcomer}>
    <img src={img_newcomerTitle} style={{ width: 432, opacity: .95 }} alt={''} />
    <div className={styles.Steps}>
      <div>
        <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
      </div>
      <div>
        <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
      </div>
    </div>
    <div style={{ height: 30 }} />
    <img src={img_newcomerProcess} style={{ width: 688, opacity: .95 }} alt={''} />
    <div style={{ height: 50 }} />
    <Space size={30}>
      <FComponentsLib.FTitleText type={'h3'} text={'首次参与freelog活动，并完成1次“新春卷王打卡挑战”任务（0/1）'} />
      <a
        className={[sharedStyles.button, sharedStyles.small].join(' ')}
        onClick={() => {
          onClick && onClick();

        }}
      >去完成</a>
    </Space>
    <div style={{ height: 60 }} />
  </div>);
}

export default NewcomerRedPacket;
