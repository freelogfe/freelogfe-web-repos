import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil } from '@freelog/tools-lib';
import { history } from 'umi';

interface Error404Props {

}

function Error404({}: Error404Props) {

  return (<div>
    <FNoDataTip
      height={'calc(100vh - 70px)'}
      tipText={'404,页面不见了'}
      btnText={'将前往首页'}
      onClick={() => {
        history.replace('/');
      }}
    />
  </div>);
}

export default Error404;
