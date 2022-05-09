import * as React from 'react';
import styles from './index.less';

interface RewardProps {

}

function Reward({}: RewardProps) {
  return (<div className={styles.reward}>
    <div className={styles.rewardTitle}>活动奖励</div>
    <div style={{ height: 40 }} />
    <div className={styles.rewardCards}>
      <div className={styles.rewardCard}></div>
      <div className={styles.rewardCard}></div>
      <div className={styles.rewardCard}></div>
      <div className={styles.rewardCard}></div>
      <div className={styles.rewardCard}></div>
      <div className={styles.rewardCard}></div>
    </div>
  </div>);
}

export default Reward;
