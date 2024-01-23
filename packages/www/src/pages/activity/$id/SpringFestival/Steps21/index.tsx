import * as React from 'react';
import styles from './index.less';

interface Steps21Props {
  step: number;
}

function Steps21({}: Steps21Props) {
  return (<div className={styles.Steps21}>
    <div className={styles.ProgressBarBg}>
      <div
        style={{
          width: '100%',
          height: 4,
          backgroundColor: '#e5e5e5',
        }}
      />
    </div>
    <div className={styles.ProgressBar}>
      <div
        style={{
          width: '20%',
          height: 4,
          backgroundColor: '#DC443A',
        }}
      />
    </div>
    <div className={styles.ProgressCircle}>
      <div className={styles.red} />
      <div />
      <div />
      <div />
    </div>
  </div>);
}

export default Steps21;
