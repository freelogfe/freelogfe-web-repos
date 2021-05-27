import * as React from 'react';
import styles from './index.less';
import {FContentText, FTipText, FTitleText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
import FSafetyLock from "@/components/FIcons/FSafetyLock";
import FTable from "@/components/FTable";
import {ColumnsType} from "antd/lib/table";

interface WalletProps {

}

function Wallet({}: WalletProps) {

  const columns: ColumnsType<any> = [
    {
      title: (<FTitleText text={'时间'} type="table"/>),
      dataIndex: 'dataTime',
      key: 'dataTime',
      render() {
        return (<div>
          <FContentText text={'今天'} type="normal"/>
          <FContentText text={'12:00'} type="normal"/>
        </div>);
      }
    }, {
      title: (<FTitleText text={'交易说明｜对方｜流水号'} type="table"/>),
      dataIndex: 'num',
      key: 'num',
      render() {
        return (<div>
          <FContentText text={'展品-无尽火域第一章-月收费'} type="highlight"/>
          <FContentText text={'yang｜1297692374989902384'} type="additional1"/>
        </div>);
      }
    }, {
      title: (<FTitleText text={'金额'} type="table"/>),
      dataIndex: 'amount',
      key: 'amount',
      render() {
        return (<div>
          <FTitleText text={'+30.00'} type="h1"/>
          <FContentText text={'12:00'}/>
        </div>);
      }
    }, {
      title: (<FTitleText text={'交易状态'} type="table"/>),
      dataIndex: 'status',
      key: 'status',
      render() {
        if (true) {
          return (<div className={styles.tipProcessing}>系统处理中</div>);
        }
        return (<div className={styles.tipCompleted}>交易完成</div>);
      }
    },
  ];

  return (<div className={styles.styles}>
    <div style={{height: 40}}/>
    <FTitleText type="h1" text={'羽币账户'}/>
    <div style={{height: 20}}/>
    {
      false
        ? (<div className={styles.Inactive}>
          <FTipText text={'账户未激活，激活后可获得 100 枚羽币'} type="second"/>
          <div style={{width: 30}}/>
          <FRectBtn type="primary">激活账户</FRectBtn>
        </div>)
        : (<>
          <div className={styles.AccountInfo}>
            <div>
              <FTitleText type="h4" text={'账户余额（枚）'}/>
              <div style={{height: 15}}/>
              <div className={styles.Gold}>110.00</div>
            </div>
            <div className={styles.ChangePassword}>
              <FSafetyLock style={{fontSize: 32, color: '#DA6666'}}/>
              {/*<div style={{height: 10}}/>*/}
              <div style={{color: '#333', fontSize: 13}}>修改支付密码</div>
            </div>
          </div>
          <div style={{height: 40}}/>
          <FTitleText type="h1" text={'交易记录'}/>
          <div style={{height: 20}}/>
          <FTable
            columns={columns}
            dataSource={[{}, {}, {}]}
          />
        </>)
    }
    <div style={{height: 100}}/>
  </div>);
}

export default Wallet;
