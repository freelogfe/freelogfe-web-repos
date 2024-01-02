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
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import styles from './index.less';
import FResourceTypeFilter from '@/components/FResourceTypeFilter';
import FComponentsLib from '@freelog/components-lib';
import FMenu from '@/components/FMenu';
import { Checkbox, Modal, Space } from 'antd';
// import { history } from 'umi';
import FResourceCard from '@/components/FResourceCard';
import FListFooter from '@/components/FListFooter';
import FResourceCard_AbleCheck from '@/components/FResourceCard_AbleCheck';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import FResourceFeedback from '@/components/FResourceFeedback';
import FCoverImage from '@/components/FCoverImage';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

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
    const allIDs: string[] = resourceListPage.resource_List
      .filter((ol) => {
        return ol.status !== 2;
      })
      .map((ol) => {
        return ol.id;
      });
    // console.log('allIDs sdifjlsdkjflksdjflkjlkj');
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
          self.open(FUtil.LinkTo.resourceCreatorEntry());
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
              &nbsp;{FI18n.i18nNext.t('myresources_btn_bulkaction')}
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
          self.open(FUtil.LinkTo.resourceCreatorEntry());
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
                  checked={resourceListPage.checkedResourceIDs.length !== 0 && resourceListPage.checkedResourceIDs.length === resourceListPage.resource_List.filter((r) => {
                    return r.status !== 2;
                  }).length}
                  indeterminate={resourceListPage.checkedResourceIDs.length !== 0
                  && resourceListPage.checkedResourceIDs.length !== resourceListPage.resource_List.filter((r) => {
                    return r.status !== 2;
                  }).length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch<ChangeAction>({
                        type: 'resourceListPage/change',
                        payload: {
                          checkedResourceIDs: resourceListPage.resource_List
                            .filter((o) => {
                              return o.status !== 2;
                            })
                            .map((o) => {
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
                <FComponentsLib.FContentText
                  text={FI18n.i18nNext.t('myresources_bulkaction_checkbox_selectall')}
                  type={'normal'}
                />
                <div style={{ width: 30 }} />
                <FComponentsLib.FContentText
                  // text={`已选择${resourceListPage.checkedResourceIDs.length}个资源`}
                  text={FI18n.i18nNext.t('myresources_bulkaction_label_selectedqty', {
                    Qty: resourceListPage.checkedResourceIDs.length,
                  })}
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
                  &nbsp;{FI18n.i18nNext.t('myresources_bulkaction_btn_availabletoauth')}
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  disabled={resourceListPage.checkedResourceIDs.length === 0}
                  type={'primary'}
                  onClick={async () => {

                    const bool: boolean = await fPromiseModalConfirm({
                      title: FI18n.i18nNext.t('remove_resource_from_auth_confirmation_title'),
                      description: FI18n.i18nNext.t('confirm_msg_remove_resource_from_auth'),
                      okText: FI18n.i18nNext.t('remove_resource_from_auth_btn_remve'),
                      promptKey_localStorage: FI18n.i18nNext.t('remove_resource_from_auth_confirmation_title') || '',
                    });

                    if (bool) {
                      dispatch<OnBatchUpdateAction>({
                        type: 'resourceListPage/onBatchUpdate',
                        payload: {
                          status: 4,
                        },
                      });
                    }

                  }}
                >
                  <FComponentsLib.FIcons.FUpcast style={{ fontSize: 14, transform: 'rotate(180deg)' }} />
                  &nbsp;{FI18n.i18nNext.t('myresources_bulkaction_removefromauth')}
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  type={'primary'}
                  disabled={resourceListPage.checkedResourceIDs.length === 0}
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
                  &nbsp;{FI18n.i18nNext.t('myresources_bulkaction_btn_addauthplan')}
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  type={'danger'}
                  onClick={() => {
                    dispatch<ChangeAction>({
                      type: 'resourceListPage/change',
                      payload: {
                        isBatchManagement: false,
                        checkedResourceIDs: [],
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FExit style={{ fontSize: 14 }} />
                  &nbsp;{FI18n.i18nNext.t('myresources_bulkaction_btn_quit')}
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
              onClick={() => {
                self.open(FUtil.LinkTo.resourceCreatorEntry());
              }}
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
                  title={i.title || i.name.split('/')[1]}
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
                    self.open(
                      FUtil.LinkTo.resourceDetails({
                        resourceID: i.id,
                      }),
                    );
                  }}
                  onClickEditing={() => {
                    self.open(
                      FUtil.LinkTo.resourceVersionInfo({
                        resourceID: i.id,
                        version: i.version || undefined,
                      }),
                    );
                  }}
                  onClickRevision={() => {
                    self.open(
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
    <FResourceFeedback show={''} />

    <ResultModal
      type={resourceListPage.updateResourceResultType}
      dataSource={resourceListPage.updateResourceResult}
      onClose={() => {
        // set$batchUpdateFailedList(null);
        dispatch<ChangeAction>({
          type: 'resourceListPage/change',
          payload: {
            updateResourceResultType: '',
            updateResourceResult: null,
          },
        });
      }}
    />
  </>);
}

export default connect(({ resourceListPage }: ConnectState) => ({
  resourceListPage: resourceListPage,
}))(Resources);

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
    const failedResourceIDs: string[] = Object.entries(dataSource)
      .filter((d) => {
        return d[1].status === 2;
      })
      .map((d) => {
        return d[0];
      });
    if (failedResourceIDs.length > 0) {
      const { data } = await FServiceAPI.Resource.batchInfo({
        resourceIds: failedResourceIDs.join(','),
      });
      // console.log(data, 'data sdifjalskdjflsdjlkfjlksdjlkj');

      set$failedList(data.map((d) => {
        return {
          cover: d.coverImages[0],
          resourceID: d.resourceId,
          resourceName: d.resourceName,
          resourceTitle: d.resourceTitle,
          resourceType: d.resourceType.join('/'),
          failedReason: dataSource[d.resourceId].data,
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
            <div>成功下架{$succeedCount}个资源</div>
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
          type === 'offline' && (<FComponentsLib.FContentText type={'negative'} text={'以下资源下架失败：'} />)
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
            <FComponentsLib.FContentText type={'negative'} text={'资源'} />
            {
              type === 'online' && (<FComponentsLib.FContentText type={'negative'} text={'资源上架失败原因'} />)
            }

            {
              type === 'offline' && (<FComponentsLib.FContentText type={'negative'} text={'资源下架失败原因'} />)
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
