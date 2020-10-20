import * as React from 'react';
import styles from './index.less';

interface PresentableProps {

}

function Presentable({}: PresentableProps) {
  return (<div className={styles.styles}>
    <div>
      <div className={styles.header}>
        我的音乐节点
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <div>

          </div>
        </div>
        <div style={{width: 10}}/>
        <div className={styles.side}>
          <div></div>
        </div>
      </div>
    </div>
    <div style={{height: 100}}/>
  </div>);
}

export default Presentable;
