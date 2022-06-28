import * as React from 'react';
import styles from './index.less';
// import FUtil1 from '@/utils';
import { fI18nNext } from '@freelog/tools-lib';

interface FIdentityTypeBadgeBadgeProps {
  status?: 'resource' | 'object' | 'exhibit';
}

const statusTextObj = {
  resource: fI18nNext.t('label_resource'),
  object: fI18nNext.t('label_object'),
  exhibit: fI18nNext.t('lable_exhibit'),
};

function FIdentityTypeBadge({status = 'resource'}: FIdentityTypeBadgeBadgeProps) {
  // return (<label className={styles[status]}>{statusTextObj[status]}</label>);
  return (<label className={styles[status]}>{statusTextObj[status]}</label>);
}

export default FIdentityTypeBadge;
