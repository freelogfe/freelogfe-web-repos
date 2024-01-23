import * as React from 'react';
import styles from './index.less';

interface Steps21Props {
  step: number;
}

function Steps21({ step }: Steps21Props) {
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
          width: (step / 21 * 100) + '%',
          height: 4,
          backgroundColor: '#DC443A',
        }}
      />
    </div>
    <div className={styles.ProgressCircle}>
      <div className={styles.red} />
      <div className={step >= 7 ? styles.red : ''} />
      <div className={step >= 14 ? styles.red : ''} />
      <div className={step >= 21 ? styles.red : ''} />
    </div>
  </div>);
}

export default Steps21;
