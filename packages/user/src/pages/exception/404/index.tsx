import * as React from 'react';
import styles from './index.less';
import { history } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil } from '@freelog/tools-lib';

interface Error404Props {

}

function Error404({}: Error404Props) {

  return (<div>
    <FNoDataTip
      height={'calc(100vh - 70px)'}
      tipText={'404,页面不见了'}
      btnText={'将前往首页'}
      onClick={() => {
        self.location.replace(FUtil.Format.completeUrlByDomain('www'));
      }}
    />
  </div>);
}

export default Error404;
