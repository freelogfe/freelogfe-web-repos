import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil, FI18n } from '@freelog/tools-lib';
import { history } from '@@/core/history';

interface Error403Props {

}

function Error403({}: Error403Props) {
  return (<div>
    <FNoDataTip
      height={'calc(100vh - 70px)'}
      // tipText={'403,没有权限'}
      tipText={FI18n.i18nNext.t('msg_have_no_access')}
      btnText={'将前往首页'}
      onClick={() => {
        history.replace('/');
      }}
    />
  </div>);
}

export default Error403;
