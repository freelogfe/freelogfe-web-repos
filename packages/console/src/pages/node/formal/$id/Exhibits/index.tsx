import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import FInput from '@/components/FInput';
import { history } from 'umi';
import FMenu from '@/components/FMenu';
import { ColumnsType } from 'antd/lib/table/interface';
import {
  // ChangeAction,
  OnChange_Exhibit_InputFilter_Action,
  OnChange_Exhibit_SelectedStatus_Action,
  OnChange_Exhibit_SelectedType_Action,
  OnLoadMore_ExhibitList_Action,
  OnMount_ExhibitPage_Action, OnOnlineOrOfflineAction,
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
              <span><FComponentsLib.FTextBtn
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
              </FComponentsLib.FTextBtn></span>
            </FTooltip>

            <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
              <span><FComponentsLib.FTextBtn
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
                // if (value && record.policies.length === 0) {
                //   if (!record.hasPolicy) {
                //     fMessage(FI18n.i18nNext.t('alarm_exhibits_show_plan '), 'error');
                //   } else {
                //     fMessage(FI18n.i18nNext.t('msg_set_exhibits_avaliable_for_auth  '), 'error');
                //   }
                //   return;
                // }

                dispatch<OnOnlineOrOfflineAction>({
                  type: 'nodeManagerPage/onOnlineOrOffline',
                  payload: {
                    id: record.id,
                    onlineStatus: value ? 1 : 0,
                  },
                });
              }}
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
                      options={nodeManagerPage.exhibit_ResourceTypeOptions1}
                      value={nodeManagerPage.exhibit_SelectedType1}
                      onClick={(value) => {
                        dispatch<OnChange_Exhibit_SelectedType_Action>({
                          type: 'nodeManagerPage/onChange_Exhibit_SelectedType',
                          payload: {
                            value: value,
                            level: 1,
                          },
                        });
                      }}
                    />
                  }
                >
                  <span style={{ cursor: 'pointer' }}>
                    {/*{categoryData.first[category.first] || '全部'}*/}
                    {nodeManagerPage.exhibit_ResourceTypeOptions1.find((rt) => {
                      return rt.value === nodeManagerPage.exhibit_SelectedType1;
                    })?.text || '全部'}
                    <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
                  </span>
                </FComponentsLib.FDropdown>

                {nodeManagerPage.exhibit_ResourceTypeOptions2.length > 0 ? (
                  <>
                    <span className='ml-30'>子类型：</span>
                    <FComponentsLib.FDropdown
                      overlay={
                        <FMenu
                          value={nodeManagerPage.exhibit_SelectedType2}
                          options={nodeManagerPage.exhibit_ResourceTypeOptions2}
                          onClick={(value) => {
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
                        {nodeManagerPage.exhibit_ResourceTypeOptions2.find((rt) => {
                          return rt.value === nodeManagerPage.exhibit_SelectedType2;
                        })?.text || '全部'}
                        <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
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
                    <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
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
                  placeholder={FI18n.i18nNext.t('nodemgmt_search_exhibits_hint')}
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

      </FLeftSiderLayout>
    </>
  );
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
