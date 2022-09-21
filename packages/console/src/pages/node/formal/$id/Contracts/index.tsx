import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { Space, DatePicker } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FResource from '@/components/FIcons/FResource';
import { FLoading, FNodes } from '@/components/FIcons';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManager_Contract_Page_ModelState } from '@/models/connect';
import {
  OnChange_Authorize_Date_Action,
  OnChange_Authorize_KeywordsInput_Action,
  OnChange_Authorize_Status_Action,
  // OnChange_Authorize_SubjectType_Action,
  OnChange_Authorized_Date_Action,
  OnChange_Authorized_KeywordsInput_Action,
  OnChange_Authorized_Status_Action,
  // OnChange_Authorized_SubjectType_Action,
  OnChangeShowPageAction,
  OnClick_Authorize_LoadMoreBtn_Action,
  OnClick_Authorized_LoadMoreBtn_Action,
  OnClickViewDetailsBtnAction,
  OnCloseContractDetailsDrawerAction,
  OnMountPageAction,
} from '@/models/nodeManager_Contract_Page';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import FInput from '@/components/FInput';
import FDropdownMenu from '@/components/FDropdownMenu';
import moment, { Moment } from 'moment';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';
import Sider from '@/pages/node/formal/$id/Sider';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';

// const RangePicker: any = DatePicker.RangePicker;

interface ContractProps {
  dispatch: Dispatch;
  nodeManager_Contract_Page: NodeManager_Contract_Page_ModelState;
}

function Contract({ dispatch, nodeManager_Contract_Page }: ContractProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'nodeManager_Contract_Page/onMountPage',
    });
  });

  const columns1: ColumnsType<typeof nodeManager_Contract_Page.authorize_List[number]> = [
    {
      title: (<FComponentsLib.FTitleText type='table' text={'标的物 | 类型 | 所签授权策略'} />),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (<div className={styles.target}>
          <div className={styles.targetCover}>
            {/*<img src={record.cover || imgSrc} />*/}
            <FCoverImage
              style={{ borderRadius: 4 }}
              src={record.cover || ''}
              width={120}
            />
            <div className={styles.targetType}>
              <FIdentityTypeBadge status={record.subjectType} />
            </div>
          </div>

          <div style={{ width: 10 }} />
          <div className={styles.targetInfo}>
            <FComponentsLib.FContentText text={record.subjectName} type='highlight' />
            <div style={{ height: 10 }} />
            {/*<Space size={5} className={styles.targetInfoLabels}>*/}
            {/*  <label>{record.contractName}</label>*/}
            {/*</Space>*/}
            <FComponentsLib.F_Contract_And_Policy_Labels data={[{ text: record.contractName, dot: '' }]} />
          </div>
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={'授权方 | 被授权方'} />),
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

            <FComponentsLib.FContentText text={record.licensorName} type='highlight' />
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
              record.licenseeType === 'user' && (<FComponentsLib.FIcons.FUser style={{ fontSize: 14 }} />)
            }

            <FComponentsLib.FContentText text={record.licenseeName} type='highlight' />
          </Space>
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={'合约状态 | 签约时间 | 合约ID'} />),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (<div className={styles.contract}>
          {
            record.status === 'authorized' && (<span className={styles.authorized}>已授权</span>)
          }
          {
            record.status === 'testAuthorized' && (<span className={styles.authorized}>测试授权</span>)
          }
          {
            record.status === 'unauthorized' && (<span className={styles.pending}>未授权</span>)
          }
          {
            record.status === 'exception' && (<span className={styles.exception}>异常</span>)
          }
          {
            record.status === 'terminated' && (<span className={styles.terminated}>已终止</span>)
          }
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText text={record.dataTime} type='additional2' />
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText text={record.contractID} type='additional2' />
          <div style={{ height: 5 }} />
          <FComponentsLib.FTextBtn
            className={styles.hoverVisible}
            type='primary'
            onClick={() => {
              dispatch<OnClickViewDetailsBtnAction>({
                type: 'nodeManager_Contract_Page/onClickViewDetailsBtn',
                payload: {
                  value: record.contractID,
                },
              });
            }}
          >查看合约详情</FComponentsLib.FTextBtn>
        </div>);
      },
    },
  ];

  const columns2: ColumnsType<typeof nodeManager_Contract_Page.authorized_List[number]> = [
    {
      title: (<FComponentsLib.FTitleText type='table' text={'标的物 | 类型 | 所签授权策略'} />),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (<div className={styles.target}>
          <div className={styles.targetCover}>
            {/*<img src={record.cover || imgSrc} />*/}
            <FCoverImage
              style={{ borderRadius: 4 }}
              src={record.cover || ''}
              width={120}
            />
            <div className={styles.targetType}>
              <FIdentityTypeBadge status={record.subjectType} />
            </div>
          </div>

          <div style={{ width: 10 }} />
          <div className={styles.targetInfo}>
            <FComponentsLib.FContentText text={record.subjectName} type='highlight' />
            <div style={{ height: 10 }} />
            <Space size={5} className={styles.targetInfoLabels}>
              <label>{record.contractName}</label>
            </Space>
          </div>
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={'授权方 | 被授权方'} />),
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

            <FComponentsLib.FContentText text={record.licensorName} type='highlight' />
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
              record.licenseeType === 'user' && (<FComponentsLib.FIcons.FUser style={{ fontSize: 14 }} />)
            }

            <FComponentsLib.FContentText text={record.licenseeName} type='highlight' />
          </Space>
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={'合约状态 | 签约时间 | 合约ID'} />),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (<div className={styles.contract}>
          {
            record.status === 'authorized' && (<span className={styles.authorized}>已授权</span>)
          }
          {
            record.status === 'testAuthorized' && (<span className={styles.authorized}>测试授权</span>)
          }
          {
            record.status === 'unauthorized' && (<span className={styles.pending}>未授权</span>)
          }
          {
            record.status === 'exception' && (<span className={styles.exception}>异常</span>)
          }
          {
            record.status === 'terminated' && (<span className={styles.terminated}>已终止</span>)
          }
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText text={record.dataTime} type='additional2' />
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText text={record.contractID} type='additional2' />
          <div style={{ height: 5 }} />
          <FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              dispatch<OnClickViewDetailsBtnAction>({
                type: 'nodeManager_Contract_Page/onClickViewDetailsBtn',
                payload: {
                  value: record.contractID,
                },
              });
            }}
            className={styles.hoverVisible}
          >查看合约详情</FComponentsLib.FTextBtn>
        </div>);
      },
    },
  ];

  return (<FLeftSiderLayout
    type={'empty'}
    sider={<Sider />}
  >
    <div className={styles.styles}>
      <div style={{ height: 30 }} />
      <div className={styles.header}>
        <a
          className={nodeManager_Contract_Page.showPage === 'authorize' ? styles.active : ''}
          onClick={() => {
            dispatch<OnChangeShowPageAction>({
              type: 'nodeManager_Contract_Page/onChangeShowPage',
              payload: {
                value: 'authorize',
              },
            });
          }}>授权合约</a>
        <div style={{ width: 30 }} />
        <a
          className={nodeManager_Contract_Page.showPage === 'authorized' ? styles.active : ''}
          onClick={() => {
            dispatch<OnChangeShowPageAction>({
              type: 'nodeManager_Contract_Page/onChangeShowPage',
              payload: {
                value: 'authorized',
              },
            });
          }}>被授权合约</a>
      </div>

      <div style={{ height: 30 }} />

      {
        nodeManager_Contract_Page.showPage === 'authorize'
          ? (<div className={styles.content}>
            {
              nodeManager_Contract_Page.authorize_ListState === 'noData'
                ? (<FNoDataTip height={600} tipText={'无数据'} />)
                : (<>
                  <div className={styles.filter}>
                    <Space size={50}>
                      {/*<Space size={2}>*/}
                      {/*  <FContentText text={'标的物类型：'} />*/}
                      {/*  <FDropdownMenu*/}
                      {/*    options={nodeManager_Contract_Page.authorize_SubjectType_Options}*/}
                      {/*    text={nodeManager_Contract_Page.authorize_SubjectType_Options.find((so) => {*/}
                      {/*      return nodeManager_Contract_Page.authorize_SubjectType === so.value;*/}
                      {/*    })?.text || ''}*/}
                      {/*    onChange={(value) => {*/}
                      {/*      dispatch<OnChange_Authorize_SubjectType_Action>({*/}
                      {/*        type: 'nodeManager_Contract_Page/onChange_Authorize_SubjectType',*/}
                      {/*        payload: {*/}
                      {/*          value: value as 'all',*/}
                      {/*        },*/}
                      {/*      });*/}
                      {/*    }}*/}
                      {/*  />*/}
                      {/*</Space>*/}
                      <Space size={2}>
                        <FComponentsLib.FContentText text={'合约状态：'} />
                        <FDropdownMenu
                          options={nodeManager_Contract_Page.authorize_Status_Options}
                          text={nodeManager_Contract_Page.authorize_Status_Options.find((so) => {
                            return so.value === nodeManager_Contract_Page.authorize_Status;
                          })?.text || ''}
                          onChange={(value) => {
                            dispatch<OnChange_Authorize_Status_Action>({
                              type: 'nodeManager_Contract_Page/onChange_Authorize_Status',
                              payload: {
                                value: value as 'all',
                              },
                            });
                          }}
                        />
                      </Space>
                      <Space size={2}>
                        <FComponentsLib.FContentText
                          text={'签约时间：'}
                        />
                        <DatePicker.RangePicker
                          value={nodeManager_Contract_Page.authorize_Date}
                          onChange={(value: any) => {
                            // console.log(value, '@Asdfai89jhkljrlk');
                            dispatch<OnChange_Authorize_Date_Action>({
                              type: 'nodeManager_Contract_Page/onChange_Authorize_Date',
                              payload: {
                                value: value,
                              },
                            });
                          }}
                          // locale={{lang: 'en'}}
                          disabledDate={(date: any) => {
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
                          type: 'nodeManager_Contract_Page/onChange_Authorize_KeywordsInput',
                          payload: {
                            value: value,
                          },
                        });
                      }}
                    />
                  </div>
                  {
                    nodeManager_Contract_Page.authorize_ListState === 'loading' && (<FLoadingTip height={600} />)
                  }

                  {
                    nodeManager_Contract_Page.authorize_ListState === 'noSearchResult' && (
                      <FNoDataTip height={600} tipText={'无搜索结果'} />)
                  }
                  {
                    nodeManager_Contract_Page.authorize_ListState === 'loaded' && (<><FTable
                      className={styles.table}
                      rowClassName={styles.rowClassName}
                      columns={columns1}
                      dataSource={nodeManager_Contract_Page.authorize_List.map((al) => {
                        return {
                          key: al.contractID,
                          ...al,
                        };
                      })}
                    />
                      <div className={styles.contentFooter}>
                        {
                          nodeManager_Contract_Page.authorize_ListMore === 'andMore' && (<FComponentsLib.FRectBtn
                            type='primary'
                            onClick={() => {
                              dispatch<OnClick_Authorize_LoadMoreBtn_Action>({
                                type: 'nodeManager_Contract_Page/onClick_Authorize_LoadMoreBtn',
                              });
                            }}
                          >
                            加载更多
                          </FComponentsLib.FRectBtn>)
                        }

                        {
                          nodeManager_Contract_Page.authorize_ListMore === 'loading' && (
                            <FLoading style={{ fontSize: 24 }} />)
                        }

                        {
                          nodeManager_Contract_Page.authorize_ListMore === 'noMore' && (
                            <FComponentsLib.FTipText text={'没有更多~'} type='third' />)
                        }

                      </div>
                    </>)
                  }
                </>)
            }

          </div>)
          : (<div className={styles.content}>
            {
              nodeManager_Contract_Page.authorized_ListState === 'noData'
                ? (<FNoDataTip height={600} tipText={'无数据'} />)
                : (<>
                  <div className={styles.filter}>
                    <Space size={50}>
                      {/*<Space size={2}>*/}
                      {/*  <FContentText text={'标的物类型：'} />*/}
                      {/*  <FDropdownMenu*/}
                      {/*    options={nodeManager_Contract_Page.authorized_SubjectType_Options}*/}
                      {/*    text={nodeManager_Contract_Page.authorized_SubjectType_Options.find((so) => {*/}
                      {/*      return nodeManager_Contract_Page.authorized_SubjectType === so.value;*/}
                      {/*    })?.text || ''}*/}
                      {/*    onChange={(value) => {*/}
                      {/*      dispatch<OnChange_Authorized_SubjectType_Action>({*/}
                      {/*        type: 'nodeManager_Contract_Page/onChange_Authorized_SubjectType',*/}
                      {/*        payload: {*/}
                      {/*          value: value as 'all',*/}
                      {/*        },*/}
                      {/*      });*/}
                      {/*    }}*/}
                      {/*  />*/}
                      {/*</Space>*/}
                      <Space size={2}>
                        <FComponentsLib.FContentText text={'合约状态：'} />
                        <FDropdownMenu
                          options={nodeManager_Contract_Page.authorized_Status_Options}
                          text={nodeManager_Contract_Page.authorized_Status_Options.find((so) => {
                            return so.value === nodeManager_Contract_Page.authorized_Status;
                          })?.text || ''}
                          onChange={(value) => {
                            dispatch<OnChange_Authorized_Status_Action>({
                              type: 'nodeManager_Contract_Page/onChange_Authorized_Status',
                              payload: {
                                value: value as 'all',
                              },
                            });
                          }}
                        />
                      </Space>
                      <Space size={2}>
                        <FComponentsLib.FContentText text={'签约时间：'} />
                        <DatePicker.RangePicker
                          value={nodeManager_Contract_Page.authorized_Date}
                          onChange={(value: any) => {
                            // console.log(value, '@Asdfai89jhkljrlk');
                            dispatch<OnChange_Authorized_Date_Action>({
                              type: 'nodeManager_Contract_Page/onChange_Authorized_Date',
                              payload: {
                                value: value,
                              },
                            });
                          }}
                          // locale={{lang: 'en'}}
                          disabledDate={(date: any) => {
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
                          type: 'nodeManager_Contract_Page/onChange_Authorized_KeywordsInput',
                          payload: {
                            value: value,
                          },
                        });
                      }}
                    />
                  </div>
                  {
                    nodeManager_Contract_Page.authorized_ListState === 'loading' && (<FLoadingTip height={600} />)
                  }

                  {
                    nodeManager_Contract_Page.authorized_ListState === 'noSearchResult' && (
                      <FNoDataTip height={600} tipText={'无搜索结果'} />)
                  }
                  {
                    nodeManager_Contract_Page.authorized_ListState === 'loaded' && (<>
                      <FTable
                        className={styles.table}
                        rowClassName={styles.rowClassName}
                        columns={columns2}
                        dataSource={nodeManager_Contract_Page.authorized_List.map((al) => {
                          return {
                            key: al.contractID,
                            ...al,
                          };
                        })}
                      />
                      <div className={styles.contentFooter}>
                        {
                          nodeManager_Contract_Page.authorized_ListMore === 'andMore' && (<FComponentsLib.FRectBtn
                            type='primary'
                            onClick={() => {
                              dispatch<OnClick_Authorized_LoadMoreBtn_Action>({
                                type: 'nodeManager_Contract_Page/onClick_Authorized_LoadMoreBtn',
                              });
                            }}
                          >
                            加载更多
                          </FComponentsLib.FRectBtn>)
                        }

                        {
                          nodeManager_Contract_Page.authorized_ListMore === 'loading' && (
                            <FLoading style={{ fontSize: 24 }} />)
                        }

                        {
                          nodeManager_Contract_Page.authorized_ListMore === 'noMore' && (
                            <FComponentsLib.FTipText text={'没有更多~'} type='third' />)
                        }

                      </div>
                    </>)
                  }
                </>)
            }


          </div>)
      }

      <div style={{ height: 100 }} />

      <FContractDetailsDrawer
        contractID={nodeManager_Contract_Page.contractDetailsID}
        onClose={() => {
          dispatch<OnCloseContractDetailsDrawerAction>({
            type: 'nodeManager_Contract_Page/onCloseContractDetailsDrawer',
          });
        }}
      />
    </div>
  </FLeftSiderLayout>);
}

export default connect(({ nodeManager_Contract_Page }: ConnectState) => ({
  nodeManager_Contract_Page,
}))(Contract);
