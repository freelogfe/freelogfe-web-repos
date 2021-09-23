import * as React from 'react';
import styles from './index.less';

interface ContractProps {

}

function Contract({}: ContractProps) {
  return (<div className={styles.styles}>
    <div style={{ height: 30 }} />
    <div className={styles.header}>
      <a
        className={styles.active}
        onClick={() => {
          // dispatch<OnChange_ShowPage_Action>({
          //   type: 'settingPage/onChange_ShowPage',
          //   payload: {
          //     value: 'profile',
          //   },
          // });
        }}>授权合约</a>
      <div style={{ width: 30 }} />
      <a
        onClick={() => {
          // dispatch<OnChange_ShowPage_Action>({
          //   type: 'settingPage/onChange_ShowPage',
          //   payload: {
          //     value: 'security',
          //   },
          // });
        }}
        className={''}>被授权合约</a>
    </div>
  </div>);
}

export default Contract;
