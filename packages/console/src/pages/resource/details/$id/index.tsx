import * as React from 'react';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import Sign from './Sign';
import {FTitleText, FContentText} from '@/components/FText';
import {FFavorite, FSwap} from '@/components/FIcons';
import Description from './Description';
import Property from './Property';
import Option from './Option';
import Viewport from './Viewport';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import {
  OnClickCollectionAction,
  OnMountPageAction,
  OnChangeVersionAction,
  OnUnmountPageAction,
} from '@/models/marketResourcePage';
import FDropdownMenu from '@/components/FDropdownMenu';
import {Space} from 'antd';
import SignPage from './SignPage';
import {RouteComponentProps} from "react-router";
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import {router} from "umi";
import {FUtil} from '@freelog/tools-lib';
import {FTextBtn} from "@/components/FButton";
import { Helmet } from 'react-helmet';

interface ResourceDetailsProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState,
}

function ResourceDetails({match, dispatch, marketResourcePage}: ResourceDetailsProps) {

  const [state] = useUrlState<{ version: string }>();

  AHooks.useMount(async () => {
    dispatch<OnMountPageAction>({
      type: 'marketResourcePage/onMountPage',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'marketResourcePage/onUnmountPage',
    });
  });

  React.useEffect(() => {
    dispatch<OnChangeVersionAction>({
      type: 'marketResourcePage/onChangeVersion',
      payload: {
        version: state.version,
      },
    });
  }, [state]);

  if (marketResourcePage.isSignPage) {
    return (<SignPage/>);
  }

  return (<div className={styles.style}>
    <Helmet>
      <title>{`${marketResourcePage.resourceInfo?.name || ''} - Freelog`}</title>
    </Helmet>
    <div className={styles.wrap}>

      <div style={{height: 35}}/>

      <div className={styles.header}>
        <Space size={10}>
          <label className={styles.resourceType}>{marketResourcePage.resourceInfo?.type || ''}</label>
          <FTitleText
            style={{width: 700}}
            singleRow
            text={marketResourcePage.resourceInfo?.name || ''}
          />
        </Space>
        <FTextBtn
          type="default"
          className={styles.favoriteBtn}
          onClick={() => dispatch<OnClickCollectionAction>({
            type: 'marketResourcePage/onClickCollection',
          })}
        >
          <FFavorite
            filled={marketResourcePage.hasCollect}
          />
          <div style={{width: 2}}/>
          <span>{marketResourcePage.hasCollect ? '已收藏' : '收藏'}</span>
          <div style={{width: 5}}/>
          <span>({marketResourcePage.popularity}人气)</span>
        </FTextBtn>
      </div>

      <div style={{height: 35}}/>

      <Sign/>

      <div style={{height: 50}}/>
      <div style={{borderTop: '1px solid #E5E7EB'}}/>
      <div style={{height: 10}}/>

      {
        marketResourcePage.version && (<div className={styles.versionWrap}>
          <div className={styles.versionTitle}>
            <Space size={10}>
              <FTitleText text={'当前版本 ' + marketResourcePage.version}/>
              <FDropdownMenu
                options={[...marketResourcePage.allVersions].reverse().map((v) => ({value: v}))}
                onChange={(value) => {
                  router.push(FUtil.LinkTo.resourceDetails({
                    resourceID: marketResourcePage.resourceId,
                    version: value,
                  }));
                }}
              >
                <FSwap style={{cursor: 'pointer'}}/>
              </FDropdownMenu>
            </Space>

            <FContentText
              text={'发布时间 ' + marketResourcePage.releaseTime}
              type="negative"
            />

          </div>

          <Description/>

          <Property/>

          <Option/>

          <Viewport/>
        </div>)
      }
      <div style={{height: 80}}/>
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(ResourceDetails);
