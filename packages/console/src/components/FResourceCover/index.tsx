import * as React from 'react';
import styles from './index.less';
// import Status from './Status';
import FResourceStatusBadge from '../FResourceStatusBadge';
import FCoverImage from '@/components/FCoverImage';

interface FResourceCoverProps {
  // width?: number | string;
  // height?: number | string;
  src?: string;
  status?: 'online' | 'offline' | 'unreleased' | 'freeze';
  // children?: React.ReactNode | React.ReactNodeArray;
}

function FResourceCover({ src, status }: FResourceCoverProps) {
  return (<div className={styles.Cover}>
    <FCoverImage src={src || ''} width={200} />
    <div className={styles.Status}>
      <FResourceStatusBadge status={status} />
    </div>
  </div>);
}

export default FResourceCover;
