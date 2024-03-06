import * as React from 'react';
import styles from './index.less';
import img_newcomerTitle from '@/assets/activity/SpringFestival/newcomerTitle@2x.png';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import img_newcomerProcess from '@/assets/activity/SpringFestival/newcomerProcess@2x.png';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import sharedStyles from '@/pages/activity/$id/SpringFestival/shared.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import moment from 'moment';

interface NewcomerRedPacketProps {
  onClick?(): void;
}

function NewcomerRedPacket({ onClick }: NewcomerRedPacketProps) {

  const [$isNewcomer, set$isNewcomer, get$isNewcomer] = FUtil.Hook.useGetState<boolean>(true);
  const [$isFinish, set$isFinish, get$isFinish] = FUtil.Hook.useGetState<boolean>(false);

  AHooks.useMount(async () => {
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      return;
    }
    const { data }: {
      data: {
        createDate: string;
      }
    } = await FServiceAPI.User.currentUserInfo();
    // console.log(), 'data sdifj;lsdkjflksdjflkjsdlkjlk');
    set$isNewcomer(!moment(data.createDate).isBefore(moment('2023-11-22')));

    if (get$isNewcomer()) {
      const { data }: {
        data: {
          completionTime: number;
        }[];
      } = await FServiceAPI.Activity.statisticTaskRecords({
        codes: ['TS000805'],
      });

      set$isFinish(data[0].completionTime >= 1);
    }
  });

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
    {
      $isNewcomer
        ? (<Space size={30}>
          <FComponentsLib.FTitleText type={'h3'} text={`首次参与freelog活动，并完成1次“新春卷王打卡挑战”任务（${Number($isFinish)}/1）`} />
          <a
            className={[sharedStyles.button, sharedStyles.small, sharedStyles.disabled].join(' ')}
            onClick={() => {
              // if ($isFinish) {
              //   return;
              // }
              // onClick && onClick();
            }}
          >已结束</a>
        </Space>)
        : (<FComponentsLib.FContentText text={'此活动限2023-11-22 之后注册的用户参加'} type={'additional2'} />)
    }

    <div style={{ height: 60 }} />
  </div>);
}

export default NewcomerRedPacket;
