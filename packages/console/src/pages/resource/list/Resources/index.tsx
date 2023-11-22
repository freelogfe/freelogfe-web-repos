import * as React from 'react';
import {
  ChangeAction,
  OnAwaited_KeywordsChange_Action, OnBatchUpdateAction,
  OnChangeKeywordsAction,
  OnChangeResourceTypeAction,
  OnChangeStatusAction,
  OnClickLoadingMordAction,
  OnMountAction,
  OnUnmountAction,
  ResourceListPageModelState,
} from '@/models/resourceListPage';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import styles from './index.less';
import FResourceTypeFilter from '@/components/FResourceTypeFilter';
import FComponentsLib from '@freelog/components-lib';
import FMenu from '@/components/FMenu';
import { Checkbox, Space } from 'antd';
import { history } from 'umi';
import FResourceCard from '@/components/FResourceCard';
import FListFooter from '@/components/FListFooter';
import FResourceCard_AbleCheck from '@/components/FResourceCard_AbleCheck';
import fPolicyBuilder from '@/components/fPolicyBuilder';

interface ResourceProps {
  dispatch: Dispatch;
  resourceListPage: ResourceListPageModelState;
}

function Resources({ dispatch, resourceListPage }: ResourceProps) {

  const [$resourceStatusOptions, set$resourceStatusOptions] = FUtil.Hook.useGetState([
    { text: FI18n.i18nNext.t('filter_resource_status_all'), value: '#' },
    // { text: '上架', value: 1 },
    { text: FI18n.i18nNext.t('filter_resource_status_availableforauth'), value: 1 },
    // { text: '下架', value: 4 },
    { text: FI18n.i18nNext.t('filter_resource_status_pendingauth'), value: 4 },
    // { text: '待发行', value: 0 },
    { text: FI18n.i18nNext.t('filter_resource_status_prepareforrelease'), value: 0 },
    // { text: '冻结', value: 2 },
    { text: FI18n.i18nNext.t('filter_resource_status_removedbyfreelog'), value: 2 },
  ]);

  AHooks.useMount(() => {
    dispatch<OnMountAction>({
      type: 'resourceListPage/onMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountAction>({
      type: 'resourceListPage/onUnmount',
    });
  });

  AHooks.useDebounceEffect(() => {
    dispatch<OnAwaited_KeywordsChange_Action>({
      type: 'resourceListPage/onAwaited_KeywordsChange',
    });
  }, [resourceListPage.inputText], {
    wait: 300,
  });

  AHooks.useDebounceEffect(() => {
    const allIDs: string[] = resourceListPage.resource_List.map((ol) => {
      return ol.id;
    });

    dispatch<ChangeAction>({
      type: 'resourceListPage/change',
      payload: {
        checkedResourceIDs: resourceListPage.checkedResourceIDs.filter((id) => {
          return allIDs.includes(id);
        }),
      },
    });

  }, [resourceListPage.resource_List], {
    wait: 30,
  });

  if (resourceListPage.resource_ListState === 'loading') {
    return <FLoadingTip height={'calc(100vh - 140px)'} />;
  }

  if (resourceListPage.resource_ListState === 'noData') {
    return (
      <FNoDataTip
        height={'calc(100vh - 140px)'}
        tipText={'未创建任何资源'}
        btnText={'创建资源'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreator());
        }}
      />
    );
  }

  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.filter}>
      <div className={styles.filterLeft}>
        <div>
          <span>{FI18n.i18nNext.t('resource_type')}：</span>
          <FResourceTypeFilter
            value={resourceListPage.resourceTypeCodes}
            onChange={(value) => {
              dispatch<OnChangeResourceTypeAction>({
                type: 'resourceListPage/onChangeResourceType',
                payload: {
                  value: value,
                },
              });
            }}
          />
        </div>
        <div style={{ width: 60 }} />
        <div>
          <span>{FI18n.i18nNext.t('resource_state')}：</span>

          <FComponentsLib.FDropdown
            // visible={true}
            overlay={
              <FMenu
                options={$resourceStatusOptions as any}
                onClick={(value) => {
                  // onChangeResourceStatus && onChangeResourceStatus(value === '#' ? value : Number(value) as 0)
                  dispatch<OnChangeStatusAction>({
                    type: 'resourceListPage/onChangeStatus',
                    payload: {
                      value: value === '#' ? value : Number(value) as 0,
                    },
                  });
                }}
              />
            }
          >
              <span style={{ cursor: 'pointer' }}>

                {$resourceStatusOptions.find((rs) => {
                  return rs.value === resourceListPage.resourceStatus;
                })?.text}
                <FComponentsLib.FIcons.FDown style={{ marginLeft: 10, fontSize: 12 }} />
              </span>
          </FComponentsLib.FDropdown>
        </div>
        {
          !resourceListPage.isBatchManagement && (<>
            <div style={{ width: 60 }} />
            <FComponentsLib.FTextBtn
              style={{ fontSize: 14 }}
              onClick={() => {
                dispatch<ChangeAction>({
                  type: 'resourceListPage/change',
                  payload: {
                    isBatchManagement: true,
                  },
                });
              }}
            >
              <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
              &nbsp;批量管理
            </FComponentsLib.FTextBtn>
          </>)
        }

      </div>
      <Space size={20}>
        <FComponentsLib.FInput.FSearch
          value={resourceListPage.inputText}
          style={{ width: 400 }}
          // placeholder={FI18n.i18nNext.t('myresourses_search_hint')}
          placeholder={FI18n.i18nNext.t('resourcemngt_search_hint')}
          onChange={(value) => {
            dispatch<OnChangeKeywordsAction>({
              type: 'resourceListPage/onChangeKeywords',
              payload: {
                value: value,
              },
            });
          }}
        />
      </Space>
    </div>

    {
      resourceListPage.resource_ListState === 'noSearchResult' && (<FNoDataTip
        height={'calc(100vh - 220px)'}
        tipText={'没有符合条件的资源'}
        btnText={'创建资源'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreator());
        }}
      />)
    }

    {
      resourceListPage.resource_ListState === 'loaded' && (<>
        <div style={{ height: 40 }} />

        {
          resourceListPage.isBatchManagement && (<>
            <div className={styles.batchHandle}>
              <div className={styles.batchHandleLeft}>
                <Checkbox
                  checked={resourceListPage.checkedResourceIDs.length === resourceListPage.resource_List.length}
                  indeterminate={resourceListPage.checkedResourceIDs.length !== 0 && resourceListPage.checkedResourceIDs.length !== resourceListPage.resource_List.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch<ChangeAction>({
                        type: 'resourceListPage/change',
                        payload: {
                          checkedResourceIDs: resourceListPage.resource_List.map((o) => {
                            return o.id;
                          }),
                        },
                      });
                    } else {
                      dispatch<ChangeAction>({
                        type: 'resourceListPage/change',
                        payload: {
                          checkedResourceIDs: [],
                        },
                      });
                    }
                  }}
                />
                <div style={{ width: 10 }} />
                <FComponentsLib.FContentText text={'全选'} type={'normal'} />
                <div style={{ width: 30 }} />
                <FComponentsLib.FContentText
                  text={`已选择${resourceListPage.checkedResourceIDs.length}个资源`}
                  type={'additional2'}
                  style={{ fontSize: 14 }}
                />
              </div>

              <div className={styles.batchHandleRight}>
                <FComponentsLib.FTextBtn
                  disabled={resourceListPage.checkedResourceIDs.length === 0}
                  type={'primary'}
                  onClick={() => {
                    dispatch<OnBatchUpdateAction>({
                      type: 'resourceListPage/onBatchUpdate',
                      payload: {
                        status: 1,
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FUpcast style={{ fontSize: 14 }} />
                  &nbsp;上架
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  disabled={resourceListPage.checkedResourceIDs.length === 0}
                  type={'primary'}
                  onClick={() => {
                    dispatch<OnBatchUpdateAction>({
                      type: 'resourceListPage/onBatchUpdate',
                      payload: {
                        status: 4,
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FUpcast style={{ fontSize: 14, transform: 'rotate(180deg)' }} />
                  &nbsp;下架
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  type={'primary'}
                  onClick={async () => {
                    const result = await fPolicyBuilder({ targetType: 'resource' });
                    if (!result) {
                      return;
                    }

                    dispatch<OnBatchUpdateAction>({
                      type: 'resourceListPage/onBatchUpdate',
                      payload: {
                        addPolicies: [{
                          policyName: result.title,
                          policyText: result.text,
                          status: 1,
                        }],
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FPolicy style={{ fontSize: 14 }} />
                  &nbsp;添加授权策略
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  type={'danger'}
                  onClick={() => {
                    dispatch<ChangeAction>({
                      type: 'resourceListPage/change',
                      payload: {
                        isBatchManagement: false,
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FExit style={{ fontSize: 14 }} />
                  &nbsp;退出批量管理
                </FComponentsLib.FTextBtn>
              </div>

            </div>

            <div style={{ height: 40 }} />
          </>)
        }

        <div className={styles.Content}>
          {
            !resourceListPage.isBatchManagement && (<div
              className={styles.createCard}
              onClick={() => history.push(FUtil.LinkTo.resourceCreator())}
            >
              <div className={styles.createButton}>
                <i className={['freelog', 'fl-icon-tianjia'].join(' ')} />
              </div>
              <span className={styles.createText}>创建资源</span>
            </div>)
          }

          {
            resourceListPage.resource_List.map((i, j) => {

              if (resourceListPage.isBatchManagement) {
                return (<FResourceCard_AbleCheck
                  checked={resourceListPage.checkedResourceIDs.includes(i.id)}
                  disabled={i.status === 2}
                  key={i.id}
                  cover={i.cover}
                  latestVersion={i.version}
                  resourceType={i.type.join('/')}
                  policies={i.policy}
                  status={i.status}
                  onChange={(value) => {
                    if (value) {
                      dispatch<ChangeAction>({
                        type: 'resourceListPage/change',
                        payload: {
                          checkedResourceIDs: [
                            ...resourceListPage.checkedResourceIDs,
                            i.id,
                          ],
                        },
                      });
                    } else {
                      dispatch<ChangeAction>({
                        type: 'resourceListPage/change',
                        payload: {
                          checkedResourceIDs: resourceListPage.checkedResourceIDs.filter((id) => {
                            return id !== i.id;
                          }),
                        },
                      });
                    }
                  }}
                />);
              }

              return (<FResourceCard
                  key={i.id}
                  resource={i}
                  type={'resource'}
                  className={styles.FResourceCard}
                  // onBoomJuice={() => onBoomJuice && onBoomJuice(i.id, i, j)}
                  onClickDetails={() => {
                    window.open(
                      FUtil.LinkTo.resourceDetails({
                        resourceID: i.id,
                      }),
                    );
                  }}
                  onClickEditing={() => {
                    window.open(
                      // FUtil.LinkTo.resourceInfo({
                      //   resourceID: i.id,
                      // }),
                      FUtil.LinkTo.resourceVersionInfo({
                        resourceID: i.id,
                        version: i.version || undefined,
                      }),
                    );
                  }}
                  onClickRevision={() => {
                    window.open(
                      FUtil.LinkTo.resourceVersionCreator({
                        resourceID: i.id,
                      }),
                    );
                  }}
                  // onClickMore={() => onClickMore && onClickMore(i.id, i, j)}
                />
              );
            })
          }
          <div className={styles.bottomPadding} />
          <div className={styles.bottomPadding} />
          <div className={styles.bottomPadding} />
          <div className={styles.bottomPadding} />
        </div>
        <div style={{ height: 100 }} />

        <FListFooter
          state={resourceListPage.resource_ListMore}
          onClickLoadMore={async () => {
            // await fetchResourceList(false);
            dispatch<OnClickLoadingMordAction>({
              type: 'resourceListPage/onClickLoadingMord',
            });
          }}
        />
      </>)
    }
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceListPage }: ConnectState) => ({
  resourceListPage: resourceListPage,
}))(Resources);
