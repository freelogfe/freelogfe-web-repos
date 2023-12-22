import * as React from 'react';
import styles from './index.less';
import { MicroApp } from 'umi';
import * as AHooks from 'ahooks';
import { Button } from 'antd';

interface FMicroAPP_Authorization_Props {
  licenseeId: string;
  mainAppType: string;
  depList: any[];
  upcastList: any[];

  update(data: any): void;
}

function FMicroAPP_Authorization({
                                   licenseeId,
                                   mainAppType,
                                   depList,
                                   upcastList,
                                   update,
                                 }: FMicroAPP_Authorization_Props) {

  // const microAppRef = React.useRef<any>();
  const microAppRef = React.useRef<any>(null);

  AHooks.useMount(() => {
    console.error(microAppRef.current, 'microAppRef.current sdfsdfasdf')
    microAppRef.current?.mountPromise.then(() => {
      console.log('app1 mount');
    });
  });

  return (<>
    <MicroApp
      ref={microAppRef}
      name={'Authorization'}
      licenseeId={licenseeId}
      mainAppType={mainAppType}
      depList={depList}
      upcastList={upcastList}
      update={update}
    />
  </>);
}

export default FMicroAPP_Authorization;
