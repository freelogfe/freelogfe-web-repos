import * as React from 'react';
import styles from './index.less';
import { FI18n } from '@freelog/tools-lib';

interface FResourceStatusBadgeProps {
  status?: 'online' | 'offline' | 'unreleased' | 'freeze';
}

const statusTextObj = {
  // online: '已上线',
  // offline: '未上线',
  // unreleased: '未发行',
  // freeze: '已封停',
  online: FI18n.i18nNext.t('filter_resource_status_availableforauth'),
  offline: FI18n.i18nNext.t('filter_resource_status_pendingauth'),
  unreleased: FI18n.i18nNext.t('filter_resource_status_prepareforrelease'),
  freeze: FI18n.i18nNext.t('filter_resource_status_removedbyfreelog'),
};

function FResourceStatusBadge({ status = 'online' }: FResourceStatusBadgeProps) {
  return (<label className={[styles.style, styles[status]].join(' ')}>{statusTextObj[status]}</label>);
}

export default FResourceStatusBadge;
