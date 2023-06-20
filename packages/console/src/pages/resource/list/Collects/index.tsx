import * as React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCollectPageModelState } from '@/models/connect';
import { history } from 'umi';
// import FResourceCardsList from '@/pages/resource/components/FResourceCardsList';
import {
  OnMountAction,
  OnUnmountAction,
  OnChangeResourceTypeAction,
  OnChangeStatusAction,
  OnChangeKeywordsAction,
  OnBoomJuiceAction,
  OnClickLoadingMordAction,
} from '@/models/resourceCollectPage';
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
import FResourceCard from '@/components/FResourceCard';

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

  if (resourceCollectPage.totalNum === -1) {
    return (<FLoadingTip height={'calc(100vh - 140px)'} />);
  }

  if (resourceCollectPage.dataSource.length === 0
    && !resourceCollectPage.inputText
    && resourceCollectPage.resourceTypeCodes.values.length === 1 && resourceCollectPage.resourceTypeCodes.value === '#all'
    && resourceCollectPage.resourceStatus === '#') {
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
              if (!value) {
                return;
              }
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
                {/*{statusText}*/}
                {/*<DownOutlined style={{ marginLeft: 10 }} />*/}
                <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
              </span>
          </FComponentsLib.FDropdown>
        </div>
      </div>
      <Space size={20}>
        <FInput
          value={resourceCollectPage.inputText}
          debounce={300}
          allowClear={true}
          // onChange={(e) => onChangeInputText && onChangeInputText(e.target.value)}
          onDebounceChange={(value) => {
            // onChangeInputText && onChangeInputText(value);
            dispatch<OnChangeKeywordsAction>({
              type: 'resourceCollectPage/onChangeKeywords',
              payload: {
                value: value,
              },
            });
          }}
          theme='dark'
          className={styles.FInput}
          // placeholder={FI18n.i18nNext.t('search_resource')}
          placeholder={FI18n.i18nNext.t('myresourses_search_hint')}
        />
        {/* {showGotoCreateBtn && (
            <FComponentsLib.FRectBtn onClick={() => router.push(FUtil.LinkTo.resourceCreator())} type="primary">
              {FI18n.i18nNext.t('create_resource')}
            </FComponentsLib.FRectBtn>
          )} */}
      </Space>
    </div>

    {
      resourceCollectPage.dataSource.length > 0 ? (<>
        <div style={{ height: 40 }} />
        <div className={styles.Content}>
          {
            resourceCollectPage.dataSource.map((i, j) => {
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
      </>) : (<FNoDataTip
        height={'calc(100vh - 220px)'}
        tipText={'没有符合条件的资源'}
        btnText={'创建资源'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreator());
        }}
      />)
    }

    {
      resourceCollectPage.totalNum > resourceCollectPage.dataSource.length && (<>
        <div className={styles.bottom}>
          <Button
            className={styles.loadMore}
            onClick={() => {
              dispatch<OnClickLoadingMordAction>({
                type: 'resourceCollectPage/onClickLoadingMord',
              });
            }}
          >
            加载更多
          </Button>
        </div>
        <div style={{ height: 100 }} />
      </>)
    }
    <div style={{ height: 100 }} />
  </>);

  // return (<FResourceCardsList
  //   resourceTypeCodes={resource.resourceTypeCodes}
  //   resourceStatus={resource.resourceStatus}
  //   inputText={resource.inputText}
  //   dataSource={resource.dataSource}
  //   totalNum={resource.totalNum}
  //   onChangeResourceTypeCodes={(value) => {
  //     dispatch<OnChangeResourceTypeAction>({
  //       type: 'resourceCollectPage/onChangeResourceType',
  //       payload: {
  //         value: value,
  //       },
  //     });
  //   }}
  //   onChangeResourceStatus={(value) => {
  //     dispatch<OnChangeStatusAction>({
  //       type: 'resourceCollectPage/onChangeStatus',
  //       payload: {
  //         value: value,
  //       },
  //     });
  //   }}
  //   onChangeInputText={(value) => {
  //     dispatch<OnChangeKeywordsAction>({
  //       type: 'resourceCollectPage/onChangeKeywords',
  //       payload: {
  //         value: value,
  //       },
  //     });
  //   }}
  //   isCollect={true}
  //   onBoomJuice={(id) => {
  //     dispatch<OnBoomJuiceAction>({
  //       type: 'resourceCollectPage/onBoomJuice',
  //       payload: id.toString(),
  //     });
  //   }}
  //   onClickDetails={(id) => {
  //     window.open(FUtil.LinkTo.resourceDetails({
  //       resourceID: String(id),
  //     }));
  //   }}
  //   onClickMore={() => {
  //     dispatch<OnClickLoadingMordAction>({
  //       type: 'resourceCollectPage/onClickLoadingMord',
  //     });
  //   }}
  // />);
}

export default connect(({ resourceCollectPage }: ConnectState) => ({
  resourceCollectPage: resourceCollectPage,
}))(ResourceCollect);
