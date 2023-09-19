import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Modal, Space, Pagination } from 'antd';
import moment, { Moment } from 'moment';

interface RankingListProps {
  deadline: string;
}

function RankingList({ deadline }: RankingListProps) {

  const [$list, set$list, get$list] = FUtil.Hook.useGetState<{
    serial: number;
    award: 'gold' | 'silver' | 'copper' | '';
    userName: string;
    score: number;
  }[]>([]);

  // const [$modalList, set$modalList, get$modalList] = FUtil.Hook.useGetState<{
  //   serial: number;
  //   award: 'gold' | 'silver' | 'copper' | '';
  //   userName: string;
  //   score: number;
  // }[]>([]);
  const [$current, set$current, get$current] = FUtil.Hook.useGetState<number>(1);
  const [$modalOpen, set$modalOpen, get$modalOpen] = FUtil.Hook.useGetState<boolean>(false);

  AHooks.useMount(async () => {

    const { ret, errCode, msg, data }: {
      ret: number;
      errCode: number;
      msg: string;
      data: {
        balance: string;
        num: string;
        username: string;
      }[];
    } = await FServiceAPI.Operation.recordRank({
      coinAccountType: 2,
      limit: 200,
      // @ts-ignore
      // limitTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      limitTime: deadline,
    });

    set$list(data.map((d, i) => {
      let award: 'gold' | 'silver' | 'copper' = '';
      if (i < 1) {
        award = 'gold';
      } else if (i < 3) {
        award = 'silver';
      } else if (i < 8) {
        award = 'copper';
      }
      return {
        serial: i + 1,
        award: award,
        userName: d.username,
        score: Number(d.balance),
      };
    }));

  });

  // AHooks.useMount(async () => {
  //   const { ret, errCode, msg, data: data }: {
  //     ret: number;
  //     errCode: number;
  //     msg: string;
  //     data: {
  //       balance: string;
  //       num: string;
  //       username: string;
  //     }[];
  //   } = await FServiceAPI.Operation.recordRank({
  //     coinAccountType: 2,
  //     limit: 200,
  //   });
  //
  //   set$modalList(data.map((d, i) => {
  //     let award: 'gold' | 'silver' | 'copper' | '' = '';
  //     if (i < 1) {
  //       award = 'gold';
  //     } else if (i < 3) {
  //       award = 'silver';
  //     } else if (i < 8) {
  //       award = 'copper';
  //     }
  //     return {
  //       serial: i + 1,
  //       award: award,
  //       userName: d.username,
  //       score: Number(d.balance),
  //     };
  //   }));
  //
  // });

  return (<div className={styles.RankingList}>
    <FComponentsLib.FTitleText type={'h2'} text={'排名公示'} />
    <div style={{ height: 20 }} />
    <FComponentsLib.FContentText type={'additional2'} text={`统计截止时间：${deadline}`} />
    <div style={{ height: 20 }} />
    <div className={styles.table}>

      <div className={styles.row} style={{ height: 30 }}>
        <FComponentsLib.FContentText text={'积分排行榜'} type={'additional2'} />
        <div />
        <div>
          <FComponentsLib.FTextBtn type={'primary'} style={{ fontSize: 12 }} onClick={() => {
            set$modalOpen(true);
          }}>查看完整榜单</FComponentsLib.FTextBtn>
        </div>
      </div>

      {
        $list
          .filter((l, i) => {
            return i < 8;
          })
          .map((l) => {
            return (<div className={styles.row} key={l.serial}>
              <div className={styles.ranking}>
                <span>{l.serial}</span>
                <GoldSilverCopper type={l.award} />
              </div>
              <div>{l.userName}</div>
              <div>{l.score}分</div>
            </div>);
          })
      }

    </div>

    <Modal
      open={$modalOpen}
      title={'积分排行榜'}
      footer={null}
      width={1000}
      onCancel={() => {
        set$modalOpen(false);
      }}
    >
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 574,
        justifyContent: 'space-between',
      }}>
        <div className={styles.table}>
          <div className={styles.row} style={{ height: 30 }}>
            <FComponentsLib.FContentText text={'排名'} type={'additional2'} />
            <FComponentsLib.FContentText text={'用户名'} type={'additional2'} />
            <FComponentsLib.FContentText text={'积分'} type={'additional2'} />
          </div>

          {
            $list
              .filter((l, i) => {
                return (i >= $current * 10 - 10) && (i < $current * 10);
              })
              .map((l) => {
                return (<div className={styles.row} key={l.serial}>
                  <div className={styles.ranking}>
                    <span>{l.serial}</span>
                    <GoldSilverCopper type={l.award} />
                  </div>
                  <div>{l.userName}</div>
                  <div>{l.score}分</div>
                </div>);
              })
          }

        </div>
        <div style={{ display: 'flex', width: 820, alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size={10}>
            <FComponentsLib.FContentText type={'additional2'} text={`共${$list.length}条数据`} />
            <FComponentsLib.FContentText type={'additional2'} text={`统计截止时间：${deadline}`} />
          </Space>

          <Pagination
            current={$current}
            size='small'
            total={$list.length}
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
  </div>);
}

export default RankingList;

interface GoldSilverCopperProps {
  type: 'gold' | 'silver' | 'copper' | '';
}

const text = {
  gold: '金牌体验官',
  silver: '银牌体验官',
  copper: '铜牌体验官',
};

function GoldSilverCopper({ type }: GoldSilverCopperProps) {

  if (type === '') {
    return null;
  }

  return (<label className={[styles.GoldSilverCopper, styles[type]].join(' ')}>{text[type]}</label>);
}
