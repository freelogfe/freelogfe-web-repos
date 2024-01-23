import * as React from 'react';
import styles from './index.less';

interface Steps5Props {
  step: number;
}

function Steps5({ step }: Steps5Props) {
  return (<div className={styles.Steps5}>
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
          width: (step / 5 * 100) + '%',
          height: 4,
          backgroundColor: '#DC443A',
        }}
      />
    </div>
    <div className={styles.ProgressCircle}>
      <div className={styles.red} />
      <div className={step >= 3 ? styles.red : ''} />
      <div className={step >= 5 ? styles.red : ''} />
    </div>
  </div>);
}

export default Steps5;
