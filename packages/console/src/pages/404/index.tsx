import * as React from 'react';
import styles from './index.less';
import {Modal} from "antd";
import {router} from "umi";
import FNoDataTip from "@/components/FNoDataTip";

interface Error404Props {

}

function Error404({}: Error404Props) {

  return (<div>
    <FNoDataTip
      height={'calc(100vh - 70px)'}
      tipText={'404,页面不见了'}
      btnText={'将前往首页'}
      onClick={() => {
        router.replace('/');
      }}
    />
  </div>);
}

export default Error404;
