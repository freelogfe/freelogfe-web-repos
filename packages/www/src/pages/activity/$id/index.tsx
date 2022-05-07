import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';

interface ActivityProps {

}

function Activity({}: ActivityProps) {
  return (<div>
    <FLoadingTip height={window.innerHeight - 170} />
  </div>);
}

export default Activity;
