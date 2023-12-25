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

let microAppUnmount: any = null;

function FMicroAPP_Authorization({
                                   licenseeId,
                                   mainAppType,
                                   depList,
                                   upcastList,
                                   update,
                                 }: FMicroAPP_Authorization_Props) {

  const [arr, setArr] = React.useState([]);
  // console.log(arr, 'arri sdjlkfjsdlkfjlkdsjlkfjl');

  // const microAppRef = React.useRef<any>();
  const microAppRef = React.useRef<any>(null);

  AHooks.useTimeout(() => {
    // console.log(microAppRef, 'microAppRef sdfoliksdjflkjdsklfjdsklfjlkjlk');
    setArr([]);
  }, 10);

  AHooks.useTimeout(() => {
    microAppUnmount = microAppRef.current.unmount;
    // console.log(microAppRef, 'microAppRef sdfoliksdjflkjdsklfjdsklfjlkjlk');
    // setArr([]);
  }, 100);

  AHooks.useUnmount(() => {
    microAppUnmount && microAppUnmount();
    microAppUnmount = null;
    // console.info(microAppUnmount, 'useUnmount +++++++++++++++++++++++++++++');
    // microAppRef.current?.mountPromise.then(() => {
    //   console.log('app1 mount');
    // });
  });

  return (<>
    {/*<Button*/}
    {/*  onClick={() => {*/}
    {/*    console.info(microAppRef, 'onClickv');*/}
    {/*  }}>11111</Button>*/}
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
