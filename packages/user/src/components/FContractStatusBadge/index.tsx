import * as React from 'react';
import styles from './index.less';

interface FContractStatusBadgeProps {
  status: 'active' | 'testActive' | 'inactive' | 'terminal';
}

const statusTextObj = {
  active: '已授权',
  testActive: '测试授权',
  inactive: '未授权',
  terminal: '已终止',
};

function FContractStatusBadge({ status }: FContractStatusBadgeProps) {
  return (<label className={[styles.style, styles[status]].join(' ')}>{statusTextObj[status]}</label>);
}

export default FContractStatusBadge;
