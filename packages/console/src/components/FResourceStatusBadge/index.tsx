import * as React from 'react';
import styles from './index.less';

interface FResourceStatusBadgeProps {
  status?: 'online' | 'offline' | 'unreleased';
}

const statusTextObj = {
  online: '已上线',
  offline: '已下线',
  unreleased: '未发行',
};

function FResourceStatusBadge({status = 'online'}: FResourceStatusBadgeProps) {
  return (<label className={styles[status]}>{statusTextObj[status]}</label>);
}

export default FResourceStatusBadge;
