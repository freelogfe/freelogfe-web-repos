import * as React from 'react';
import styles from './index.less';
import { FI18n, FUtil } from '@freelog/tools-lib';

interface FResourceStatusBadgeProps {
  status?: 'online' | 'offline' | 'unreleased' | 'freeze';
}

function FResourceStatusBadge({ status = 'online' }: FResourceStatusBadgeProps) {

  const [$statusTextObj, set$statusTextObj, get$statusTextObj] = FUtil.Hook.useGetState({
    online: FI18n.i18nNext.t('filter_resource_status_availableforauth'),
    offline: FI18n.i18nNext.t('filter_resource_status_pendingauth'),
    unreleased: FI18n.i18nNext.t('filter_resource_status_prepareforrelease'),
    freeze: FI18n.i18nNext.t('filter_resource_status_removedbyfreelog'),
  });

  return (<label className={[styles.style, styles[status]].join(' ')}>{$statusTextObj[status]}</label>);
}

export default FResourceStatusBadge;
