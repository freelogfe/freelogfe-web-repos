import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { FContentText, FTitleText } from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { Space, DatePicker } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FResource from '@/components/FIcons/FResource';
import { FLoading, FNodes, FUser } from '@/components/FIcons';
import { FTextBtn } from '@/components/FButton';
import * as AHooks from 'ahooks';
import { connect, Dispatch } from 'dva';
import { ConnectState, ContractPageModelState } from '@/models/connect';
import {
  OnChange_Authorize_Date_Action,
  OnChange_Authorize_KeywordsInput_Action,
  OnChange_Authorize_Status_Action,
  OnChange_Authorize_SubjectType_Action,
  OnChange_Authorized_Date_Action, OnChange_Authorized_KeywordsInput_Action,
  OnChange_Authorized_Status_Action,
  OnChange_Authorized_SubjectType_Action,
  OnChangeShowPageAction,
  OnClickViewDetailsBtnAction,
  OnCloseContractDetailsDrawerAction,
  OnMountPageAction,
} from '@/models/contractPage';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import FInput from '@/components/FInput';
import FDropdownMenu from '@/components/FDropdownMenu';
import moment, { Moment } from 'moment';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import FUtil1 from '@/utils';

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
          {
            contractPage.authorize_ListState === 'noData'
              ? (<FNoDataTip height={600} tipText={'无数据'} />)
              : (<>
                <div className={styles.filter}>
                  <Space size={50}>
                    <Space size={2}>
                      <FContentText text={'标的物类型：'} />
                      <FDropdownMenu
                        options={contractPage.authorize_SubjectType_Options}
                        text={contractPage.authorize_SubjectType_Options.find((so) => {
                          return contractPage.authorize_SubjectType === so.value;
                        })?.text || ''}
                        onChange={(value) => {
                          dispatch<OnChange_Authorize_SubjectType_Action>({
                            type: 'contractPage/onChange_Authorize_SubjectType',
                            payload: {
                              value: value as 'all',
                            },
                          });
                        }}
                      />
                    </Space>
                    <Space size={2}>
                      <FContentText text={'合约状态：'} />
                      <FDropdownMenu
                        options={contractPage.authorize_Status_Options}
                        text={contractPage.authorize_Status_Options.find((so) => {
                          return so.value === contractPage.authorize_Status;
                        })?.text || ''}
                        onChange={(value) => {
                          dispatch<OnChange_Authorize_Status_Action>({
                            type: 'contractPage/onChange_Authorize_Status',
                            payload: {
                              value: value as 'all',
                            },
                          });
                        }}
                      />
                    </Space>
                    <Space size={2}>
                      <FContentText
                        text={'签约时间：'}
                      />
                      <DatePicker.RangePicker
                        value={contractPage.authorize_Date}
                        onChange={(value: any) => {
                          // console.log(value, '@Asdfai89jhkljrlk');
                          dispatch<OnChange_Authorize_Date_Action>({
                            type: 'contractPage/onChange_Authorize_Date',
                            payload: {
                              value: value,
                            },
                          });
                        }}
                        // locale={{lang: 'en'}}
                        disabledDate={(date) => {
                          // console.log(date, 'date234234234');
                          return moment().isBefore(date);
                        }}
                      />
                    </Space>
                  </Space>
                  <FInput
                    className={styles.filterInput}
                    wrapClassName={styles.filterInput}
                    theme='dark'
                    debounce={300}
                    onDebounceChange={(value) => {
                      dispatch<OnChange_Authorize_KeywordsInput_Action>({
                        type: 'contractPage/onChange_Authorize_KeywordsInput',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  />
                </div>
                {
                  contractPage.authorize_ListState === 'loading' && (<FLoadingTip height={600} />)
                }

                {
                  contractPage.authorize_ListState === 'noSearchResult' && (<FNoDataTip height={600} tipText={'无搜索结果'} />)
                }
                {
                  contractPage.authorize_ListState === 'loaded' && (<FTable
                    columns={columns1}
                    dataSource={contractPage.authorize_List.map((al) => {
                      return {
                        key: al.contractID,
                        ...al,
                      };
                    })}
                  />)
                }
              </>)
          }
        </div>)
        : (<div className={styles.content}>
          {
            contractPage.authorized_ListState === 'noData'
              ? (<FNoDataTip height={600} tipText={'无数据'} />)
              : (<>
                <div className={styles.filter}>
                  <Space size={50}>
                    <Space size={2}>
                      <FContentText text={'标的物类型：'} />
                      <FDropdownMenu
                        options={contractPage.authorized_SubjectType_Options}
                        text={contractPage.authorized_SubjectType_Options.find((so) => {
                          return contractPage.authorized_SubjectType === so.value;
                        })?.text || ''}
                        onChange={(value) => {
                          dispatch<OnChange_Authorized_SubjectType_Action>({
                            type: 'contractPage/onChange_Authorized_SubjectType',
                            payload: {
                              value: value as 'all',
                            },
                          });
                        }}
                      />
                    </Space>
                    <Space size={2}>
                      <FContentText text={'合约状态：'} />
                      <FDropdownMenu
                        options={contractPage.authorized_Status_Options}
                        text={contractPage.authorized_Status_Options.find((so) => {
                          return so.value === contractPage.authorized_Status;
                        })?.text || ''}
                        onChange={(value) => {
                          dispatch<OnChange_Authorized_Status_Action>({
                            type: 'contractPage/onChange_Authorized_Status',
                            payload: {
                              value: value as 'all',
                            },
                          });
                        }}
                      />
                    </Space>
                    <Space size={2}>
                      <FContentText text={'签约时间：'} />
                      <DatePicker.RangePicker
                        value={contractPage.authorized_Date}
                        onChange={(value: any) => {
                          // console.log(value, '@Asdfai89jhkljrlk');
                          dispatch<OnChange_Authorized_Date_Action>({
                            type: 'contractPage/onChange_Authorized_Date',
                            payload: {
                              value: value,
                            },
                          });
                        }}
                        // locale={{lang: 'en'}}
                        disabledDate={(date) => {
                          // console.log(date, 'date234234234');
                          return moment().isBefore(date);
                        }}
                      />
                    </Space>
                  </Space>
                  <FInput
                    className={styles.filterInput}
                    wrapClassName={styles.filterInput}
                    theme='dark'
                    debounce={300}
                    onDebounceChange={(value) => {
                      dispatch<OnChange_Authorized_KeywordsInput_Action>({
                        type: 'contractPage/onChange_Authorized_KeywordsInput',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  />
                </div>
                {
                  contractPage.authorized_ListState === 'loading' && (<FLoadingTip height={600} />)
                }

                {
                  contractPage.authorized_ListState === 'noSearchResult' && (<FNoDataTip height={600} tipText={'无搜索结果'} />)
                }
                {
                  contractPage.authorized_ListState === 'loaded' && (<FTable
                    columns={columns2}
                    dataSource={contractPage.authorized_List.map((al) => {
                      return {
                        key: al.contractID,
                        ...al,
                      };
                    })}
                  />)
                }
              </>)
          }
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
