import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { history } from 'umi';
// import FUtil1 from "@/utils";
import { FUtil, FI18n } from '@freelog/tools-lib';

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
        // history.replace(FUtil.LinkTo.market());
        self.location.replace(FUtil.Format.completeUrlByDomain('www'));
      }}
    />
  </div>);
}

export default Error403;
