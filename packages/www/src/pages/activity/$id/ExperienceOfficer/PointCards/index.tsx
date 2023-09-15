import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Modal, Space } from 'antd';
import * as AHooks from 'ahooks';
import { listRewardRecordInfos } from '../../../../../../../@freelog/tools-lib/src/service-API/activities';

// import { useGetState } from '@/layouts/FBaseLayout';

interface PointCardsProps {

}

function PointCards({}: PointCardsProps) {

  const [$isLogin, set$isLogin, get$isLogin] = FUtil.Hook.useGetState<boolean>(FUtil.Tool.getUserIDByCookies() !== -1);

  AHooks.useMount(async () => {
    if (!get$isLogin()) {
      return;
    }

    const { data: data_rankInfo } = await FServiceAPI.Operation.rankInfo({ coinAccountType: 2 });
    console.log(data_rankInfo, 'asdfo9ijlkewjf;laksdjfksjdlkfjsdlkfjlkjl');

    const { data: data_RewardRecord } = await FServiceAPI.Activity.listRewardRecordInfos();
    console.log(data_RewardRecord, 'siwejflksd data_RewardRecord');

  });

  return (<>

    {
      !$isLogin
        ? (<div className={styles.noLogin}>
          <FComponentsLib.FContentText text={'详细积分情况请登录后查看'} type={'additional2'} />
          <FComponentsLib.FRectBtn
            type={'primary'}
            onClick={() => {
              // self.location.replace()
              FServiceAPI.User.currentUserInfo();
            }}
          >立即登录</FComponentsLib.FRectBtn>
        </div>)
        : (<div className={styles.pointCards}>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官积分'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>60</div>
              <div>分</div>
            </div>
          </div>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官积分'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>180</div>
              <div>位</div>
            </div>
          </div>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官积分'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>30</div>
              <div>分</div>
            </div>
          </div>
        </div>)
    }


    <div style={{ height: 40 }} />
    <Space size={30}>
      <div className={styles.h3}>每天12：00更新：最近更新{'更新数据时间'}</div>
      <FComponentsLib.FTextBtn
        type={'primary'}
        style={{ fontSize: 12 }}
      >积分活动获取记录</FComponentsLib.FTextBtn>
    </Space>

    <Modal open={true} width={1000} title={'积分活动获取记录'} footer={null}>
      <div className={styles.modalContent}>
        <div className={styles.records}>
          <div className={styles.recordTitle}>
            <FComponentsLib.FContentText text={'奖励明细'} type={'additional2'} />
            <FComponentsLib.FContentText text={'积分'} type={'additional2'} />
          </div>
          <div className={styles.recordRow}>
            <div>
              <FComponentsLib.FContentText text={'发行一个游戏类型资源'} type={'highlight'} style={{ fontSize: 12 }} />
              <div style={{ height: 5 }} />
              <FComponentsLib.FContentText text={'2023/07/07 12:00:00'} type={'additional2'} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#EE4040' }}>
                <span style={{ fontSize: 12 }}>积分已扣除</span>
                <FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} />
              </div>
              <div style={{ width: 30 }} />
              <div style={{
                color: '#42C28C',
                fontSize: 14,
                opacity: .4,
              }}>+2
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>);
}

export default PointCards;
