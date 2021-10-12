import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { FContentText, FTitleText } from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { Space, DatePicker } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FResource from '@/components/FIcons/FResource';
import { FNodes, FUser } from '@/components/FIcons';
import { FTextBtn } from '@/components/FButton';
import * as AHooks from 'ahooks';
import { connect, Dispatch } from 'dva';
import { ConnectState, ContractPageModelState } from '@/models/connect';
import {
  OnChangeShowPageAction,
  OnClickViewDetailsBtnAction,
  OnCloseContractDetailsDrawerAction,
  OnMountPageAction,
} from '@/models/contractPage';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import FInput from '@/components/FInput';
import FDropdownMenu from '@/components/FDropdownMenu';

interface ContractProps {
  dispatch: Dispatch;
  contractPage: ContractPageModelState;
}

function Contract({ dispatch, contractPage }: ContractProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'contractPage/onMountPage',
    });
  });

  const columns1: ColumnsType<typeof contractPage.authorize_List[number]> = [
    {
      title: (<FTitleText type='table' text={'标的物 | 类型 | 所签授权策略'} />),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (<div className={styles.target}>
          <div className={styles.targetCover}>
            <img src={record.cover || imgSrc} />
            <div>
              <FIdentityTypeBadge status={record.subjectType} />
            </div>
          </div>

          <div style={{ width: 10 }} />
          <div className={styles.targetInfo}>
            <FContentText text={record.subjectName} type='highlight' />
            <div style={{ height: 10 }} />
            <Space size={5} className={styles.targetInfoLabels}>
              <label>{record.contractName}</label>
            </Space>
          </div>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'授权方 | 被授权方'} />),
      dataIndex: 'signatory',
      key: 'signatory',
      render(_: any, record) {
        return (<div className={styles.signatory}>
          <Space size={5}>
            {
              record.licensorType === 'resource' && (<FResource style={{ fontSize: 14 }} />)
            }
            {
              record.licensorType === 'node' && (<FNodes style={{ fontSize: 14 }} />)
            }

            {/*{*/}
            {/*  record.licensorType === '' && (<FUser style={{ fontSize: 14 }} />)*/}
            {/*}*/}

            <FContentText text={record.licensorName} type='highlight' />
          </Space>
          <div style={{ height: 10 }} />
          <Space size={5}>
            {
              record.licenseeType === 'resource' && (<FResource style={{ fontSize: 14 }} />)
            }
            {
              record.licenseeType === 'node' && (<FNodes style={{ fontSize: 14 }} />)
            }

            {
              record.licenseeType === 'user' && (<FUser style={{ fontSize: 14 }} />)
            }

            <FContentText text={record.licenseeName} type='highlight' />
          </Space>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'合约状态 | 签约时间 | 合约ID'} />),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (<div className={styles.contract}>
          {
            record.status === 'authorization' && (<span className={styles.authorized}>已授权</span>)
          }
          {
            record.status === 'pending' && (<span className={styles.pending}>待执行</span>)
          }
          {
            record.status === 'exception' && (<span className={styles.exception}>异常</span>)
          }
          {
            record.status === 'terminated' && (<span className={styles.terminated}>已终止</span>)
          }
          <div style={{ height: 5 }} />
          <FContentText text={record.dataTime} type='additional2' />
          <div style={{ height: 5 }} />
          <FContentText text={record.contractID} type='additional2' />
          <div style={{ height: 5 }} />
          <FTextBtn
            type='primary'
            onClick={() => {
              dispatch<OnClickViewDetailsBtnAction>({
                type: 'contractPage/onClickViewDetailsBtn',
                payload: {
                  value: record.contractID,
                },
              });
            }}
          >查看合约详情</FTextBtn>
        </div>);
      },
    },
  ];

  const columns2: ColumnsType<typeof contractPage.authorized_List[number]> = [
    {
      title: (<FTitleText type='table' text={'标的物 | 类型 | 所签授权策略'} />),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (<div className={styles.target}>
          <div className={styles.targetCover}>
            <img src={record.cover || imgSrc} />
            <div>
              <FIdentityTypeBadge status={record.subjectType} />
            </div>
          </div>

          <div style={{ width: 10 }} />
          <div className={styles.targetInfo}>
            <FContentText text={record.subjectName} type='highlight' />
            <div style={{ height: 10 }} />
            <Space size={5} className={styles.targetInfoLabels}>
              <label>{record.contractName}</label>
            </Space>
          </div>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'授权方 | 被授权方'} />),
      dataIndex: 'signatory',
      key: 'signatory',
      render(_: any, record) {
        return (<div className={styles.signatory}>
          <Space size={5}>
            {
              record.licensorType === 'resource' && (<FResource style={{ fontSize: 14 }} />)
            }
            {
              record.licensorType === 'node' && (<FNodes style={{ fontSize: 14 }} />)
            }

            {/*{*/}
            {/*  record.licensorType === '' && (<FUser style={{ fontSize: 14 }} />)*/}
            {/*}*/}

            <FContentText text={record.licensorName} type='highlight' />
          </Space>
          <div style={{ height: 10 }} />
          <Space size={5}>
            {
              record.licenseeType === 'resource' && (<FResource style={{ fontSize: 14 }} />)
            }
            {
              record.licenseeType === 'node' && (<FNodes style={{ fontSize: 14 }} />)
            }

            {
              record.licenseeType === 'user' && (<FUser style={{ fontSize: 14 }} />)
            }

            <FContentText text={record.licenseeName} type='highlight' />
          </Space>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'合约状态 | 签约时间 | 合约ID'} />),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (<div className={styles.contract}>
          {
            record.status === 'authorization' && (<span className={styles.authorized}>已授权</span>)
          }
          {
            record.status === 'pending' && (<span className={styles.pending}>待执行</span>)
          }
          {
            record.status === 'exception' && (<span className={styles.exception}>异常</span>)
          }
          {
            record.status === 'terminated' && (<span className={styles.terminated}>已终止</span>)
          }
          <div style={{ height: 5 }} />
          <FContentText text={record.dataTime} type='additional2' />
          <div style={{ height: 5 }} />
          <FContentText text={record.contractID} type='additional2' />
          <div style={{ height: 5 }} />
          <FTextBtn
            type='primary'
            onClick={() => {
              dispatch<OnClickViewDetailsBtnAction>({
                type: 'contractPage/onClickViewDetailsBtn',
                payload: {
                  value: record.contractID,
                },
              });
            }}
          >查看合约详情</FTextBtn>
        </div>);
      },
    },
  ];

  return (<div className={styles.styles}>
    <div style={{ height: 30 }} />
    <div className={styles.header}>
      <a
        className={contractPage.showPage === 'authorize' ? styles.active : ''}
        onClick={() => {
          dispatch<OnChangeShowPageAction>({
            type: 'contractPage/onChangeShowPage',
            payload: {
              value: 'authorize',
            },
          });
        }}>授权合约</a>
      <div style={{ width: 30 }} />
      <a
        className={contractPage.showPage === 'authorized' ? styles.active : ''}
        onClick={() => {
          dispatch<OnChangeShowPageAction>({
            type: 'contractPage/onChangeShowPage',
            payload: {
              value: 'authorized',
            },
          });
        }}>被授权合约</a>
    </div>

    <div style={{ height: 30 }} />


    {
      contractPage.showPage === 'authorize'
        ? (<div className={styles.content}>
          <div className={styles.filter}>
            <Space size={50}>
              <Space size={2}>
                <FContentText text={'标的物类型：'} />
                <FDropdownMenu
                  options={contractPage.authorize_SubjectType_Options}
                  text={contractPage.authorize_SubjectType}
                />
              </Space>
              <Space size={2}>
                <FContentText text={'合约状态：已授权'} />
                <FDropdownMenu
                  options={contractPage.authorize_Status_Options}
                  text={contractPage.authorize_Status}
                />
              </Space>
              <Space size={2}>
                <FContentText text={'签约时间：'} />
                <DatePicker.RangePicker
                  // value={}
                  onChange={([start, end]: any) => {
                    // console.log(value, '@Asdfai89jhkljrlk');

                  }}
                />
              </Space>
            </Space>
            <FInput
              className={styles.filterInput}
              wrapClassName={styles.filterInput}
              theme='dark'
            />
          </div>
          <FTable
            columns={columns1}
            dataSource={contractPage.authorize_List.map((al) => {
              return {
                key: al.contractID,
                ...al,
              };
            })}
          />
        </div>)
        : (<div className={styles.content}>
          <FTable
            columns={columns2}
            dataSource={contractPage.authorized_List.map((al) => {
              return {
                key: al.contractID,
                ...al,
              };
            })}
          />
        </div>)
    }

    <div style={{ height: 100 }} />

    <FContractDetailsDrawer
      contractID={contractPage.contractDetailsID}
      onClose={() => {
        dispatch<OnCloseContractDetailsDrawerAction>({
          type: 'contractPage/onCloseContractDetailsDrawer',
        });
      }}
    />
  </div>);
}

export default connect(({ contractPage }: ConnectState) => ({
  contractPage,
}))(Contract);
