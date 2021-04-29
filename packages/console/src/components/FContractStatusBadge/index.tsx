import * as React from 'react';
import styles from './index.less';

interface FContractStatusBadgeProps {
  status?: 'authorized' | 'pending' | 'stopped';
}

const statusTextObj = {
  authorized: '已授权',
  pending: '待执行',
  stopped: '已终止',
};

function FContractStatusBadge({status = 'authorized'}: FContractStatusBadgeProps) {
  return (<label className={[styles.style, styles[status]].join(' ')}>{statusTextObj[status]}</label>);
}

export default FContractStatusBadge;
