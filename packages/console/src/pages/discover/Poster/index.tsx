import * as React from 'react';
import styles from './index.less';
import img_market1 from '@/assets/market1@x2.png';
import img_market2 from '@/assets/market2@x2.png';

interface PosterProps {

}

function Poster({}: PosterProps) {
  return (<div className={styles.poster}>
    <a>
      <img src={img_market1} alt={''} />
    </a>
    <div style={{ width: 20 }} />
    <a>
      <img src={img_market2} alt={''} />
    </a>
  </div>);
}

export default Poster;
