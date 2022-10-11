import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { Checkbox, Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import FInput from '@/components/FInput';
import { history } from 'umi';
import FMenu from '@/components/FMenu';
import { ColumnsType } from 'antd/lib/table/interface';
import {
  ChangeAction,
  OnChange_Exhibit_InputFilter_Action,
  OnChange_Exhibit_SelectedStatus_Action,
  OnChange_Exhibit_SelectedType_Action,
  OnLoadMore_ExhibitList_Action,
  OnMount_ExhibitPage_Action,
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
import fMessage from '@/components/fMessage';
import FComponentsLib from '@freelog/components-lib';
import { FDialog } from '@/components/FDialog';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import { FPolicyOperaterDrawer } from '@/components/FPolicyOperaterDrawer';
import { LoadingOutlined } from '@ant-design/icons';

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Exhibits({ dispatch, nodeManagerPage }: ExhibitsProps) {

  let [operateExhibit, setOperateExhibit] = React.useState<any>(null);
  const [activeDialogShow, setActiveDialogShow] = React.useState(false);
  const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  const [resultPopupType, setResultPopupType] = React.useState<null | 0 | 1>(null);
  const [loading, setLoading] = React.useState(false);
  const [noLonger, setNoLonger] = React.useState(false);

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

  /** 上下架 */
  const changeStatus = (value: boolean, exhibit: any) => {
    operateExhibit = exhibit;
    setOperateExhibit(exhibit);

    if (value) {
      // 上架
      const { policiesList } = exhibit;
      if (policiesList.length === 0) {
        setActiveDialogShow(true);
      } else if (
        policiesList.filter((item: { status: number }) => item.status === 1).length === 0
      ) {
        exhibit.policiesList.forEach((item: any) => {
          item.checked = false;
        });
        dispatch<ChangeAction>({
          type: 'nodeManagerPage/change',
          payload: {
            policyOperaterVisible: true,
          },
        });
      } else {
        const data = { onlineStatus: 1 };
        upOrDownExhibit(data);
      }
    } else {
      // 下架
      const resourceNoTip = localStorage.getItem('exhibitNoTip') || false;
      if (resourceNoTip) {
        inactiveResource();
      } else {
        setNoLonger(false);
        setInactiveDialogShow(true);
      }
    }
  };

  /** 打开添加策略弹窗 */
  const openPolicyBuilder = () => {
    dispatch<ChangeAction>({
      type: 'nodeManagerPage/change',
      payload: {
        policyEditorVisible: true,
      },
    });
    setActiveDialogShow(false);
  };

  /** 上架 */
  const activeResource = () => {
    const updatePolicies = operateExhibit.policiesList
      .filter((item: { checked: boolean }) => item.checked)
      .map((item: { policyId: string }) => {
        return { policyId: item.policyId, status: 1 };
      });
    const data = { onlineStatus: 1, updatePolicies };
    upOrDownExhibit(data);
  };

  /** 下架 */
  const inactiveResource = () => {
    if (inactiveDialogShow && noLonger) localStorage.setItem('exhibitNoTip', 'true');

    const data = { onlineStatus: 0 };
    upOrDownExhibit(data);
  };

  /** 资源上下架 */
  const upOrDownExhibit = async (data: any) => {
    setActiveDialogShow(false);
    setInactiveDialogShow(false);
    setLoading(true);
    setResultPopupType(data.onlineStatus);

    const result = await FUtil.Request({
      method: 'PUT',
      url: `/v2/presentables/${operateExhibit.id}/onlineStatus`,
      data,
    });
    if (result.errCode === 0) {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setResultPopupType(null);
        }, 1000);
      }, 1000);

      const index = nodeManagerPage.exhibit_List.findIndex((item) => item.id === operateExhibit.id);
      nodeManagerPage.exhibit_List[index].isOnline = data.onlineStatus === 1;
      if (data.updatePolicies) {
        dispatch<ChangeAction>({
          type: 'nodeManagerPage/change',
          payload: {
            policyOperaterVisible: false,
          },
        });
        data.updatePolicies.forEach((item: any) => {
          const i = nodeManagerPage.exhibit_List[index].policiesList.findIndex(
            (policy) => policy.policyId === item.policyId,
          );
          nodeManagerPage.exhibit_List[index].policiesList[i].status = 1;
        });
        nodeManagerPage.exhibit_List[index].policies = nodeManagerPage.exhibit_List[
          index
          ].policiesList
          .filter((item) => item.status === 1)
          .map((item: { policyName: any }) => item.policyName);
      }

      dispatch<ChangeAction>({
        type: 'nodeManagerPage/change',
        payload: {
          exhibit_List: nodeManagerPage.exhibit_List,
        },
      });
    } else {
      fMessage(result.msg, 'error');
      setLoading(false);
      setResultPopupType(null);
    }
  };

  /** 添加授权策略 */
  const addPolicy = async (title: string, text: string) => {
    const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
      presentableId: operateExhibit.id,
      addPolicies: [
        {
          policyName: title,
          policyText: text,
          status: operateExhibit.status,
        },
      ],
    };
    const result = await FServiceAPI.Exhibit.updatePresentable(params);
    if (result.errCode !== 0) {
      fMessage(result.msg, 'error');
      return;
    }

    const info = await FUtil.Request({
      method: 'GET',
      url: `/v2/presentables/${operateExhibit.id}`,
      params: { isLoadPolicyInfo: 1, isTranslate: 1 },
    });
    const { policies } = info.data;
    const index = nodeManagerPage.exhibit_List.findIndex((item) => item.id === operateExhibit.id);
    nodeManagerPage.exhibit_List[index].policies = policies
      .filter((item: any) => item.status === 1)
      .map((item: any) => item.policyName);
    nodeManagerPage.exhibit_List[index].policiesList = policies.reverse();
    setOperateExhibit(nodeManagerPage.exhibit_List[index]);
    dispatch<ChangeAction>({
      type: 'nodeManagerPage/change',
      payload: {
        exhibit_List: nodeManagerPage.exhibit_List,
        policyEditorVisible: false,
      },
    });
  };

  const dataSource: NodeManagerModelState['exhibit_List'] = nodeManagerPage.exhibit_List.map(
    (i) => ({
      key: i.id,
      ...i,
    }),
  );
  // console.log(exhibit_ListTotal, 'exhibit_ListTotal3092oiklsdf')
  const columns: ColumnsType<NonNullable<NodeManagerModelState['exhibit_List']>[number]> = [
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
              <FComponentsLib.FContentText singleRow text={record.resourceName} />
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
                  <FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />
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
              <FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  window.open(
                    FUtil.LinkTo.exhibitManagement({
                      exhibitID: record.id,
                    }),
                  );
                }}
              >
                <FComponentsLib.FIcons.FEdit />
              </FComponentsLib.FTextBtn>
            </FTooltip>

            <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
              <FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  window.open(
                    FUtil.LinkTo.resourceDetails({
                      resourceID: record.resourceId,
                    }),
                  );
                }}
              >
                <FComponentsLib.FIcons.FFileSearch />
              </FComponentsLib.FTextBtn>
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
              loading={loading && operateExhibit.id === record.id}
              onClick={(checked) => changeStatus(checked, record)}
              // onChange={(value) => {
              //   if (value && record.policies.length === 0) {
              //     if (!record.hasPolicy) {
              //       fMessage(FI18n.i18nNext.t('alarm_exhibits_show_plan '), 'error');
              //     } else {
              //       fMessage(FI18n.i18nNext.t('msg_set_exhibits_avaliable_for_auth  '), 'error');
              //     }
              //     return;
              //   }
              //   dispatch<OnOnlineOrOfflineAction>({
              //     type: 'nodeManagerPage/onOnlineOrOffline',
              //     payload: {
              //       id: record.id,
              //       onlineStatus: value ? 1 : 0,
              //     },
              //   });
              // }}
            />
            {!record.isAuth && (
              <FTooltip title={record.authErrorText}>
                <FComponentsLib.FIcons.FWarning />
              </FTooltip>
            )}
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
        header={
          <div className={styles.header}>
            <FComponentsLib.FTitleText type='h1' text={`展品管理 (${nodeManagerPage.exhibit_ListTotal})`} />
            <Space size={80}>
              <div>
                <span>{FI18n.i18nNext.t('resource_type')}：</span>
                <FComponentsLib.FDropdown
                  overlay={
                    <FMenu
                      // options={[
                      //   {
                      //     value: '-1',
                      //     text: '全部',
                      //   },
                      //   ...categoryData.first.map((i, index) => {
                      //     return {
                      //       value: index + '',
                      //       text: i,
                      //     };
                      //   }),
                      // ]}
                      options={nodeManagerPage.exhibit_ResourceTypeOptions1}
                      // value={category.first}
                      value={nodeManagerPage.exhibit_SelectedType1}
                      onClick={(value) => {
                        // setCategory({
                        //   ...category,
                        //   first: value,
                        //   second: category.first === value ? category.second : '-1',
                        // });
                        dispatch<OnChange_Exhibit_SelectedType_Action>({
                          type: 'nodeManagerPage/onChange_Exhibit_SelectedType',
                          payload: {
                            value: value,
                            level: 1,
                          },
                        });
                        //onChangeResourceType && onChangeResourceType(value)
                      }}
                    />
                  }
                >
                  <span style={{ cursor: 'pointer' }}>
                    {/*{categoryData.first[category.first] || '全部'}*/}
                    {nodeManagerPage.exhibit_ResourceTypeOptions1.find((rt) => {
                      return rt.value === nodeManagerPage.exhibit_SelectedType1;
                    })?.text || '全部'}
                    <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 14 }} />
                  </span>
                </FComponentsLib.FDropdown>

                {nodeManagerPage.exhibit_ResourceTypeOptions2.length > 0 ? (
                  <>
                    <span className='ml-30'>子类型：</span>
                    <FComponentsLib.FDropdown
                      overlay={
                        <FMenu
                          value={nodeManagerPage.exhibit_SelectedType2}
                          // @ts-ignore
                          // options={[
                          //   {
                          //     value: '-1',
                          //     text: '全部',
                          //   },
                          //   // @ts-ignore
                          //   ...categoryData.second[category.first].map((i, index) => {
                          //     return {
                          //       value: index + '',
                          //       text: i,
                          //     };
                          //   }),
                          // ]}
                          options={nodeManagerPage.exhibit_ResourceTypeOptions2}
                          onClick={(value) => {
                            // setCategory({
                            //   ...category,
                            //   second: value,
                            // });
                            dispatch<OnChange_Exhibit_SelectedType_Action>({
                              type: 'nodeManagerPage/onChange_Exhibit_SelectedType',
                              payload: {
                                value: value,
                                level: 2,
                              },
                            });
                            // onChangeResourceType && onChangeResourceType(value)
                          }}
                        />
                      }
                    >
                      <span style={{ cursor: 'pointer' }}>
                        {/*{*/}
                        {/*  // @ts-ignore*/}
                        {/*  categoryData.second[category.first][category.second] || '全部'*/}
                        {/*}*/}
                        {nodeManagerPage.exhibit_ResourceTypeOptions2.find((rt) => {
                          return rt.value === nodeManagerPage.exhibit_SelectedType2;
                        })?.text || '全部'}
                        <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 14 }} />
                      </span>
                    </FComponentsLib.FDropdown>
                  </>
                ) : null}
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
                    <FComponentsLib.FIcons.FDown style={{ marginLeft: 10, fontSize: 14 }} />
                  </span>
                </FDropdownMenu>
              </div>
              <div>
                <FInput
                  className={styles.input}
                  theme='dark'
                  value={nodeManagerPage.exhibit_InputFilter}
                  debounce={300}
                  onDebounceChange={(value) => {
                    dispatch<OnChange_Exhibit_InputFilter_Action>({
                      type: 'nodeManagerPage/onChange_Exhibit_InputFilter',
                      payload: {
                        value: value,
                      },
                    });
                  }}
                />
              </div>
            </Space>
          </div>
        }
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

        {nodeManagerPage.exhibit_ListState === 'loading' && (
          <FLoadingTip height={'calc(100vh - 270px)'} />
        )}

        {nodeManagerPage.exhibit_ListState === 'noSearchResult' && (
          <FNoDataTip height={'calc(100vh - 270px)'} tipText={'无搜索结果'} />
        )}

        {nodeManagerPage.exhibit_ListState === 'loaded' && (
          <div className={styles.body}>
            <FTable
              rowClassName={styles.rowClassName}
              columns={columns}
              dataSource={dataSource as any}
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
        )}

        <FDialog
          show={activeDialogShow}
          title='提醒'
          desc='请先为资源添加一个授权策略，再进行上架操作'
          sureText='添加策略'
          cancel={() => {
            setActiveDialogShow(false);
          }}
          sure={openPolicyBuilder}
          loading={loading}
        />

        <FDialog
          show={inactiveDialogShow}
          title='提醒'
          desc='下架后其它用户将无法签约该资源，确认要下架吗？'
          sureText='下架资源'
          cancel={() => {
            setInactiveDialogShow(false);
          }}
          sure={inactiveResource}
          loading={loading}
          footer={
            <Checkbox
              className={styles['no-longer']}
              checked={noLonger}
              onChange={(e) => setNoLonger(e.target.checked)}
            >
              不再提醒
            </Checkbox>
          }
        />

        <FPolicyBuilderDrawer
          visible={nodeManagerPage.policyEditorVisible}
          alreadyUsedTexts={operateExhibit?.policiesList.map((ip: any) => {
            return ip.policyText;
          })}
          alreadyUsedTitles={operateExhibit?.policiesList.map((ip: any) => {
            return ip.policyName;
          })}
          targetType='resource'
          onCancel={() => {
            dispatch<ChangeAction>({
              type: 'nodeManagerPage/change',
              payload: {
                policyEditorVisible: false,
              },
            });
          }}
          onConfirm={({ title, text }) => addPolicy(title, text)}
        />

        <FPolicyOperaterDrawer
          visible={nodeManagerPage.policyOperaterVisible}
          type='resource'
          policiesList={operateExhibit?.policiesList || []}
          onCancel={() => {
            dispatch<ChangeAction>({
              type: 'nodeManagerPage/change',
              payload: {
                policyOperaterVisible: false,
              },
            });
          }}
          onConfirm={activeResource}
          onNewPolicy={openPolicyBuilder}
        />

        {resultPopupType !== null && (
          <div className={styles['result-modal']}>
            <div className={styles['result-popup']}>
              {loading ? (
                <div className={styles['loader']}>
                  <LoadingOutlined className={styles['loader-icon']} />
                  <div className={styles['loader-text']}>
                    正在{resultPopupType === 1 ? '上架' : '下架'}
                  </div>
                </div>
              ) : (
                <div className={styles['result']}>
                  <i
                    className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                      styles[resultPopupType === 1 ? 'up' : 'down']
                    }`}
                  />
                  <div className={styles['result-text']}>
                    已{resultPopupType === 1 ? '上架' : '下架'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </FLeftSiderLayout>
    </>
  );
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
