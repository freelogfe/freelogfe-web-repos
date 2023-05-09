import * as React from 'react';
import styles from './index.less';
import * as imgSrc from '@/assets/null.png';
import useUrlState from '@ahooksjs/use-url-state';

interface NodePausePreviewProps {

}

function NodePausePreview({}: NodePausePreviewProps) {

  const [{ tip }] = useUrlState<{ tip: string }>();


  return (<div className={styles.styles}>
    <img className={styles.img} src={imgSrc} alt={''} />

    <div className={styles.tip}>{tip || '节点已暂停运营，开放时间待定~'}</div>
  </div>);
}

export default NodePausePreview;
