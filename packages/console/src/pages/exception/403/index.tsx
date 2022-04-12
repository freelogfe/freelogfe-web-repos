import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {router} from "umi";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';

interface Error403Props {

}

function Error403({}: Error403Props) {
  return (<div>
    <FNoDataTip
      height={'calc(100vh - 70px)'}
      // tipText={'403,没有权限'}
      tipText={FUtil1.I18n.message('msg_have_no_access')}
      btnText={'将前往首页'}
      onClick={() => {
        router.replace(FUtil.LinkTo.market());
      }}
    />
  </div>);
}

export default Error403;
