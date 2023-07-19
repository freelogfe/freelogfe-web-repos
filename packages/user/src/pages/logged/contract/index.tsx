import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { Space, DatePicker } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ContractPageModelState } from '@/models/connect';
import {
  OnChange_Authorize_Date_Action,
  OnChange_Authorize_KeywordsInput_Action,
  OnChange_Authorize_Status_Action,
  OnChange_Authorize_SubjectType_Action,
  OnChange_Authorized_Date_Action,
  OnChange_Authorized_KeywordsInput_Action,
  OnChange_Authorized_Status_Action,
  OnChange_Authorized_SubjectType_Action,
  OnChangeShowPageAction,
  OnChange_Authorized_SubjectIds_Action,
  OnClick_Authorize_LoadMoreBtn_Action,
  OnClick_Authorized_LoadMoreBtn_Action,
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
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';

const RangePicker: any = DatePicker.RangePicker;

interface ContractProps {
  dispatch: Dispatch;
  contractPage: ContractPageModelState;
}

function Contract({ dispatch, contractPage }: ContractProps) {
  const [urlParams] = useUrlState<{
    exhibitId: string;
    status: string;
    nodeName: string;
  }>();

  const [keywordsInput, set_keywordsInput] = React.useState<string>('');

  AHooks.useMount(() => {
    if (urlParams.exhibitId) {
      dispatch<OnChangeShowPageAction>({
        type: 'contractPage/onChangeShowPage',
        payload: {
          value: 'authorized',
        },
      });
      dispatch<OnChange_Authorized_SubjectIds_Action>({
        type: 'contractPage/onChange_Authorized_SubjectIds',
        payload: {
          authorized_Status: urlParams.status,
          authorized_SubjectType: 'exhibit',
          authorized_SubjectIds: urlParams.exhibitId,
        },
      });
    }
    dispatch<OnMountPageAction>({
      type: 'contractPage/onMountPage',
    });
  });

  AHooks.useDebounceEffect(() => {
    dispatch<OnChange_Authorized_KeywordsInput_Action>({
      type: 'contractPage/onChange_Authorized_KeywordsInput',
      payload: {
        value: keywordsInput,
      },
    });
  }, [keywordsInput], {
    wait: 300,
  });

  const columns1: ColumnsType<typeof contractPage.authorize_List[number]> = [
    {
      title: (
        <FComponentsLib.FTitleText
          type='table'
          text={'标的物 | 类型 | 所签授权策略'}
        />
      ),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (
          <div className={styles.target}>
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
              <FComponentsLib.FTextBtn
                onClick={() => {
                  self.open(`${FUtil.Format.completeUrlByDomain('console')}${record.subjectType === 'resource'
                    ? FUtil.LinkTo.resourceDetails({
                      resourceID: record.subjectID,
                    })
                    : FUtil.LinkTo.exhibitManagement({
                      exhibitID: record.subjectID,
                    })}`);
                }}
              >
                <FComponentsLib.FContentText
                  text={record.subjectName}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>
              <div style={{ height: 10 }} />
              {/*<Space size={5} className={styles.targetInfoLabels}>*/}
              {/*  <label>{record.contractName}</label>*/}
              {/*</Space>*/}
              <FComponentsLib.F_Contract_And_Policy_Labels
                data={[{ text: record.contractName, dot: '' }]}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <FComponentsLib.FTitleText type='table' text={'授权方 | 被授权方'} />
      ),
      dataIndex: 'signatory',
      key: 'signatory',
      render(_: any, record) {
        return (
          <div className={styles.signatory}>
            <Space size={5}>
              {
                record.licensorType === 'resource' && (
                  <FComponentsLib.FIcons.FResource style={{ fontSize: 14 }} />
                )
              }
              {
                record.licensorType === 'node' && (
                  <FComponentsLib.FIcons.FNodes style={{ fontSize: 14 }} />
                )
              }

              {/*{*/}
              {/*  record.licensorType === '' && (<FUser style={{ fontSize: 14 }} />)*/}
              {/*}*/}

              <FComponentsLib.FTextBtn
                onClick={async () => {
                  if (record.licensorType === 'resource') {
                    self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceDetails({
                      resourceID: record.licensorId,
                    }));
                  }

                  if (record.licensorType === 'node') {
                    const { data } = await FServiceAPI.Node.details({
                      nodeId: Number(record.licensorId),
                    });

                    self.open(FUtil.Format.completeUrlByDomain(data.nodeDomain));
                  }
                }}
              >
                <FComponentsLib.FContentText
                  text={record.licensorName}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>
            </Space>
            <div style={{ height: 10 }} />
            <Space size={5}>
              {
                record.licenseeType === 'resource' && (
                  <FComponentsLib.FIcons.FResource style={{ fontSize: 14 }} />
                )
              }
              {
                record.licenseeType === 'node' && (
                  <FComponentsLib.FIcons.FNodes style={{ fontSize: 14 }} />
                )
              }
              {
                record.licenseeType === 'user' && (
                  <FComponentsLib.FIcons.FUser style={{ fontSize: 14 }} />
                )
              }
              <FComponentsLib.FTextBtn
                onClick={async () => {
                  if (record.licenseeType === 'resource') {
                    self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceDetails({
                      resourceID: record.licenseeId,
                    }));
                  }

                  if (record.licenseeType === 'node') {
                    const { data } = await FServiceAPI.Node.details({
                      nodeId: Number(record.licenseeId),
                    });

                    self.open(FUtil.Format.completeUrlByDomain(data.nodeDomain));
                  }
                }}
              >
                <FComponentsLib.FContentText
                  text={record.licenseeName}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>
            </Space>
          </div>
        );
      },
    },
    {
      title: (
        <FComponentsLib.FTitleText
          type='table'
          text={'合约状态 | 签约时间 | 合约ID'}
        />
      ),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (
          <div className={styles.contract}>
            {record.status === 'authorized' && (
              <span className={styles.authorized}>已授权</span>
            )}
            {record.status === 'testAuthorized' && (
              <span className={styles.authorized}>测试授权</span>
            )}
            {record.status === 'unauthorized' && (
              <span className={styles.pending}>未授权</span>
            )}
            {record.status === 'exception' && (
              <span className={styles.exception}>异常</span>
            )}
            {record.status === 'terminated' && (
              <span className={styles.terminated}>已终止</span>
            )}
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText
              text={record.dataTime}
              type='additional2'
            />
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText
              text={record.contractID}
              type='additional2'
            />
            <div style={{ height: 5 }} />
            <FComponentsLib.FTextBtn
              className={styles.hoverVisible}
              type='primary'
              onClick={() => {
                dispatch<OnClickViewDetailsBtnAction>({
                  type: 'contractPage/onClickViewDetailsBtn',
                  payload: {
                    value: record.contractID,
                  },
                });
              }}
            >
              查看合约详情
            </FComponentsLib.FTextBtn>
          </div>
        );
      },
    },
  ];

  const columns2: ColumnsType<typeof contractPage.authorized_List[number]> = [
    {
      title: (
        <FComponentsLib.FTitleText
          type='table'
          text={'标的物 | 类型 | 所签授权策略'}
        />
      ),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (
          <div className={styles.target}>
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
              <FComponentsLib.FTextBtn onClick={() => {
                self.open(`${FUtil.Format.completeUrlByDomain('console')}${record.subjectType === 'resource'
                  ? FUtil.LinkTo.resourceDetails({
                    resourceID: record.subjectID,
                  })
                  : FUtil.LinkTo.exhibitManagement({
                    exhibitID: record.subjectID,
                  })}`);
              }}>
                <FComponentsLib.FContentText
                  text={record.subjectName}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>
              <div style={{ height: 10 }} />
              <Space size={5} className={styles.targetInfoLabels}>
                <label>{record.contractName}</label>
              </Space>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <FComponentsLib.FTitleText type='table' text={'授权方 | 被授权方'} />
      ),
      dataIndex: 'signatory',
      key: 'signatory',
      render(_: any, record) {
        return (
          <div className={styles.signatory}>
            <Space size={5}>
              {record.licensorType === 'resource' && (<FComponentsLib.FIcons.FResource style={{ fontSize: 14 }} />)}
              {record.licensorType === 'node' && (<FComponentsLib.FIcons.FNodes style={{ fontSize: 14 }} />)}
              <FComponentsLib.FTextBtn
                onClick={async () => {
                  if (record.licensorType === 'resource') {
                    self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceDetails({
                      resourceID: record.licensorId,
                    }));
                  }

                  if (record.licensorType === 'node') {
                    const { data } = await FServiceAPI.Node.details({
                      nodeId: Number(record.licensorId),
                    });

                    self.open(FUtil.Format.completeUrlByDomain(data.nodeDomain));
                  }
                }}
              >
                <FComponentsLib.FContentText
                  text={record.licensorName}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>
            </Space>
            <div style={{ height: 10 }} />
            <Space size={5}>
              {record.licenseeType === 'resource' && (<FComponentsLib.FIcons.FResource style={{ fontSize: 14 }} />)}
              {record.licenseeType === 'node' && (<FComponentsLib.FIcons.FNodes style={{ fontSize: 14 }} />)}
              {record.licenseeType === 'user' && (<FComponentsLib.FIcons.FUser style={{ fontSize: 14 }} />)}

              <FComponentsLib.FTextBtn
                onClick={async () => {
                  if (record.licenseeType === 'resource') {
                    self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceDetails({
                      resourceID: record.licenseeId,
                    }));
                  }

                  if (record.licenseeType === 'node') {
                    const { data } = await FServiceAPI.Node.details({
                      nodeId: Number(record.licenseeId),
                    });
                    // console.log(data, 'GFi8ov sdikjflksdjflsdkjflkj');
                    self.open(FUtil.Format.completeUrlByDomain(data.nodeDomain));
                  }
                }}
              >
                <FComponentsLib.FContentText
                  text={record.licenseeName}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>
            </Space>
          </div>
        );
      },
    },
    {
      title: (
        <FComponentsLib.FTitleText
          type='table'
          text={'合约状态 | 签约时间 | 合约ID'}
        />
      ),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (<div className={styles.contract}>
          {record.status === 'authorized' && (<span className={styles.authorized}>已授权</span>)}
          {record.status === 'testAuthorized' && (<span className={styles.authorized}>测试授权</span>)}
          {record.status === 'unauthorized' && (<span className={styles.pending}>未授权</span>)}
          {record.status === 'exception' && (<span className={styles.exception}>异常</span>)}
          {record.status === 'terminated' && (<span className={styles.terminated}>已终止</span>)}
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText
            text={record.dataTime}
            type='additional2'
          />
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText
            text={record.contractID}
            type='additional2'
          />
          <div style={{ height: 5 }} />
          <FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              dispatch<OnClickViewDetailsBtnAction>({
                type: 'contractPage/onClickViewDetailsBtn',
                payload: {
                  value: record.contractID,
                },
              });
            }}
            className={styles.hoverVisible}
          >
            查看合约详情
          </FComponentsLib.FTextBtn>
        </div>);
      },
    },
  ];

  return (
    <div className={styles.styles}>
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
          }}
        >
          授权合约
        </a>
        <div style={{ width: 30 }} />
        <a
          className={
            contractPage.showPage === 'authorized' ? styles.active : ''
          }
          onClick={() => {
            dispatch<OnChangeShowPageAction>({
              type: 'contractPage/onChangeShowPage',
              payload: {
                value: 'authorized',
              },
            });
          }}
        >
          被授权合约
        </a>
      </div>

      <div style={{ height: 30 }} />

      {
        contractPage.showPage === 'authorize' ? (
          <div className={styles.content}>
            {contractPage.authorize_ListState === 'noData' ? (
              <FNoDataTip height={600} tipText={'无数据'} />
            ) : (
              <>
                <div className={styles.filter}>
                  <Space size={50}>
                    <Space size={2}>
                      <FComponentsLib.FContentText text={'标的物类型：'} />
                      <FDropdownMenu
                        options={contractPage.authorize_SubjectType_Options}
                        text={
                          contractPage.authorize_SubjectType_Options.find(
                            (so) => {
                              return (
                                contractPage.authorize_SubjectType === so.value
                              );
                            },
                          )?.text || ''
                        }
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
                      <FComponentsLib.FContentText text={'合约状态：'} />
                      <FDropdownMenu
                        options={contractPage.authorize_Status_Options}
                        text={
                          contractPage.authorize_Status_Options.find((so) => {
                            return so.value === contractPage.authorize_Status;
                          })?.text || ''
                        }
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
                      <FComponentsLib.FContentText text={'签约时间：'} />
                      <RangePicker
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
                        type: 'contractPage/onChange_Authorize_KeywordsInput',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                    placeholder={FI18n.i18nNext.t('mycontracts_search_contracts_hint')}
                  />
                </div>
                {contractPage.authorize_ListState === 'loading' && (
                  <FLoadingTip height={600} />
                )}

                {contractPage.authorize_ListState === 'noSearchResult' && (
                  <FNoDataTip height={600} tipText={'无搜索结果'} />
                )}
                {contractPage.authorize_ListState === 'loaded' && (
                  <>
                    <FTable
                      className={styles.table}
                      rowClassName={styles.rowClassName}
                      columns={columns1}
                      dataSource={contractPage.authorize_List.map((al) => {
                        return {
                          key: al.contractID,
                          ...al,
                        };
                      })}
                    />
                    <div className={styles.contentFooter}>
                      {contractPage.authorize_ListMore === 'andMore' && (
                        <FComponentsLib.FRectBtn
                          type='primary'
                          onClick={() => {
                            dispatch<OnClick_Authorize_LoadMoreBtn_Action>({
                              type: 'contractPage/onClick_Authorize_LoadMoreBtn',
                            });
                          }}
                        >
                          加载更多
                        </FComponentsLib.FRectBtn>
                      )}

                      {contractPage.authorize_ListMore === 'loading' && (
                        <FComponentsLib.FIcons.FLoading
                          style={{ fontSize: 24 }}
                        />
                      )}

                      {contractPage.authorize_ListMore === 'noMore' && (
                        <FComponentsLib.FTipText
                          text={'没有更多~'}
                          type='third'
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={styles.content}>
            {contractPage.authorized_ListState === 'noData' ? (
              <FNoDataTip height={600} tipText={'无数据'} />
            ) : (
              <>
                <div className={styles.filter}>
                  <Space size={50}>
                    <Space size={2}>
                      <FComponentsLib.FContentText text={'标的物类型：'} />
                      <FDropdownMenu
                        options={contractPage.authorized_SubjectType_Options}
                        text={
                          contractPage.authorized_SubjectType_Options.find(
                            (so) => {
                              return (
                                contractPage.authorized_SubjectType === so.value
                              );
                            },
                          )?.text || ''
                        }
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
                      <FComponentsLib.FContentText text={'合约状态：'} />
                      <FDropdownMenu
                        options={contractPage.authorized_Status_Options}
                        text={
                          contractPage.authorized_Status_Options.find((so) => {
                            return so.value === contractPage.authorized_Status;
                          })?.text || ''
                        }
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
                      <FComponentsLib.FContentText text={'签约时间：'} />
                      <RangePicker
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
                        disabledDate={(date: any) => {
                          // console.log(date, 'date234234234');
                          return moment().isBefore(date);
                        }}
                      />
                    </Space>
                  </Space>
                  <FComponentsLib.FInput.FSearch
                    value={keywordsInput}
                    lengthLimit={-1}
                    className={styles.filterInput}
                    // wrapClassName={styles.filterInput}
                    // theme='dark'
                    // debounce={300}
                    onChange={(e) => {
                      set_keywordsInput(e.target.value);
                    }}
                    placeholder={FI18n.i18nNext.t('contractmngt_search_hint')}
                  />
                </div>
                {
                  contractPage.authorized_SubjectIds && (
                    <div className={styles.exhibitTip + ' ml-20 mt-20'}>
                      <span>{`当前列表为节点 ${urlParams.nodeName} 中的展品 ${contractPage.authorized_List[0]?.subjectName} 的所有已终止合约`}</span>
                      <span
                        className={styles.link + ' ml-10 cur-pointer'}
                        onClick={() => {
                          dispatch<OnChange_Authorized_SubjectIds_Action>({
                            type: 'contractPage/onChange_Authorized_SubjectIds',
                            payload: {
                              authorized_Status: 'all',
                              authorized_SubjectType: 'all',
                              authorized_SubjectIds: '',
                            },
                          });
                        }}
                      >
                    重置
                  </span>
                    </div>
                  )}
                {
                  contractPage.authorized_ListState === 'loading' && (
                    <FLoadingTip height={600} />
                  )
                }

                {
                  contractPage.authorized_ListState === 'noSearchResult' && (
                    <FNoDataTip height={600} tipText={'无搜索结果'} />)
                }
                {
                  contractPage.authorized_ListState === 'loaded' && (
                    <>
                      <FTable
                        className={styles.table}
                        rowClassName={styles.rowClassName}
                        columns={columns2}
                        dataSource={contractPage.authorized_List.map((al) => {
                          return {
                            key: al.contractID,
                            ...al,
                          };
                        })}
                      />
                      <div className={styles.contentFooter}>
                        {
                          contractPage.authorized_ListMore === 'andMore' && (
                            <FComponentsLib.FRectBtn
                              type='primary'
                              onClick={() => {
                                dispatch<OnClick_Authorized_LoadMoreBtn_Action>({
                                  type: 'contractPage/onClick_Authorized_LoadMoreBtn',
                                });
                              }}
                            >
                              加载更多
                            </FComponentsLib.FRectBtn>
                          )
                        }

                        {
                          contractPage.authorized_ListMore === 'loading' && (
                            <FComponentsLib.FIcons.FLoading
                              style={{ fontSize: 24 }}
                            />
                          )}

                        {
                          contractPage.authorized_ListMore === 'noMore' && (
                            <FComponentsLib.FTipText
                              text={'没有更多~'}
                              type='third'
                            />
                          )
                        }
                      </div>
                    </>
                  )}
              </>
            )}
          </div>
        )}

      <div style={{ height: 100 }} />

      <FContractDetailsDrawer
        contractID={contractPage.contractDetailsID}
        onClose={() => {
          dispatch<OnCloseContractDetailsDrawerAction>({
            type: 'contractPage/onCloseContractDetailsDrawer',
          });
        }}
      />
    </div>
  );
}

export default connect(({ contractPage }: ConnectState) => ({
  contractPage,
}))(Contract);
