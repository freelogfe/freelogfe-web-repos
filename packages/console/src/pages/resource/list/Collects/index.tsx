import * as React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCollectPageModelState } from '@/models/connect';
import { history } from 'umi';
import {
  OnMountAction,
  OnUnmountAction,
  OnChangeResourceTypeAction,
  OnChangeStatusAction,
  OnChangeKeywordsAction,
  OnBoomJuiceAction,
  OnClickLoadingMordAction,
  OnAwaited_KeywordsChange_Action,
} from '@/models/resourceCollectPage';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import styles from './index.less';
import FResourceTypeFilter from '@/components/FResourceTypeFilter';
import FComponentsLib from '@freelog/components-lib';
import FMenu from '@/components/FMenu';
import { Space } from 'antd';
import FResourceCard from '@/components/FResourceCard';
import FListFooter from '@/components/FListFooter';

interface ResourceCollectProps {
  dispatch: Dispatch;
  resourceCollectPage: ResourceCollectPageModelState;
}

const resourceStatusOptions = [
  { text: FI18n.i18nNext.t('filter_resource_status_all'), value: '#' },
  // { text: '上架', value: 1 },
  { text: FI18n.i18nNext.t('filter_resource_status_availableforauth'), value: 1 },
  // { text: '下架', value: 4 },
  { text: FI18n.i18nNext.t('filter_resource_status_pendingauth'), value: 4 },
  // { text: '待发行', value: 0 },
  { text: FI18n.i18nNext.t('filter_resource_status_prepareforrelease'), value: 0 },
  // { text: '冻结', value: 2 },
  { text: FI18n.i18nNext.t('filter_resource_status_removedbyfreelog'), value: 2 },
];

function ResourceCollect({ dispatch, resourceCollectPage }: ResourceCollectProps) {

  AHooks.useMount(() => {
    dispatch<OnMountAction>({
      type: 'resourceCollectPage/onMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountAction>({
      type: 'resourceCollectPage/onUnmount',
    });
  });

  AHooks.useDebounceEffect(() => {
    dispatch<OnAwaited_KeywordsChange_Action>({
      type: 'resourceCollectPage/onAwaited_KeywordsChange',
    });
  }, [resourceCollectPage.inputText], {
    wait: 300,
  });

  if (resourceCollectPage.resource_ListState === 'loading') {
    return (<FLoadingTip height={'calc(100vh - 140px)'} />);
  }

  if (resourceCollectPage.resource_ListState === 'noData') {
    return (<FNoDataTip
      height={'calc(100vh - 140px)'}
      tipText={'未收藏任何资源'}
      btnText={'前往资源市场'}
      onClick={() => history.push(FUtil.LinkTo.market())}
    />);
  }

  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.filter}>
      <div className={styles.filterLeft}>
        <div>
          <span>{FI18n.i18nNext.t('resource_type')}：</span>

          <FResourceTypeFilter
            value={resourceCollectPage.resourceTypeCodes}
            onChange={(value) => {
              // if (!value) {
              //   return;
              // }
              // onChangeResourceTypeCodes && onChangeResourceTypeCodes(value);
              dispatch<OnChangeResourceTypeAction>({
                type: 'resourceCollectPage/onChangeResourceType',
                payload: {
                  value: value,
                },
              });
            }}
          />

        </div>
        <div style={{ marginLeft: 60 }}>
          <span>{FI18n.i18nNext.t('resource_state')}：</span>

          <FComponentsLib.FDropdown
            overlay={
              <FMenu
                options={resourceStatusOptions as any}
                onClick={(value) => {
                  // onChangeResourceStatus && onChangeResourceStatus(value === '#' ? value : Number(value) as 0)
                  dispatch<OnChangeStatusAction>({
                    type: 'resourceCollectPage/onChangeStatus',
                    payload: {
                      value: value === '#' ? value : Number(value) as 0,
                    },
                  });
                }}
              />
            }
          >
              <span style={{ cursor: 'pointer' }}>
                {resourceStatusOptions.find((rs) => {
                  return rs.value === resourceCollectPage.resourceStatus;
                })?.text}
                <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
              </span>
          </FComponentsLib.FDropdown>
        </div>
      </div>
      <Space size={20}>
        <FComponentsLib.FInput.FSearch
          value={resourceCollectPage.inputText}
          style={{ width: 400 }}
          // placeholder={FI18n.i18nNext.t('myresourses_search_hint')}
          placeholder={FI18n.i18nNext.t('resourcemngt_search_hint')}
          onChange={(value) => {
            dispatch<OnChangeKeywordsAction>({
              type: 'resourceCollectPage/onChangeKeywords',
              payload: {
                value: value,
              },
            });
          }}
        />
      </Space>
    </div>

    {
      resourceCollectPage.resource_ListState === 'noSearchResult' && (<FNoDataTip
        height={'calc(100vh - 220px)'}
        // tipText={'没有符合条件的资源'}
        // btnText={'创建资源'}
        // onClick={() => {
        //   self.open(FUtil.LinkTo.resourceCreator());
        // }}
        tipText={'未收藏任何资源'}
        btnText={'前往资源市场'}
        onClick={() => history.push(FUtil.LinkTo.market())}
      />)
    }

    {
      resourceCollectPage.resource_ListState === 'loaded' && (<>
        <div style={{ height: 40 }} />
        <div className={styles.Content}>
          {
            resourceCollectPage.resource_List.map((i, j) => {
              return (<FResourceCard
                  key={i.id}
                  resource={i}
                  type={'favorite'}
                  className={styles.FResourceCard}
                  onBoomJuice={() => {
                    dispatch<OnBoomJuiceAction>({
                      type: 'resourceCollectPage/onBoomJuice',
                      payload: i.id,
                    });
                  }}
                  onClickDetails={() => {
                    window.open(FUtil.LinkTo.resourceDetails({
                      resourceID: i.id,
                    }));
                  }}
                  // onClickEditing={() => onClickEditing && onClickEditing(i.id, i, j)}
                  // onClickRevision={() => onClickRevision && onClickRevision(i.id, i, j)}
                  // onClickMore={() => onClickMore && onClickMore(i.id, i, j)}
                />
              );
            })}
          <div className={styles.bottomPadding} />
          <div className={styles.bottomPadding} />
          <div className={styles.bottomPadding} />
          <div className={styles.bottomPadding} />
        </div>
        <div style={{ height: 100 }} />
        <FListFooter
          state={resourceCollectPage.resource_ListMore}
          onClickLoadMore={async () => {
            // await fetchResourceList(false);
            dispatch<OnClickLoadingMordAction>({
              type: 'resourceCollectPage/onClickLoadingMord',
            });
          }}
        />
      </>)
    }
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceCollectPage }: ConnectState) => ({
  resourceCollectPage: resourceCollectPage,
}))(ResourceCollect);
