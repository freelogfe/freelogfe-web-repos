import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { FContentText, FTitleText } from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { Space } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FResource from '@/components/FIcons/FResource';
import { FNodes, FUser } from '@/components/FIcons';
import { FTextBtn } from '@/components/FButton';

interface ContractProps {

}

function Contract({}: ContractProps) {

  const columns: ColumnsType = [
    {
      title: (<FTitleText type='table' text={'标的物 | 类型 | 所签授权策略'} />),
      dataIndex: 'target',
      key: 'target',
      render(text: any, record: any) {
        return (<div className={styles.target}>
          <div className={styles.targetCover}>
            <img src={imgSrc} />
            <div>
              <FIdentityTypeBadge />
            </div>
          </div>

          <div style={{ width: 10 }} />
          <div className={styles.targetInfo}>
            <FContentText text={'我的照片'} type='highlight' />
            <div style={{ height: 10 }} />
            <Space size={5} className={styles.targetInfoLabels}>
              <label>按季度收费</label>
              <label>按季度收费</label>
              <label>按季度收费</label>
            </Space>
          </div>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'授权方 | 被授权方'} />),
      dataIndex: 'signatory',
      key: 'signatory',
      render(text: any, record: any) {
        return (<div className={styles.signatory}>
          <Space size={5}>
            {
              false && (<FResource style={{ fontSize: 14 }} />)
            }
            {
              false && (<FNodes style={{ fontSize: 14 }} />)
            }

            {
              true && (<FUser style={{ fontSize: 14 }} />)
            }

            <FContentText text={'我的节点'} type='highlight' />
          </Space>
          <div style={{ height: 10 }} />
          <Space size={5}>
            {
              false && (<FResource style={{ fontSize: 14 }} />)
            }
            {
              false && (<FNodes style={{ fontSize: 14 }} />)
            }

            {
              true && (<FUser style={{ fontSize: 14 }} />)
            }

            <FContentText text={'我的节点'} type='highlight' />
          </Space>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'合约状态 | 签约时间 | 合约ID'} />),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(text: any, record: any) {
        return (<div className={styles.contract}>
          {
            false && (<span className={styles.authorized}>已授权</span>)
          }
          {
            false && (<span className={styles.pending}>待执行</span>)
          }
          {
            false && (<span className={styles.exception}>异常</span>)
          }
          {
            true && (<span className={styles.terminated}>已终止</span>)
          }
          <div style={{ height: 5 }} />
          <FContentText text={'2020/09/09 12:00'} type='additional2' />
          <div style={{ height: 5 }} />
          <FContentText text={'asakfhadghsifdhdidhfsfoh'} type='additional2' />
          <div style={{ height: 5 }} />
          <FTextBtn type='primary'>查看合约详情</FTextBtn>
        </div>);
      },
    },
  ];

  return (<div className={styles.styles}>
    <div style={{ height: 30 }} />
    <div className={styles.header}>
      <a
        className={styles.active}
        onClick={() => {
          // dispatch<OnChange_ShowPage_Action>({
          //   type: 'settingPage/onChange_ShowPage',
          //   payload: {
          //     value: 'profile',
          //   },
          // });
        }}>授权合约</a>
      <div style={{ width: 30 }} />
      <a
        onClick={() => {
          // dispatch<OnChange_ShowPage_Action>({
          //   type: 'settingPage/onChange_ShowPage',
          //   payload: {
          //     value: 'security',
          //   },
          // });
        }}
        className={''}>被授权合约</a>
    </div>

    <div style={{ height: 30 }} />

    <div className={styles.content}>
      <FTable
        columns={columns}
        dataSource={[{}]}
      />
    </div>
  </div>);
}

export default Contract;
