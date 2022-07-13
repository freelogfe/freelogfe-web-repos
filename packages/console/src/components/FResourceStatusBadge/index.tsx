import * as React from 'react';
import styles from './index.less';

interface FResourceStatusBadgeProps {
  status?: 'online' | 'offline' | 'unreleased' | 'freeze';
}

const statusTextObj = {
  online: '已上线',
  offline: '未上线',
  unreleased: '未发行',
  freeze: '已封停',
};

function FResourceStatusBadge({ status = 'online' }: FResourceStatusBadgeProps) {
  return (<label className={[styles.style, styles[status]].join(' ')}>{statusTextObj[status]}</label>);
}

export default FResourceStatusBadge;
