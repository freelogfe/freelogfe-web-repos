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
  ClearDataDataAction,
  FetchCollectionInfoAction,
  FetchInfoAction,
  OnClickCollectionAction,
  ChangeAction,
  FetchVersionInfoAction, OnMountPageAction, OnChangeVersionAction,
} from '@/models/marketResourcePage';
import FDropdownMenu from '@/components/FDropdownMenu';
import {Alert, Space} from 'antd';
import SignPage from './SignPage';
import {RouteComponentProps} from "react-router";
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import {router} from "umi";
import {FUtil} from '@freelog/tools-lib';
import {FTextBtn} from "@/components/FButton";

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

  });

  React.useEffect(() => {
    // console.log(state.version, 'state.version2334234234');
    // if (state.version) {
    //   fetchVersionInfo();
    // }
    dispatch<OnChangeVersionAction>({
      type: 'marketResourcePage/onChangeVersion',
      payload: {
        version: state.version,
      },
    });
  }, [state]);

  // async function fetchVersionInfo() {
  //   await onChange({
  //     version: state.version,
  //   });
  //
  //   await dispatch<FetchVersionInfoAction>({
  //     type: 'marketResourcePage/fetchVersionInfo',
  //   });
  //
  // }

  AHooks.useUnmount(() => {
    dispatch<ClearDataDataAction>({
      type: 'marketResourcePage/clearData',
    });
  });

  async function onChange(payload: Partial<MarketResourcePageModelState>) {
    await dispatch<ChangeAction>({
      type: 'marketResourcePage/change',
      payload: payload,
    });
  }

  if (marketResourcePage.isSignPage) {
    return (<SignPage/>);
  }

  return (<div className={styles.style}>

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
