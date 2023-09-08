import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface LuckyPrizeProps {

}

function LuckyPrize({}: LuckyPrizeProps) {
  return (<div className={styles.LuckyPrize}>
    <FComponentsLib.FTitleText type={'h2'} text={'幸运奖名单'} />
    <div style={{ height: 20 }} />
    <div className={styles.list}>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>世袭锦鲤001世袭锦鲤001</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>世袭锦鲤001</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>世袭0手动阀手动阀手动阀1</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>sdrfsdf</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>世袭锦鲤001</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>ssdfewsfsdfs</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>撒旦发射点发</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>撒旦发射点发</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>撒旦发射点发</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>撒旦发射点发</span>
      </label>
      <label>
        <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
        <span>撒旦发射点发</span>
      </label>

    </div>
  </div>);
}

export default LuckyPrize;
