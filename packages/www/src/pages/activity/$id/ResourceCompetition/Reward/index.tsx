import * as React from 'react';
import styles from './index.less';
// import FPentagram from '@/components/FIcons/FPentagram';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import moment from 'moment';


interface RewardProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function Reward({ activityDetailsPage }: RewardProps) {

  const [luckyPrizes, set_luckyPrizes] = React.useState<{
    name: string;
    startDate: string;
    endDate: string;
  }[]>([]);

  const [sunlightAmount, set_sunlightAmount] = React.useState<number>(0);

  AHooks.useMount(async () => {
    const today: string = moment().format('YYYY-MM-DD');
    const { data }: { data: { resourceUsername: string }[] } = await FServiceAPI.Activity.lotteryShow({
      startDate: activityDetailsPage.startTime?.format('YYYY-MM-DD') || 'YYYY-MM-DD',
      limitDate: today,
      // startDate: '2022-01-01',
      // limitDate: '2022-12-31',
    });
    // console.log(data, '#@Fsd809fioasdjfisdajf;lsdjflsdajflkj');
    set_luckyPrizes(data.slice(0, 3).map((d, index) => {
      const startDate = moment().week(moment().week() - index - 1).startOf('isoWeek').format('YYYY·MM·DD');
      const endDate = moment().week(moment().week() - index - 1).endOf('isoWeek').format('YYYY·MM·DD');
      return {
        name: d.resourceUsername,
        startDate: startDate,
        endDate: endDate,
      };
    }));
  });

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.getRewardRecordInfos({
      rewardGroupCode: 'RG00007',
      status: 3,
    });
    let amount: number = 0;

    for (const d of data) {
      amount += (d.rewardConfigCode === 'RS000072' ? 20 : 5);
    }
    set_sunlightAmount(amount);
    // console.log(data, 'data890i/oewjfsdlkfjlsdkfjlkj');
  });

  return (<div className={styles.reward}>
    <div className={styles.rewardTitle}>活动奖励</div>
    <div style={{ height: 40 }} />
    <div className={styles.rewardCards}>
      <div className={styles.rewardCard} style={{ backgroundColor: '#FBF5EA' }}>
        <div className={styles.title1} style={{ color: '#E9A923' }}>
          <FComponentsLib.FIcons.FPentagram />
          <div style={{ width: 10 }} />
          <span>一等奖</span>
          <div style={{ width: 10 }} />
          <FComponentsLib.FIcons.FPentagram />
        </div>
        <div style={{ height: 30 }} />
        <div className={styles.title2} style={{ color: '#E9A923' }}>
          <FComponentsLib.FIcons.FLine />
          <div style={{ width: 20 }} />
          <span>奖金2000元</span>
          <div style={{ width: 20 }} />
          <FComponentsLib.FIcons.FLine />
        </div>
        <div style={{ height: 50 }} />

        <div className={styles.title3}>
          <span>两个赛道中，排名第一的资源作者</span>
          <div style={{ height: 10 }} />
          <span>可分别获得2000元现金奖励</span>
        </div>
        {/*<div style={{ height: 20 }} />*/}
        {/*<div className={styles.title4}>* 被签约总次数需超过200次，排名并列瓜分奖励</div>*/}
      </div>
      <div className={styles.rewardCard} style={{ backgroundColor: '#FBF5EA' }}>
        <div className={styles.title1} style={{ color: '#E9A923' }}>
          <FComponentsLib.FIcons.FPentagram />
          <div style={{ width: 10 }} />
          <span>二等奖</span>
          <div style={{ width: 10 }} />
          <FComponentsLib.FIcons.FPentagram />
        </div>
        <div style={{ height: 30 }} />
        <div className={styles.title2} style={{ color: '#E9A923' }}>
          <FComponentsLib.FIcons.FLine />
          <div style={{ width: 20 }} />
          <span>奖金1000元</span>
          <div style={{ width: 20 }} />
          <FComponentsLib.FIcons.FLine />
        </div>
        <div style={{ height: 50 }} />

        <div className={styles.title3}>
          <span>两个赛道中，排名第2-3名的资源作者</span>
          <div style={{ height: 10 }} />
          <span>可分别获得1000元现金奖励</span>
        </div>
        {/*<div style={{ height: 20 }} />*/}
        {/*<div className={styles.title4}>* 展品被签约次数需超过5次</div>*/}
      </div>
      <div className={styles.rewardCard} style={{ backgroundColor: '#E5F6EF' }}>
        <div className={styles.title1} style={{ color: '#42C28C' }}>
          <FComponentsLib.FIcons.FPentagram />
          <div style={{ width: 10 }} />
          <span>三等奖</span>
          <div style={{ width: 10 }} />
          <FComponentsLib.FIcons.FPentagram />
        </div>
        <div style={{ height: 30 }} />
        <div className={styles.title2} style={{ color: '#42C28C' }}>
          <FComponentsLib.FIcons.FLine />
          <div style={{ width: 20 }} />
          <span>奖金500元</span>
          <div style={{ width: 20 }} />
          <FComponentsLib.FIcons.FLine />
        </div>
        <div style={{ height: 50 }} />

        <div className={styles.title3}>
          <span>两个赛道中，排名第4-8名的资源作者</span>
          <div style={{ height: 10 }} />
          <span>可分别获得500元现金奖励</span>
        </div>
        {/*<div style={{ height: 20 }} />*/}
        {/*<div className={styles.title4}>* 被签约总次数需超过50次</div>*/}
      </div>
      <div className={styles.rewardCard} style={{ backgroundColor: '#E5F6EF' }}>
        <div className={styles.title1} style={{ color: '#42C28C' }}>
          <FComponentsLib.FIcons.FPentagram />
          <div style={{ width: 10 }} />
          <span>优秀奖</span>
          <div style={{ width: 10 }} />
          <FComponentsLib.FIcons.FPentagram />
        </div>
        <div style={{ height: 30 }} />
        <div className={styles.title2} style={{ color: '#42C28C' }}>
          <FComponentsLib.FIcons.FLine />
          <div style={{ width: 20 }} />
          <span>奖金200元</span>
          <div style={{ width: 20 }} />
          <FComponentsLib.FIcons.FLine />
        </div>
        <div style={{ height: 50 }} />

        <div className={styles.title3}>
          <span>两个赛道中，排名第9-18名的资源作者</span>
          <div style={{ height: 10 }} />
          <span>可分别获得200元现金奖励</span>
        </div>
        {/*<div style={{ height: 20 }} />*/}
        {/*<div className={styles.title4}>* 展品被签约次数需超过5次</div>*/}
      </div>
      <div className={styles.rewardCard} style={{ backgroundColor: '#EDF6FF' }}>
        <div className={styles.title2} style={{ color: '#2784FF' }}>
          <FComponentsLib.FIcons.FPentagram />
          <div style={{ width: 10 }} />
          {/*<span>优秀宣发奖</span>*/}
          <span>普照奖</span>
          <div style={{ width: 10 }} />
          <FComponentsLib.FIcons.FPentagram />
        </div>
        <div style={{ height: 20 }} />
        <div className={styles.title3}>
          <span>成功发行1个合规资源可领取5—20元现金</span>
        </div>
        <div style={{ height: 12 }} />
        <div className={styles.title3}>
          <span>其中游戏类资源可获得20元，漫画/小说/图片等其他类型可获得5元</span>
        </div>
        <div style={{ height: 20 }} />
        <div className={styles.title4}>* 同一用户限领3次资源发行奖励</div>
        <div style={{ height: 10 }} />
        <Space
          size={10}
          style={{
            padding: '0 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            height: 68,
            borderRadius: 10,
          }}>
          {/*{console.log(sunlightAmount, '90ioewjlksdfjl')}*/}
          <span>{sunlightAmount}元现金奖励已发放</span>
          <FComponentsLib.FRectBtn
            disabled={sunlightAmount === 0}
            type='primary'
            onClick={() => {
              self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.reward());
            }}
          >提现</FComponentsLib.FRectBtn>
        </Space>
      </div>
      <div className={styles.rewardCard} style={{ backgroundColor: '#FCF0FF' }}>
        <div className={styles.title2} style={{ color: '#BD10E0' }}>
          <FComponentsLib.FIcons.FPentagram />
          <div style={{ width: 10 }} />
          <span>幸运奖</span>
          <div style={{ width: 10 }} />
          <FComponentsLib.FIcons.FPentagram />
        </div>
        <div style={{ height: 20 }} />
        <div className={styles.title3}>
          <span>每周抽取一位上周参与活动的幸运鹅，赠送价值 100元京东购物卡</span>
        </div>
        <div style={{ height: 20 }} />
        <div className={styles.title4}>获奖名单 👇</div>
        <div style={{ height: 32 }} />
        <Space
          size={12}
          direction='vertical'
          style={{minHeight: 80}}
        >
          {
            luckyPrizes.length === 0 && (<div style={{ display: 'flex', alignItems: 'center', height: 22 }}>
              {/*<span style={{*/}
              {/*  color: '#222',*/}
              {/*  lineHeight: '22px',*/}
              {/*  fontSize: 16,*/}
              {/*}}>{lp.name}</span>*/}
              <span style={{
                color: '#999',
                lineHeight: '20px',
                fontSize: 14,
              }}>未开奖</span>
            </div>)
          }
          {
            luckyPrizes.length > 0 && luckyPrizes.map((lp) => {
              return (<div style={{ display: 'flex', alignItems: 'center', height: 22 }}>
            <span style={{
              color: '#222',
              lineHeight: '22px',
              fontSize: 16,
            }}>{lp.name}</span>
                <span style={{
                  color: '#999',
                  lineHeight: '20px',
                  fontSize: 14,
                }}>({lp.startDate}~{lp.endDate})</span>
              </div>);
            })
          }
        </Space>
      </div>
    </div>
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(Reward);
