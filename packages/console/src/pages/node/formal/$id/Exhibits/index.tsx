import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { Checkbox, Modal, Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { history } from 'umi';
import { ColumnsType } from 'antd/lib/table/interface';
import {
  ChangeAction,
  FetchExhibitsAction,
  OnChange_Exhibit_InputFilter_Action,
  OnChange_Exhibit_SelectedStatus_Action,
  OnChange_Exhibit_SelectedType_Action,
  OnLoadMore_ExhibitList_Action,
  OnMount_ExhibitPage_Action,
  OnOnlineOrOfflineAction,
  OnUnmount_ExhibitPage_Action,
} from '@/models/nodeManagerPage';
import { ChangeAction as DiscoverChangeAction } from '@/models/discoverPage';
import FNoDataTip from '@/components/FNoDataTip';
import FDropdownMenu from '@/components/FDropdownMenu';
import FLoadingTip from '@/components/FLoadingTip';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/node/formal/$id/Sider';
import FTooltip from '@/components/FTooltip';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FListFooter from '@/components/FListFooter';
import FCoverImage from '@/components/FCoverImage';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';
import FResourceTypeFilter from '@/components/FResourceTypeFilter';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import fCenterMessage from '@/components/fCenterMessage';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import { fOnOffFeedback } from '@/components/fOnOffFeedback';

// import { exhibitManagement } from '../../../../../../../@freelog/tools-lib/dist/utils/linkTo';

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Exhibits({ dispatch, nodeManagerPage }: ExhibitsProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_ExhibitPage_Action>({
      type: 'nodeManagerPage/onMount_ExhibitPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_ExhibitPage_Action>({
      type: 'nodeManagerPage/onUnmount_ExhibitPage',
    });
  });

  const { run } = AHooks.useDebounceFn(() => {
    // console.log(nodeManagerPage.exhibit_InputFilter, 'nodeManagerPage.exhibit_InputFilter )))))');
    dispatch<FetchExhibitsAction>({
      type: 'nodeManagerPage/fetchExhibits',
      payload: {
        restart: true,
      },
    });
  }, {
    wait: 300,
  });

  const dataSource: NodeManagerModelState['exhibit_List'] = nodeManagerPage.exhibit_List.map(
    (i) => ({
      key: i.id,
      ...i,
    }),
  );
  // console.log(exhibit_ListTotal, 'exhibit_ListTotal3092oiklsdf')
  const columns: ColumnsType<NonNullable<NodeManagerModelState['exhibit_List']>[number]> = [
    {
      title: <Space size={5}>
        <Checkbox
          checked={nodeManagerPage.checkedExhibitIDs.length === nodeManagerPage.exhibit_List.length}
          indeterminate={nodeManagerPage.checkedExhibitIDs.length !== 0 && nodeManagerPage.checkedExhibitIDs.length !== nodeManagerPage.exhibit_List.length}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch<ChangeAction>({
                type: 'nodeManagerPage/change',
                payload: {
                  checkedExhibitIDs: nodeManagerPage.exhibit_List.map((o) => {
                    return o.id;
                  }),
                },
              });
            } else {
              dispatch<ChangeAction>({
                type: 'nodeManagerPage/change',
                payload: {
                  checkedExhibitIDs: [],
                },
              });
            }
          }}
        />
        <FComponentsLib.FTitleText
          style={{ display: 'inline-block' }}
          type='table'
          text={'全选'}
        />
      </Space>,
      dataIndex: 'checked',
      key: 'checked',
      render(text, record) {
        return (<Checkbox
          checked={nodeManagerPage.checkedExhibitIDs.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch<ChangeAction>({
                type: 'nodeManagerPage/change',
                payload: {
                  checkedExhibitIDs: [
                    ...nodeManagerPage.checkedExhibitIDs,
                    record.id,
                  ],
                },
              });
            } else {
              dispatch<ChangeAction>({
                type: 'nodeManagerPage/change',
                payload: {
                  checkedExhibitIDs: nodeManagerPage.checkedExhibitIDs.filter((id) => {
                    return id !== record.id;
                  }),
                },
              });
            }
          }}
        />);
      },
      width: 100,
    },
    {
      title: <FComponentsLib.FTitleText text={`${FI18n.i18nNext.t('tableheader_exhibit')}`} type='table' />,
      dataIndex: 'name',
      key: 'name',
      render(_, record) {
        return (
          <div className={styles.info}>
            {/*<img src={record.cover || imgSrc} alt={''} />*/}
            <FCoverImage src={record.cover || ''} width={120} style={{ borderRadius: 4 }} />
            <div style={{ width: 10, flexShrink: 0 }} />
            <div className={styles.infos}>
              <FComponentsLib.FContentText
                singleRow
                text={record.resourceName}
              />
              <div className={styles.sub}>
                <label>{FUtil.Format.resourceTypeKeyArrToResourceType(record.type)}</label>
                <div style={{ width: 5 }} />
                <FComponentsLib.FContentText type='additional2' text={record.title} singleRow />
              </div>
              <div className={styles.polices}>
                {record.policies.length > 0 ? (
                  <FComponentsLib.F_Contract_And_Policy_Labels
                    data={record.policies.map((l) => {
                      return {
                        text: l,
                        dot: '',
                      };
                    })}
                    singleRow
                  />
                ) : (
                  <FComponentsLib.FContentText
                    text={'暂无策略…'}
                    type='additional2'
                  />
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      // width: 100,
      className: styles.tableEdit,
      render(_, record): any {
        return (
          <Space size={25} className={[styles.toolBar, styles.hoverVisible].join(' ')}>
            <FTooltip title={FI18n.i18nNext.t('tip_edit_exhibit')}>
              <span><FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  window.open(
                    FUtil.LinkTo.exhibitManagement({
                      exhibitID: record.id,
                    }),
                  );
                }}
              ><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn></span>
            </FTooltip>

            <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
              <span><FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  window.open(FUtil.LinkTo.resourceDetails({
                    resourceID: record.resourceId,
                  }));
                }}
              >
                <FComponentsLib.FIcons.FFileSearch />
              </FComponentsLib.FTextBtn></span>
            </FTooltip>
          </Space>
        );
      },
    },
    {
      title: <FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('tableheader_exhibit_version')} />,
      dataIndex: 'version',
      key: 'version',
      // width: 125,
      className: styles.tableVersion,
      render(_, record): any {
        return <FComponentsLib.FContentText text={record.version} />;
      },
    },
    {
      // title: <FTitleText type="table" text={FI18n.i18nNext.t('tableheader_show_exhibit')} />,
      title: <FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('switch_set_exhibit_avaliable')} />,
      dataIndex: 'status',
      key: 'status',
      // width: 65,
      className: styles.tableStatus,
      render(_, record): any {
        return (
          <Space size={15}>
            <FSwitch
              disabled={!record.isAuth && !record.isOnline}
              checked={record.isOnline}
              // loading={loading && operateExhibit.id === record.id}
              // onClick={(checked) => changeStatus(checked, record)}
              onChange={async (value) => {
                // console.log('9e8wijofijdslkfjldskjflksdjlkjlkjl');
                if (!value) {
                  const confirm: boolean = await fPromiseModalConfirm({
                    title: '下架展品',
                    description: '下架后，其它用户将无法签约该展品，确认要下架吗？',
                  });
                  if (!confirm) {
                    return;
                  }
                }

                dispatch<OnOnlineOrOfflineAction>({
                  type: 'nodeManagerPage/onOnlineOrOffline',
                  payload: {
                    id: record.id,
                    onlineStatus: value ? 1 : 0,
                  },
                });
              }}
            />
            {
              !record.isAuth && (<FTooltip title={record.authErrorText}>
                <FComponentsLib.FIcons.FWarning />
              </FTooltip>)
            }
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`展品管理 · ${nodeManagerPage.nodeName} - Freelog`}</title>
      </Helmet>
      <FLeftSiderLayout
        type={nodeManagerPage.exhibit_ListState === 'noData' ? 'empty' : 'table'}
        sider={<Sider />}
        // header={}
        contentStyles={{
          backgroundColor: '#fafbfc',
          boxShadow: 'none',
        }}
      >
        {nodeManagerPage.exhibit_ListState === 'noData' && (
          <FNoDataTip
            height={'calc(100vh - 70px)'}
            tipText={FI18n.i18nNext.t('manage_exhibits_empty')}
            btnText={FI18n.i18nNext.t('btn_go_to_resource_market')}
            onClick={() => {
              dispatch<DiscoverChangeAction>({
                type: 'discoverPage/change',
                payload: {
                  resourceType: '-1',
                },
              });
              history.push(FUtil.LinkTo.market());
            }}
          />
        )}

        {
          nodeManagerPage.exhibit_ListState !== 'noData' && (
            <div className={styles.header} style={{ padding: '0 20px', backgroundColor: '#fafbfc' }}>
              <FComponentsLib.FTitleText
                type='h1'
                text={`展品管理 ` + (nodeManagerPage.exhibit_ListTotal === -1 ? '' : `(${nodeManagerPage.exhibit_ListTotal})`)}
              />
              <Space size={80}>
                <div>
                  <span>{FI18n.i18nNext.t('resource_type')}：</span>

                  <FResourceTypeFilter
                    value={nodeManagerPage.exhibit_ResourceTypeCodes}
                    omitTheme={true}
                    onChange={(value) => {
                      dispatch<OnChange_Exhibit_SelectedType_Action>({
                        type: 'nodeManagerPage/onChange_Exhibit_SelectedType',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  <span>状态：</span>
                  <FDropdownMenu
                    options={nodeManagerPage.exhibit_ResourceStateOptions}
                    onChange={(value) => {
                      dispatch<OnChange_Exhibit_SelectedStatus_Action>({
                        type: 'nodeManagerPage/onChange_Exhibit_SelectedStatus',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  >
                  <span style={{ cursor: 'pointer' }}>
                    {
                      nodeManagerPage.exhibit_ResourceStateOptions.find((rso) => {
                        return rso.value === nodeManagerPage.exhibit_SelectedStatus.toString();
                      })?.text
                    }
                    <FComponentsLib.FIcons.FDown style={{ marginLeft: 10, fontSize: 12 }} />
                  </span>
                  </FDropdownMenu>
                </div>
                <div>
                  <FComponentsLib.FInput.FSearch
                    value={nodeManagerPage.exhibit_InputFilter}
                    onChange={(value) => {
                      dispatch<OnChange_Exhibit_InputFilter_Action>({
                        type: 'nodeManagerPage/onChange_Exhibit_InputFilter',
                        payload: {
                          value: value,
                        },
                      });
                      run();
                    }}
                    className={styles.input}
                    // placeholder={FI18n.i18nNext.t('nodemgmt_search_exhibits_hint')}
                    placeholder={FI18n.i18nNext.t('nodemngt_exhibit_search_hint')}
                  />
                </div>
              </Space>
            </div>)
        }

        {nodeManagerPage.exhibit_ListState === 'loading' && (<FLoadingTip height={'calc(100vh - 270px)'} />)}

        {nodeManagerPage.exhibit_ListState === 'noSearchResult' && (
          <FNoDataTip height={'calc(100vh - 270px)'} tipText={'无搜索结果'} />)}

        {
          nodeManagerPage.exhibit_ListState === 'loaded' && (<>
            {
              nodeManagerPage.checkedExhibitIDs.length > 0 && (<>
                {/*true && (<>*/}
                <div className={styles.handled}>
                  <FComponentsLib.FContentText
                    type={'additional2'}
                    style={{ fontSize: 14 }}
                    // text={'已选择2个对象，可进行操作:'}
                    text={FI18n.i18nNext.t('nodemgnt_exhibitmgnt_bulkaction_label_selectedqty', {
                      Qty: nodeManagerPage.checkedExhibitIDs.length,
                    })}
                  />
                  <FComponentsLib.FTextBtn
                    disabled={nodeManagerPage.checkedExhibitIDs.length === 0}
                    type={'primary'}
                    onClick={async () => {
                      if (nodeManagerPage.checkedExhibitIDs.length === 0) {
                        return fCenterMessage({ message: '请选择要执行操作的对象' });
                      }

                      const { ret, errCode, msg, data }: {
                        ret: number;
                        errCode: number;
                        msg: string;
                        data: {
                          [resourceID: string]: {
                            data: any;
                            status: 1 | 2;
                          };
                        }
                      } = await FServiceAPI.Exhibit.batchUpdatePresentableStatus({
                        presentableIds: nodeManagerPage.checkedExhibitIDs,
                        onlineStatus: 1,
                      });

                      if (ret !== 0 || errCode !== 0) {
                        return fCenterMessage({ message: msg });
                      }

                      dispatch<ChangeAction>({
                        type: 'nodeManagerPage/change',
                        payload: {
                          exhibit_List: nodeManagerPage.exhibit_List
                            .map((rl) => {
                              // console.log(data[rl.id], 'data[rl.id] sdifjsd;lkfjlksdjflkjlsdkj');
                              if (data[rl.id] && data[rl.id].status === 1) {
                                return {
                                  ...rl,
                                  // ...(data[rl.id].data || {}),
                                  // policy: data[rl.id].data.policies
                                  //   .filter((l: any) => {
                                  //     return l.status === 1;
                                  //   })
                                  //   .map((l: any) => {
                                  //     return l.policyName;
                                  //   }),
                                  // status: data[rl.id].data.status,
                                  isOnline: true,
                                };
                              }

                              // const failResource = data_failResources.find((fr) => {
                              //   return fr.resourceId === rl.id;
                              // });
                              // // console.log(failResource, 'failResource dsifjsldkfjlksdjflkjsdlkjflkjl');
                              // if (!!failResource) {
                              //   return {
                              //     ...rl,
                              //     policy: failResource.policies
                              //       .filter((l: any) => {
                              //         return l.status === 1;
                              //       })
                              //       .map((l: any) => l.policyName),
                              //     status: failResource.status,
                              //   };
                              // }
                              return rl;
                            }),
                        },
                      });

                      if (Object.values(data).every((d) => {
                        return d.status === 1;
                      })) {
                        fOnOffFeedback({ state: 'on', message: '上架成功' });
                        return;
                      }

                      // console.log(data, 'data sdifjsd;lfjlsdkfjlksdjflksdjflksdjlkj');
                      // dispatch<OnBatchUpdateObjectsAction>({
                      //   type: 'storageHomePage/onBatchUpdateObjects',
                      // });

                      dispatch<ChangeAction>({
                        type: 'nodeManagerPage/change',
                        payload: {
                          updateExhibitResultType: 'online',
                          updateExhibitResult: data,
                        },
                      });

                    }}
                  >
                    <FComponentsLib.FIcons.FUpcast style={{ fontSize: 14 }} />
                    &nbsp;{FI18n.i18nNext.t('nodemgnt_exhibitmgnt_bulkaction_btn_availabletoauth')}
                  </FComponentsLib.FTextBtn>

                  <FComponentsLib.FTextBtn
                    disabled={nodeManagerPage.checkedExhibitIDs.length === 0}
                    type={'primary'}
                    onClick={async () => {
                      if (nodeManagerPage.checkedExhibitIDs.length === 0) {
                        return fCenterMessage({ message: '请选择要执行操作的对象' });
                      }
                      // dispatch<OnBatchUpdateObjectsAction>({
                      //   type: 'storageHomePage/onBatchUpdateObjects',
                      // });

                      const confirm: boolean = await fPromiseModalConfirm({
                        title: '下架展品',
                        description: '下架后，其它用户将无法签约该展品，确认要下架吗？',
                      });
                      if (!confirm) {
                        return;
                      }

                      const { ret, errCode, msg, data }: {
                        ret: number;
                        errCode: number;
                        msg: string;
                        data: {
                          [resourceID: string]: {
                            data: any;
                            status: 1 | 2;
                          };
                        }
                      } = await FServiceAPI.Exhibit.batchUpdatePresentableStatus({
                        presentableIds: nodeManagerPage.checkedExhibitIDs,
                        onlineStatus: 0,
                      });

                      if (ret !== 0 || errCode !== 0) {
                        return fCenterMessage({ message: msg });
                      }

                      // console.log(data, 'data sdifjsd;lfjlsdkfjlksdjflksdjflksdjlkj');
                      // dispatch<OnBatchUpdateObjectsAction>({
                      //   type: 'storageHomePage/onBatchUpdateObjects',
                      // });

                      dispatch<ChangeAction>({
                        type: 'nodeManagerPage/change',
                        payload: {
                          exhibit_List: nodeManagerPage.exhibit_List
                            .map((rl) => {
                              // console.log(data[rl.id], 'data[rl.id] sdifjsd;lkfjlksdjflkjlsdkj');
                              if (data[rl.id] && data[rl.id].status === 1) {
                                return {
                                  ...rl,
                                  // ...(data[rl.id].data || {}),
                                  // policy: data[rl.id].data.policies
                                  //   .filter((l: any) => {
                                  //     return l.status === 1;
                                  //   })
                                  //   .map((l: any) => {
                                  //     return l.policyName;
                                  //   }),
                                  // status: data[rl.id].data.status,
                                  isOnline: false,
                                };
                              }

                              // const failResource = data_failResources.find((fr) => {
                              //   return fr.resourceId === rl.id;
                              // });
                              // // console.log(failResource, 'failResource dsifjsldkfjlksdjflkjsdlkjflkjl');
                              // if (!!failResource) {
                              //   return {
                              //     ...rl,
                              //     policy: failResource.policies
                              //       .filter((l: any) => {
                              //         return l.status === 1;
                              //       })
                              //       .map((l: any) => l.policyName),
                              //     status: failResource.status,
                              //   };
                              // }
                              return rl;
                            }),
                        },
                      });

                      if (Object.values(data).every((d) => {
                        return d.status === 1;
                      })) {
                        fOnOffFeedback({ state: 'off', message: '下架成功' });
                        return;
                      }

                      dispatch<ChangeAction>({
                        type: 'nodeManagerPage/change',
                        payload: {
                          updateExhibitResultType: 'offline',
                          updateExhibitResult: data,
                        },
                      });
                    }}
                  >
                    <FComponentsLib.FIcons.FUpcast style={{ fontSize: 14, transform: 'rotate(180deg)' }} />
                    &nbsp;{FI18n.i18nNext.t('nodemgnt_exhibitmgnt_bulkaction_btn_remoefromauth')}
                  </FComponentsLib.FTextBtn>

                  <FComponentsLib.FTextBtn
                    disabled={nodeManagerPage.checkedExhibitIDs.length === 0}
                    type={'primary'}
                    onClick={async () => {
                      // if (storageHomePage.checkedObjectIDs.length === 0) {
                      //   return fCenterMessage({ message: '请选择要执行操作的对象' });
                      // }
                      // dispatch<OnBatchUpdateObjectsAction>({
                      //   type: 'storageHomePage/onBatchUpdateObjects',
                      // });

                      if (nodeManagerPage.checkedExhibitIDs.length === 0) {
                        return fCenterMessage({ message: '请选择要执行操作的对象' });
                      }

                      const result = await fPolicyBuilder({ targetType: 'resource' });
                      if (!result) {
                        return;
                      }

                      const { ret, errCode, msg, data }: {
                        ret: number;
                        errCode: number;
                        msg: string;
                        data: {
                          [resourceID: string]: {
                            data: any;
                            status: 1 | 2;
                          };
                        }
                      } = await FServiceAPI.Exhibit.batchUpdatePresentable({
                        presentableIds: nodeManagerPage.checkedExhibitIDs,
                        addPolicies: [{
                          policyName: result.title,
                          policyText: result.text,
                          status: 1,
                        }],
                      });

                      if (ret !== 0 || errCode !== 0) {
                        return fCenterMessage({ message: msg });
                      }

                      dispatch<ChangeAction>({
                        type: 'nodeManagerPage/change',
                        payload: {
                          exhibit_List: nodeManagerPage.exhibit_List
                            .map((rl) => {
                              // console.log(data[rl.id], 'data[rl.id] sdifjsd;lkfjlksdjflkjlsdkj');
                              if (data[rl.id] && data[rl.id].status === 1) {
                                return {
                                  ...rl,
                                  // ...(data[rl.id].data || {}),
                                  // policy: data[rl.id].data.policies
                                  //   .filter((l: any) => {
                                  //     return l.status === 1;
                                  //   })
                                  //   .map((l: any) => {
                                  //     return l.policyName;
                                  //   }),
                                  // status: data[rl.id].data.status,
                                  // isOnline: false,
                                  policies: [...rl.policies, result.title],
                                  hasPolicy: true,
                                };
                              }

                              // const failResource = data_failResources.find((fr) => {
                              //   return fr.resourceId === rl.id;
                              // });
                              // // console.log(failResource, 'failResource dsifjsldkfjlksdjflkjsdlkjflkjl');
                              // if (!!failResource) {
                              //   return {
                              //     ...rl,
                              //     policy: failResource.policies
                              //       .filter((l: any) => {
                              //         return l.status === 1;
                              //       })
                              //       .map((l: any) => l.policyName),
                              //     status: failResource.status,
                              //   };
                              // }
                              return rl;
                            }),
                        },
                      });

                      if (Object.values(data).every((d) => {
                        return d.status === 1;
                      })) {
                        fCenterMessage({ message: '策略添加成功' });
                        return;
                      }
                      // console.log(data);

                      dispatch<ChangeAction>({
                        type: 'nodeManagerPage/change',
                        payload: {
                          updateExhibitResultType: 'addPolicy',
                          updateExhibitResult: data,
                        },
                      });
                    }}
                  >
                    <FComponentsLib.FIcons.FPolicy style={{ fontSize: 14 }} />
                    &nbsp;{FI18n.i18nNext.t('nodemgnt_exhibitmgnt_bulkaction_btn_addauthplan')}
                  </FComponentsLib.FTextBtn>

                </div>
                <div style={{ height: 30 }} />
              </>)
            }
            <div className={styles.body}>
              <FTable
                rowClassName={styles.rowClassName}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
              />

              <FListFooter
                state={nodeManagerPage.exhibit_ListMore}
                onClickLoadMore={() => {
                  dispatch<OnLoadMore_ExhibitList_Action>({
                    type: 'nodeManagerPage/onLoadMore_ExhibitList',
                  });
                }}
              />
            </div>
          </>)
        }

      </FLeftSiderLayout>

      <ResultModal
        type={nodeManagerPage.updateExhibitResultType}
        dataSource={nodeManagerPage.updateExhibitResult}
        onClose={() => {
          dispatch<ChangeAction>({
            type: 'nodeManagerPage/change',
            payload: {
              updateExhibitResultType: '',
              updateExhibitResult: null,
            },
          });
        }}
      />
    </>
  );
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);

interface ResultModalProps {
  type: '' | 'online' | 'offline' | 'addPolicy';
  dataSource: {
    [k: string]: {
      data: string;
      status: 1 | 2;
    };
  } | null;

  onClose?(): void;
}

function ResultModal({ type, dataSource, onClose }: ResultModalProps) {

  const [$succeedCount, set$succeedCount, get$succeedCount] = FUtil.Hook.useGetState<number>(0);
  const [$failedList, set$failedList, get$failedList] = FUtil.Hook.useGetState<{
    cover: string;
    resourceID: string;
    resourceName: string;
    resourceTitle: string;
    resourceType: string;
    failedReason: string;
  }[]>([]);

  AHooks.useDebounceEffect(() => {
    handledData();
  }, [dataSource], {
    wait: 30,
  });

  async function handledData() {
    if (!dataSource) {
      set$succeedCount(0);
      set$failedList([]);
      return;
    }
    const succeedCount = Object.values(dataSource).filter((d) => {
      return d.status === 1;
    }).length;
    set$succeedCount(succeedCount);
    const failedExhibitIDs: string[] = Object.entries(dataSource)
      .filter((d) => {
        return d[1].status === 2;
      })
      .map((d) => {
        return d[0];
      });
    if (failedExhibitIDs.length > 0) {
      const { data }: {
        data: {
          presentableId: string;
          presentableTitle: string;
          presentableName: string;
          coverImages: string[];
          resourceInfo: {
            resourceType: string[];
          };
        }[];
      } = await FServiceAPI.Exhibit.presentableList({
        presentableIds: failedExhibitIDs.join(','),
      });
      // console.log(data, 'data sdifjalskdjflsdjlkfjlksdjlkj');

      set$failedList(data.map((d) => {
        return {
          // cover: d.coverImages[0],
          cover: d.coverImages[0] || '',
          resourceID: d.presentableId,
          resourceName: d.presentableName,
          resourceTitle: d.presentableTitle,
          resourceType: d.resourceInfo.resourceType.join('/'),
          failedReason: dataSource[d.presentableId].data,
        };
      }));
    }
  }

  return (<Modal
    open={type !== '' && !!dataSource}
    title={null}
    footer={null}
    centered={true}
    width={800}
    bodyStyle={{
      padding: '50px 60px 40px',
      borderRadius: 10,
    }}
    style={{
      borderRadius: 10,
      overflow: 'hidden',
    }}
    onCancel={() => {
      onClose && onClose();
    }}
  >
    {
      $succeedCount > 0 && (<div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        fontSize: 14,
        fontWeight: 600,
        color: '#42C28C',
      }}>
        {
          type === 'online' && (<>
            <FComponentsLib.FIcons.FUpcast
              style={{
                fontSize: 76,
                color: '#42C28C',
              }}
            />
            {/*<div>成功上架{$succeedCount}个资源</div>*/}
            <div>{FI18n.i18nNext.t('myresources_bulkaction_msg_availabletoauth_done', {
              Qty: $succeedCount,
            })}</div>
          </>)
        }

        {
          type === 'offline' && (<>
            <FComponentsLib.FIcons.FUpcast
              style={{
                fontSize: 76,
                color: '#42C28C',
                transform: 'rotate(180deg)',
              }}
            />
            <div>成功下架{$succeedCount}个展品</div>
          </>)
        }

        {
          type === 'addPolicy' && (<>
            <FComponentsLib.FIcons.FCheck
              style={{
                fontSize: 76,
                color: '#42C28C',
              }}
            />
            {/*<div>新授权策略已经添加至{$succeedCount}个资源</div>*/}
            <div>{FI18n.i18nNext.t('myresources_bulkaction_msg_addauthplan_done', {
              Qty: $succeedCount,
            })}</div>
          </>)
        }

      </div>)
    }


    {
      $failedList.length > 0 && (<>
        <div style={{ height: 50 }} />
        {
          type === 'online' && (<FComponentsLib.FContentText
            type={'negative'}
            // text={'以下资源上架失败：'}
            text={FI18n.i18nNext.t('myresources_bulkaction_msg_availabletoauth_failure')}
          />)
        }

        {
          type === 'offline' && (<FComponentsLib.FContentText type={'negative'} text={'以下展品下架失败：'} />)
        }

        {
          type === 'addPolicy' && (<FComponentsLib.FContentText
            type={'negative'}
            text={FI18n.i18nNext.t('myresources_bulkaction_msg_addauthplan_failure')}
          />)
        }

        <div style={{ height: 20 }} />
        <div
          style={{ maxHeight: 260, overflowY: 'auto', paddingRight: 10 }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 5,
              borderBottom: '1px solid #E5E7EB',
            }}>
            <FComponentsLib.FContentText type={'negative'} text={'展品'} />
            {
              type === 'online' && (<FComponentsLib.FContentText type={'negative'} text={'展品上架失败原因'} />)
            }

            {
              type === 'offline' && (<FComponentsLib.FContentText type={'negative'} text={'展品下架失败原因'} />)
            }

            {
              type === 'addPolicy' && (<FComponentsLib.FContentText type={'negative'} text={'添加策略失败原因'} />)
            }

          </div>
          {
            $failedList.map((v) => {
              return (<div
                key={v.resourceID}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 78,
                  borderBottom: '1px solid #E5E7EB',
                }}>
                <Space size={10}>
                  <FCoverImage
                    src={v.cover}
                    width={64}
                    style={{ borderRadius: 4 }}
                  />
                  <div>
                    <FComponentsLib.FContentText
                      type={'highlight'}
                      text={v.resourceTitle || v.resourceName.split('/')[1]}
                      singleRow
                      style={{ maxWidth: 400 }}
                    />
                    <div style={{ height: 10 }} />
                    <FComponentsLib.FContentText
                      type={'additional2'}
                      text={v.resourceType}
                      singleRow
                      style={{ maxWidth: 400 }}
                    />
                  </div>
                </Space>

                <FComponentsLib.FContentText
                  type={'additional2'}
                  text={v.failedReason}
                />
              </div>);
            })
          }
        </div>
      </>)
    }

    <div style={{ height: 40 }} />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FComponentsLib.FRectBtn
        onClick={() => {
          onClose && onClose();
        }}
      >{FI18n.i18nNext.t('myresources_bulkaction_btn_ok')}</FComponentsLib.FRectBtn>
    </div>

  </Modal>);
}
