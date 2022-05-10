import * as React from 'react';
import styles from './index.less';

interface StrategyProps {

}

function Strategy({}: StrategyProps) {
  return (<div className={styles.strategy}>
    <div style={{ height: 60 }} />
    <div className={styles.strategyTitle}>活动攻略</div>
    <div style={{ height: 40 }} />
    <div className={styles.strategyContent}>
      <div className={styles.strategyContentLeft} style={{ borderColor: '#E9A923' }} />
      <div style={{ width: 22 }} />
      <div className={styles.strategyContentRight}>
        <div className={styles.strategyContent1} style={{ color: '#E9A923' }}>资源主题？无主题！</div>
        <div style={{ height: 12 }} />
        <div className={styles.strategyContent2}>
          <span>参赛资源无具体主题要求，校园、热血、搞笑、恋爱等主题不限，也就是说 “只要发布自己现有的优秀作品即可参赛</span>
          <span style={{ color: '#E9A923' }}>领取15元现金</span>
          <span>！”</span>
        </div>
        {/*<div className={styles.strategyContent3}></div>*/}
      </div>
    </div>
    <div style={{ height: 40 }} />
    <div className={styles.strategyContent}>
      <div className={styles.strategyContentLeft} style={{ borderColor: '#42C28C' }} />
      <div style={{ width: 22 }} />
      <div className={styles.strategyContentRight}>
        <div className={styles.strategyContent1} style={{ color: '#42C28C' }}>无人签约？自己签！</div>
        <div style={{ height: 12 }} />
        <div className={styles.strategyContent2}>
          <span>参赛资源需被节点商签约为展品方可参与排名赛，用户可同时领取资源作者和节点赏奖励，也就是说 “可以自己创建节点签约参赛资源为展品参与排名赛”</span>
          {/*<span style={{ color: '#E9A923' }}>领取15元现金</span>*/}
          {/*<span>！”</span>*/}
        </div>
        <div style={{ height: 12 }} />
        <div className={styles.strategyContent3}>* 首次成功创建展品完成新手任务中的【节点系列】任务还可领取7元现金奖励~</div>
      </div>
    </div>
    <div style={{ height: 40 }} />
    <div className={styles.strategyContent}>
      <div className={styles.strategyContentLeft} style={{ borderColor: '#2784FF' }} />
      <div style={{ width: 22 }} />
      <div className={styles.strategyContentRight}>
        <div className={styles.strategyContent1} style={{ color: '#2784FF' }}>提升排名？分享好友！</div>
        <div style={{ height: 12 }} />
        <div className={styles.strategyContent2}>
          <span>展品按「总被签约次数」排名，可将展品分享至微信、微博等自媒体平台或分享给好友，邀请粉丝、好友签约即可提升活动排名，</span>
          <span style={{ color: '#2784FF' }}>赢取2000元现金奖励</span>
          <span>！</span>
        </div>
        <div style={{ height: 12 }} />
        <div className={styles.strategyContent3}>* 使用免费授权策略的展品，用户浏览展品即为自动签约，无需注册登录Freelog；使用收费授权策略的展品，用户需注册登录Freelog，领取feth后，使用feth进行签约。</div>
      </div>
    </div>
    <div style={{ height: 60 }} />
  </div>);
}

export default Strategy;
