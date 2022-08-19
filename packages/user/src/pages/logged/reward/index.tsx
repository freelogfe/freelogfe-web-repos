import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import {
  OnClick_ChangingPasswordBtn_Action,
  OnClick_Table_LoadMoreBtn_Action,
  WalletPageModelState,
} from '@/models/walletPage';
import FSafetyLock from '@/components/FIcons/FSafetyLock';
import { ColumnsType } from 'antd/lib/table';
import FTable from '@/components/FTable';
import FListFooter from '@/components/FListFooter';

interface RewardProps {

}

function Reward({}: RewardProps) {

  const columns: ColumnsType<any> = [
    {
      title: (<FComponentsLib.FTitleText text={'时间'} type='table' />),
      dataIndex: 'dataTime',
      key: 'dataTime',
      width: 150,
      render(_, record) {
        return (<div>
          <FComponentsLib.FContentText text={record.date} type='normal' />
          <FComponentsLib.FContentText text={record.time} type='normal' />
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText text={'说明'} type='table' />),
      // title: (<FTitleText text={FI18n.i18nNext.t('header_tran_description')} type='table' />),
      dataIndex: 'description',
      key: 'description',
      width: 470,
      render(_, record) {
        return (<div>
          <FComponentsLib.FContentText
            text={record.digest}
            type='highlight'
          />
        </div>);
      },
    }, {
      // title: (<FTitleText text={'金额（枚）'} type='table' />),
      title: (<FComponentsLib.FTitleText text={'金额（元）'} type='table' />),
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render(_, record) {
        return (<div>
          <FComponentsLib.FTitleText
            text={record.transactionAmount.startsWith('-') ? record.transactionAmount : ('+' + record.transactionAmount)}
            type='h1'
          />
          <FComponentsLib.FContentText
            text={`余额 ${record.afterBalance}`}
            type='additional1'
          />
        </div>);
      },
    },
  ];

  return (<div className={styles.styles}>
    <div style={{ height: 40 }} />
    <FComponentsLib.FTitleText
      type='h1'
      text={'活动奖励'}
    />
    <div style={{ height: 20 }} />
    <div className={styles.AccountInfo}>
      <div>
        <FComponentsLib.FTitleText
          type='h4'
          text={'可提现金额（元）'}
        />
        <div style={{ height: 15 }} />
        <div className={styles.Gold}>{1234234}</div>
      </div>
      <FComponentsLib.FRectBtn type={'primary'}>提现至微信</FComponentsLib.FRectBtn>
    </div>

    <div style={{ height: 40 }} />
    <FComponentsLib.FTitleText type='h1' text={'奖励明细'} />
    <div style={{ height: 20 }} />

    <div className={styles.TableBody}>
      <FTable
        columns={columns}
        dataSource={[]}
      />

      {/*<FListFooter*/}
      {/*  state={walletPage.table_More}*/}
      {/*  onClickLoadMore={() => {*/}
      {/*    dispatch<OnClick_Table_LoadMoreBtn_Action>({*/}
      {/*      type: 'walletPage/onClick_Table_LoadMoreBtn',*/}
      {/*    });*/}
      {/*  }}*/}
      {/*/>*/}
    </div>

  </div>);
}

export default Reward;
