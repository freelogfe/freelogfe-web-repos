import * as React from 'react';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import Sign from './Sign';
import {FTitleText, FContentText} from '@/components/FText';
import {FFavorite, FSwap} from '@/components/FIcons';
import Description from './Description';
import Property from './Property';
import Option from './Option';
import Viewport from '@/pages/resource/$id/index/Viewport';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import {
  ClearDataDataAction,
  InitDataAction,
  OnChangeVersionAction,
  OnClickCollectionAction
} from '@/models/marketResourcePage';
import FDropdownMenu from '@/components/FDropdownMenu';
import {Alert, Space} from 'antd';
import SignPage from './SignPage';
import {RouteComponentProps} from "react-router";

interface ResourceDetailsProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState,
}

function ResourceDetails({match, dispatch, marketResourcePage}: ResourceDetailsProps) {

  React.useEffect(() => {
    dispatch<InitDataAction>({
      type: 'marketResourcePage/initData',
      payload: match.params.id,
    });

    return () => {
      dispatch<ClearDataDataAction>({
        type: 'marketResourcePage/clearData',
      });
    };
  }, [match.params.id]);

  if (marketResourcePage.isSignPage) {
    return (<SignPage/>);
  }

  return (<div className={styles.style}>

    <div className={styles.wrap}>

      {
        !!marketResourcePage.signResources.find((sr) => {
          return sr.status === 0;
        }) && (<>
          <div style={{height: 20}}/>
          <Alert message={'当前主资源或上抛有未上线资源，不可用！'} type="error"/>
          <div style={{height: 20}}/>
        </>)
      }

      <div style={{height: 35}}/>

      <div className={styles.header}>
        <Space size={10}>
          <label className={styles.resourceType}>{marketResourcePage.resourceInfo?.type || ''}</label>
          <FTitleText text={marketResourcePage.resourceInfo?.name || ''}/>
        </Space>
        <a
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
        </a>
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
                  // console.log(value, '3209jsd');
                  dispatch<OnChangeVersionAction>({
                    type: 'marketResourcePage/onChangeVersion',
                    payload: value,
                  });
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
