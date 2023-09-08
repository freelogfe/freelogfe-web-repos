import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface RankingListProps {

}

function RankingList({}: RankingListProps) {

  const [$list, set$list, get$list] = FUtil.Hook.useGetState<{
    serial: number;
    award: 'gold' | 'silver' | 'copper' | '';
    userName: string;
    score: number;
  }[]>([]);

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
      limit: 8,
    });

    set$list(data.map((d, i) => {
      let award: 'gold' | 'silver' | 'copper' = 'copper';
      if (i < 1) {
        award = 'gold';
      } else if (i < 3) {
        award = 'silver';
      }
      return {
        serial: i + 1,
        award: award,
        userName: d.username,
        score: Number(d.balance),
      };
    }));

  });

  return (<div className={styles.RankingList}>
    <FComponentsLib.FTitleText type={'h2'} text={'排名公示'} />
    <div style={{ height: 20 }} />
    <FComponentsLib.FContentText type={'additional2'} text={'统计截止时间：2023/mm/dd'} />
    <div style={{ height: 20 }} />
    <div className={styles.table}>
      {/*<div className={styles.row} style={{ height: 30 }}>*/}
      {/*  <FComponentsLib.FContentText text={'排名'} type={'additional2'} />*/}
      {/*  <FComponentsLib.FContentText text={'用户名'} type={'additional2'} />*/}
      {/*  <FComponentsLib.FContentText text={'积分'} type={'additional2'} />*/}
      {/*</div>*/}

      <div className={styles.row} style={{ height: 30 }}>
        <FComponentsLib.FContentText text={'积分排行榜'} type={'additional2'} />
        <div />
        <div>
          <FComponentsLib.FTextBtn type={'primary'} style={{ fontSize: 12 }}>查看完整榜单</FComponentsLib.FTextBtn>
        </div>
      </div>

      {
        $list.map((l) => {
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

      {/*<div className={styles.row}>*/}
      {/*  <div className={styles.ranking}>*/}
      {/*    <span>2</span>*/}
      {/*    <GoldSilverCopper type={'silver'} />*/}
      {/*  </div>*/}
      {/*  <div>asdignia</div>*/}
      {/*  <div>100分</div>*/}
      {/*</div>*/}

      {/*<div className={styles.row}>*/}
      {/*  <div className={styles.ranking}>*/}
      {/*    <span>3</span>*/}
      {/*    <GoldSilverCopper type={'copper'} />*/}
      {/*  </div>*/}
      {/*  <div>asdignia</div>*/}
      {/*  <div>100分</div>*/}
      {/*</div>*/}

      {/*<div className={styles.row}>*/}
      {/*  <div className={styles.ranking}>*/}
      {/*    <span>4</span>*/}
      {/*    <GoldSilverCopper type={'copper'} />*/}
      {/*  </div>*/}
      {/*  <div>asdignia</div>*/}
      {/*  <div>100分</div>*/}
      {/*</div>*/}
    </div>
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
