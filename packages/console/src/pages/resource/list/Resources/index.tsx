import * as React from 'react';
import {
  OnAwaited_KeywordsChange_Action,
  OnChangeKeywordsAction,
  OnChangeResourceTypeAction,
  OnChangeStatusAction,
  OnClickLoadingMordAction,
  OnMountAction,
  OnUnmountAction,
  ResourceListPageModelState,
} from '@/models/resourceListPage';
// import { history } from 'umi';
// import FResourceCardsList from '@/pages/resource/components/FResourceCardsList';
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
import { Button, Space } from 'antd';
import FInput from '@/components/FInput';
import { history } from 'umi';
import FResourceCard from '@/components/FResourceCard';
import FListFooter from '@/components/FListFooter';

interface ResourceProps {
  dispatch: Dispatch;
  resourceListPage: ResourceListPageModelState;
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

function Resources({ dispatch, resourceListPage }: ResourceProps) {

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

  if (resourceListPage.resource_ListState === 'loading') {
    return <FLoadingTip height={'calc(100vh - 140px)'} />;
  }

  // if (
  //   resourceListPage.dataSource.length === 0 &&
  //   resourceListPage.inputText === '' &&
  //   resourceListPage.resourceTypeCodes.values.length === 1 && resourceListPage.resourceTypeCodes.value === '#all' &&
  //   resourceListPage.resourceStatus === '#'
  // ) {
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
              if (!value) {
                return;
              }
              // onChangeResourceTypeCodes && onChangeResourceTypeCodes(value);
              dispatch<OnChangeResourceTypeAction>({
                type: 'resourceListPage/onChangeResourceType',
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

                {resourceStatusOptions.find((rs) => {
                  return rs.value === resourceListPage.resourceStatus;
                })?.text}
                {/*{statusText}*/}
                {/*<DownOutlined style={{ marginLeft: 10 }} />*/}
                <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
              </span>
          </FComponentsLib.FDropdown>
        </div>
      </div>
      <Space size={20}>
        {/*<FInput*/}
        {/*  value={resourceListPage.inputText}*/}
        {/*  debounce={300}*/}
        {/*  allowClear={true}*/}
        {/*  // onChange={(e) => onChangeInputText && onChangeInputText(e.target.value)}*/}
        {/*  onDebounceChange={(value) => {*/}
        {/*    // onChangeInputText && onChangeInputText(value);*/}
        {/*    dispatch<OnChangeKeywordsAction>({*/}
        {/*      type: 'resourceListPage/onChangeKeywords',*/}
        {/*      payload: {*/}
        {/*        value: value,*/}
        {/*      },*/}
        {/*    });*/}
        {/*  }}*/}
        {/*  theme='dark'*/}
        {/*  className={styles.FInput}*/}
        {/*  // placeholder={FI18n.i18nNext.t('search_resource')}*/}
        {/*  placeholder={FI18n.i18nNext.t('myresourses_search_hint')}*/}
        {/*/>*/}

        <FComponentsLib.FInput.FSearch
          value={resourceListPage.inputText}
          style={{ width: 400 }}
          placeholder={FI18n.i18nNext.t('myresourses_search_hint')}
          onChange={(e) => {
            dispatch<OnChangeKeywordsAction>({
              type: 'resourceListPage/onChangeKeywords',
              payload: {
                value: e.target.value,
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
        <div className={styles.Content}>
          <div
            className={'flex-column-center mb-20 m-10 ' + styles.createCard}
            onClick={() => history.push(FUtil.LinkTo.resourceCreator())}
          >
            <div className={'flex-column-center ' + styles.createButton}>
              <i className={['freelog', 'fl-icon-tianjia'].join(' ')} />
            </div>
            <span className={'mt-20 ' + styles.createText}>创建资源</span>
          </div>
          {
            resourceListPage.resource_List.map((i, j) => {
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
                      FUtil.LinkTo.resourceInfo({
                        resourceID: i.id,
                      }),
                    );
                  }}
                  onClickRevision={() => {
                    window.open(
                      FUtil.LinkTo.resourceCreateVersion({
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
      </>)
    }

    {/*{*/}
    {/*  resourceListPage.totalNum > resourceListPage.resource_List.length && (<>*/}
    {/*    <div className={styles.bottom}>*/}
    {/*      <Button*/}
    {/*        className={styles.loadMore}*/}
    {/*        onClick={() => {*/}
    {/*          dispatch<OnClickLoadingMordAction>({*/}
    {/*            type: 'resourceListPage/onClickLoadingMord',*/}
    {/*          });*/}
    {/*        }}*/}
    {/*      >*/}
    {/*        加载更多*/}
    {/*      </Button>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 100 }} />*/}
    {/*  </>)*/}
    {/*}*/}

    <FListFooter
      state={resourceListPage.resource_ListMore}
      onClickLoadMore={async () => {
        // await fetchResourceList(false);
        dispatch<OnClickLoadingMordAction>({
          type: 'resourceListPage/onClickLoadingMord',
        });
      }}
    />
    <div style={{ height: 100 }} />
  </>);

  // return (
  //   <FResourceCardsList
  //     resourceTypeCodes={resource.resourceTypeCodes}
  //     resourceStatus={resource.resourceStatus}
  //     inputText={resource.inputText}
  //     dataSource={resource.dataSource}
  //     totalNum={resource.totalNum}
  //     onChangeResourceTypeCodes={(value) => {
  //       dispatch<OnChangeResourceTypeAction>({
  //         type: 'resourceListPage/onChangeResourceType',
  //         payload: {
  //           value: value,
  //         },
  //       });
  //     }}
  //     onChangeResourceStatus={(value) => {
  //       dispatch<OnChangeStatusAction>({
  //         type: 'resourceListPage/onChangeStatus',
  //         payload: {
  //           value: value,
  //         },
  //       });
  //     }}
  //     onChangeInputText={(value) => {
  //       dispatch<OnChangeKeywordsAction>({
  //         type: 'resourceListPage/onChangeKeywords',
  //         payload: {
  //           value: value,
  //         },
  //       });
  //     }}
  //     showGotoCreateBtn={true}
  //     onClickDetails={(id) => {
  //       // router.push(FUtil.LinkTo.resourceDetails({
  //       //   resourceID: String(id),
  //       // }));
  //       window.open(
  //         FUtil.LinkTo.resourceDetails({
  //           resourceID: String(id),
  //         }),
  //       );
  //     }}
  //     onClickEditing={(id) => {
  //       window.open(
  //         FUtil.LinkTo.resourceInfo({
  //           resourceID: String(id),
  //         }),
  //       );
  //     }}
  //     onClickRevision={(id, record) => {
  //       window.open(
  //         FUtil.LinkTo.resourceCreateVersion({
  //           resourceID: String(id),
  //         }),
  //       );
  //     }}
  //     // onClickMore={(id) => router.push(`/resource/${id}`)}
  //     onloadMore={() => {
  //       dispatch<OnClickLoadingMordAction>({
  //         type: 'resourceListPage/onClickLoadingMord',
  //       });
  //     }}
  //   />
  // );
}

export default connect(({ resourceListPage }: ConnectState) => ({
  resourceListPage: resourceListPage,
}))(Resources);
