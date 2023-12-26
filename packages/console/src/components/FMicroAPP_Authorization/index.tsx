import * as React from 'react';
import styles from './index.less';
import { MicroApp } from 'umi';
import * as AHooks from 'ahooks';
// import { Button } from 'antd';
import { FUtil } from '@freelog/tools-lib';

interface FMicroAPP_Authorization_Props {
  reload?: number;
  licenseeId: string;
  mainAppType: string;
  depList: any[];
  upcastList: any[];

  update(data: any): void;
}

// let microAppUnmount: any = null;
let order: number = 0;

function FMicroAPP_Authorization({
                                   licenseeId,
                                   mainAppType,
                                   depList,
                                   upcastList,
                                   update,
                                   reload = 0,
                                 }: FMicroAPP_Authorization_Props) {

  const [$appOrder, set$appOrder, get$appOrder] = FUtil.Hook.useGetState<number>(0);
  // const appOrder = ++order;
  // console.log($appOrder, order, 'appOrder (((((((((((((*******************KLJjdlksjfljsdljl');

  AHooks.useMount(() => {
    order++;
    set$appOrder(order);
  });

  React.useEffect(() => {
    set$appOrder(0)
  }, [reload]);

  AHooks.useDebounceEffect(() => {
    order++;
    set$appOrder(order);
  }, [reload], {
    wait: 300,
  });

  if ($appOrder === 0) {
    return null;
  }

  return (<MicroApp
    name={'Authorization_' + ($appOrder)}
    licenseeId={licenseeId}
    mainAppType={mainAppType}
    depList={depList}
    upcastList={upcastList}
    update={update}
  />);
}

export default FMicroAPP_Authorization;
