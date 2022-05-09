import * as React from 'react';
import styles from './index.less';

interface Banner1Props {

}

function Banner1({}: Banner1Props) {
  return (<div className={styles.banner1}>
    <div className={styles.banner1Content}>
      <div style={{ height: 45 }} />
      <div className={styles.banner1Content_Title}>
        <span>熬秃头创作却收益甚微的漫画、小说家们，快来Freelog实现资源发行和授权变现自由吧！</span>
        <br />
        <span>每一个笔触都值得被尊重、每一个文字都值得全额的回报~</span>
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.banner1Content_Times}>
        <div className={styles.banner1Content_Time1}>
          <div className={styles.title}>活动开始</div>
          <div style={{ height: 4 }} />
          <div className={styles.time}>2022·02·10</div>
        </div>
        <div className={styles.banner1Content_Time2}>
          <div className={styles.title}>活动结束</div>
          <div style={{ height: 4 }} />
          <div className={styles.time}>2022·02·10</div>
        </div>
        <div className={styles.banner1Content_Time3}>
          <div className={styles.title}>获奖公示</div>
          <div style={{ height: 4 }} />
          <div className={styles.time}>2022·02·10</div>
        </div>
      </div>
    </div>
  </div>);
}

export default Banner1;
