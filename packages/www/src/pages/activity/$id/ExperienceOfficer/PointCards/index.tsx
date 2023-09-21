import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Modal, Pagination, Space } from 'antd';
import * as AHooks from 'ahooks';
import moment, { Moment } from 'moment';

interface PointCardsProps {

}

function PointCards({}: PointCardsProps) {

  const [$isLogin, set$isLogin, get$isLogin] = FUtil.Hook.useGetState<boolean>(FUtil.Tool.getUserIDByCookies() !== -1);
  const [$modalOpen, set$modalOpen, get$modalOpen] = FUtil.Hook.useGetState<boolean>(false);
  const [$rewardRecord, set$rewardRecord, get$rewardRecord] = FUtil.Hook.useGetState<{
    rewardNum: number;
    status: 1 | 2 | 3 | 4;
    title: string;
    updateTime: string;
  }[]>([]);
  const [$current, set$current, get$current] = FUtil.Hook.useGetState<number>(1);
  const [$statistics, set$statistics, get$statistics] = FUtil.Hook.useGetState<{
    score: number;
    rank: number;
    gap: number;
  } | null>(null);
  const [$updateTime, set$updateTime, get$updateTime] = FUtil.Hook.useGetState<string>(moment().subtract(12, 'hours').format('YYYY-MM-DD') + ' 12:00:00');

  AHooks.useMount(async () => {
    // console.log(, '89wieojskdjflksdjlfkjl');
    if (!get$isLogin()) {
      return;
    }

    const { data: data_rankInfo }: {
      data: {
        balance: number;
        beforeBalance: number;
        sortNum: number;
      }
    } = await FServiceAPI.Operation.rankInfo({
      coinAccountType: 2,
      // @ts-ignore
      limitTime: get$updateTime(),
    });
    // console.log(data_rankInfo, 'asdfo9ijlkewjf;laksdjfksjdlkfjsdlkfjlkjl');
    if (data_rankInfo) {
      set$statistics({
        score: data_rankInfo.balance,
        rank: data_rankInfo.sortNum,
        gap: data_rankInfo.beforeBalance,
      });
    }

    const { data: data_RewardRecord }: {
      data: {
        rewardNum: number;
        status: 1 | 2 | 3 | 4;
        title: string;
        updateTime: string;
      }[];
    } = await FServiceAPI.Activity.listRewardRecordInfos({
      rewardGroupCodes: ['RG00008'],
      statusArray: [3],
    });
    // console.log(data_RewardRecord, 'siwejflksd data_RewardRecord');
    set$rewardRecord(data_RewardRecord.map((rr) => {
      return {
        ...rr,
        updateTime: FUtil.Format.formatDateTime(rr.updateTime, true),
      };
    }));
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
              <div>{$statistics?.score || 0}</div>
              <div>分</div>
            </div>
          </div>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官排名'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>{$statistics?.rank || 0}</div>
              <div>位</div>
            </div>
          </div>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'距离前一名'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>{$statistics?.gap || 0}</div>
              <div>分</div>
            </div>
          </div>
        </div>)
    }


    <div style={{ height: 40 }} />
    <Space size={30}>
      <div className={styles.h3}>每天12：00更新：最近更新 {$updateTime}</div>
      {
        $isLogin && (<FComponentsLib.FTextBtn
          type={'primary'}
          style={{ fontSize: 12 }}
          onClick={() => {
            set$modalOpen(true);
          }}
        >积分活动获取记录</FComponentsLib.FTextBtn>)
      }
    </Space>

    <Modal
      open={$modalOpen}
      width={1000}
      title={'积分活动获取记录'}
      footer={null}
      onCancel={() => {
        set$modalOpen(false);
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.records}>
          <div className={styles.recordTitle}>
            <FComponentsLib.FContentText text={'奖励明细'} type={'additional2'} />
            <FComponentsLib.FContentText text={'积分'} type={'additional2'} />
          </div>

          {
            $rewardRecord
              .filter((l, i) => {
                // return i > $current * 10 - 10 && i < $current * 10;
                return (i >= $current * 10 - 10) && (i < $current * 10);
              })
              .map((rr, ri) => {
                return (<div key={ri} className={styles.recordRow}>
                  <div>
                    <FComponentsLib.FContentText text={rr.title} type={'highlight'} style={{ fontSize: 12 }} />
                    <div style={{ height: 5 }} />
                    <FComponentsLib.FContentText text={rr.updateTime} type={'additional2'} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {
                      rr.status === 4 && (<>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#EE4040' }}>
                          <span style={{ fontSize: 12 }}>积分已扣除</span>
                          <FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} />
                        </div>
                        <div style={{ width: 30 }} />
                      </>)
                    }
                    <div style={{
                      color: '#42C28C',
                      fontSize: 14,
                      opacity: rr.status === 4 ? .4 : 1,
                    }}>+{rr.rewardNum}
                    </div>
                  </div>
                </div>);
              })
          }

        </div>

        <div style={{ height: 20 }} />
        <div style={{ width: 820, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={$current}
            size='small'
            total={$rewardRecord.length}
            pageSize={10}
            hideOnSinglePage={true}
            showSizeChanger={false}
            onChange={(value) => {
              set$current(value);
            }}
          />
        </div>
      </div>
    </Modal>
  </>);
}

export default PointCards;
