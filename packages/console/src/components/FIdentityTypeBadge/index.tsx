import * as React from 'react';
import styles from './index.less';
import FUtil1 from '@/utils';

interface FIdentityTypeBadgeBadgeProps {
  status?: 'resource' | 'object' | 'exhibit';
}

const statusTextObj = {
  resource: FUtil1.I18n.message('label_resource'),
  object: FUtil1.I18n.message('label_object'),
  exhibit: FUtil1.I18n.message('lable_exhibit'),
};

function FIdentityTypeBadge({status = 'resource'}: FIdentityTypeBadgeBadgeProps) {
  // return (<label className={styles[status]}>{statusTextObj[status]}</label>);
  return (<label className={styles[status]}>{statusTextObj[status]}</label>);
}

export default FIdentityTypeBadge;
