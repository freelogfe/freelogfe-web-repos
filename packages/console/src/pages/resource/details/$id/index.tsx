import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import Sign from './Sign';
import Description from './Description';
import Property from './Property';
import Option from './Option';
import Viewport from './Viewport';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import {
  OnClickCollectionAction,
  OnMountPageAction,
  OnChangeVersionAction,
  OnUnmountPageAction,
} from '@/models/resourceDetailPage';
import FDropdownMenu from '@/components/FDropdownMenu';
import { Space } from 'antd';
import SignPage from './SignPage';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import { history } from 'umi';
import { FUtil } from '@freelog/tools-lib';
import { Helmet } from 'react-helmet';
import FResultTip from '@/components/FResultTip';
import FLoadingTip from '@/components/FLoadingTip';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import { FShare } from '@/components/FShare';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';

interface ResourceDetailsProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function ResourceDetails({ match, dispatch, resourceDetailPage }: ResourceDetailsProps) {
  const [state] = useUrlState<{ version: string }>();

  AHooks.useMount(async () => {
    dispatch<OnMountPageAction>({
      type: 'resourceDetailPage/onMountPage',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'resourceDetailPage/onUnmountPage',
    });
  });

  React.useEffect(() => {
    dispatch<OnChangeVersionAction>({
      type: 'resourceDetailPage/onChangeVersion',
      payload: {
        version: state.version,
      },
    });
  }, [state.version]);

  if (resourceDetailPage.page_State === 'loading') {
    return <FLoadingTip height={'calc(100vh - 140px)'} />;
  }

  if (resourceDetailPage.page_State === 'signPage') {
    return <SignPage />;
  }

  if (resourceDetailPage.resourceVersion_AllVersions.length === 0) {
    return (
      <>
        <div style={{ height: 100 }} />
        <div className={styles.modal}>
          <FResultTip
            h1={FI18n.i18nNext.t('msg_resource_status_prepareforrelease')}
            // h2={'主题决定节点的整体外观和设计，你可以通过激活不同的主题来更改节点的布局、配色方案等。'}
            btnText={'返回首页'}
            onClickBtn={() => {
              history.push(FUtil.LinkTo.dashboard());
            }}
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.style}>
      <Helmet>
        <title>{`${resourceDetailPage.resource_Info?.name || ''} - Freelog`}</title>
      </Helmet>
      <div className={styles.wrap}>
        <div style={{ height: 35 }} />

        <div className={styles.header}>
          <Space size={10}>
            <FTooltip
              title={FUtil.Format.resourceTypeKeyArrToResourceType(resourceDetailPage.resource_Info?.type || [])}>
              <label className={styles.resourceType}>
                {FUtil.Format.resourceTypeKeyArrToResourceType(resourceDetailPage.resource_Info?.type || [])}
              </label>
            </FTooltip>
            <FComponentsLib.FTitleText
              style={{ width: 500 }}
              singleRow
              text={resourceDetailPage.resource_Info?.name || ''}
            />
          </Space>
          <div className={styles.btns}>
            <FShare
              type='resource'
              title={resourceDetailPage.resource_Info?.name || ''}
              url={window.location.href}
            >
              <FComponentsLib.FTextBtn
                type='default'
                className={styles.btn}
                onClick={async () => {
                  await FServiceAPI.Activity.pushMessageTask({
                    taskConfigCode: 'TS000024',
                  });
                }}
              >
                <i className={`freelog fl-icon-fenxiang`} style={{ fontSize: '14px' }} />
                <div style={{ width: 5 }} />
                <span>分享</span>
              </FComponentsLib.FTextBtn>
            </FShare>
            <FComponentsLib.FTextBtn
              type='default'
              className={styles.favoriteBtn}
              onClick={() => {
                self._czc?.push(['_trackEvent', '资源详情页', '收藏', '', 1]);
                dispatch<OnClickCollectionAction>({
                  type: 'resourceDetailPage/onClickCollection',
                });
              }}
            >
              {/*{marketResourcePage.hasCollect ? <FC}*/}
              <FComponentsLib.FIcons.FFavorite filled={resourceDetailPage.resource_IsCollected} />
              <div style={{ width: 2 }} />
              <span>{resourceDetailPage.resource_IsCollected ? '已收藏' : '收藏'}</span>
              <div style={{ width: 5 }} />
              <span>({resourceDetailPage.resource_Popularity}人气)</span>
            </FComponentsLib.FTextBtn>
          </div>
        </div>

        <div style={{ height: 35 }} />

        <Sign />

        <div style={{ height: 50 }} />
        <div style={{ borderTop: '1px solid #E5E7EB' }} />
        <div style={{ height: 10 }} />

        {resourceDetailPage.resourceVersion_SelectedVersion && (
          <div className={styles.versionWrap}>
            <div className={styles.versionTitle}>
              <Space size={10}>
                <FComponentsLib.FTitleText
                  text={'当前版本 ' + resourceDetailPage.resourceVersion_SelectedVersion}
                />
                <FDropdownMenu
                  options={[...resourceDetailPage.resourceVersion_AllVersions]
                    .reverse()
                    .map((v) => ({ value: v }))}
                  onChange={(value) => {
                    history.push(
                      FUtil.LinkTo.resourceDetails({
                        resourceID: resourceDetailPage.resource_ID,
                        version: value,
                      }),
                    );
                  }}
                >
                  <FComponentsLib.FIcons.FSwap style={{ cursor: 'pointer' }} />
                </FDropdownMenu>
              </Space>

              <FComponentsLib.FContentText
                text={'发布时间 ' + resourceDetailPage.resourceVersion_Info.releaseTime}
                type='negative'
              />
            </div>

            <Description />

            <Property />

            <Option />

            <Viewport />
          </div>
        )}
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

export default connect(({ resourceDetailPage }: ConnectState) => ({
  resourceDetailPage,
}))(ResourceDetails);
