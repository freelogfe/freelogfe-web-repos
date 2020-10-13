import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {Dispatch, connect} from 'dva';
import {ChangeAction} from '@/models/global';
import Sign from './Sign';
import {FTitleText, FContentText} from '@/components/FText';
import {FSwap} from '@/components/FIcons';
import Description from './Description';
import Property from './Property';
import Option from './Option';
import Viewport from '@/pages/market/$id/index/Viewport';
import {ConnectState, MarketResourcePageState} from '@/models/connect';
import FDropdown from '@/components/FDropdown';
import {FetchInfoAction, InitDataAction} from '@/models/marketResourcePage';
import RouterTypes from 'umi/routerTypes';

interface ResourceDetailsProps extends RouterTypes {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState,
}

function ResourceDetails({match, dispatch, marketResourcePage}: ResourceDetailsProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        backgroundColor: 'white',
      },
    });
    return () => {
      // console.log('#E#####EEEEE');
      dispatch<ChangeAction>({
        type: 'global/change',
        payload: {
          backgroundColor: '',
        },
      });
    }
  }, []);

  React.useEffect(() => {
    // console.log((match.params as any).id, 'match98320j');
    dispatch<InitDataAction>({
      type: 'marketResourcePage/initData',
      payload: (match.params as any).id,
    });
  }, []);

  return (<FCenterLayout>
    <div className={styles.wrap}>
      <div style={{height: 40}}/>
      <Sign/>
      <div style={{height: 50}}/>
      <div className={styles.versionWrap}>
        <div className={styles.versionTitle}>
          <FTitleText text={'当前版本 ' + marketResourcePage.version}/>
          <div style={{width: 15}}/>
          <FContentText text={'发布时间 ' + marketResourcePage.releaseTime} type="additional1"/>
          <div style={{width: 20}}/>
          <FDropdown
            options={[...marketResourcePage.allVersions].reverse().map((v) => ({value: v}))}
          >
            <FSwap/>
          </FDropdown>
        </div>

        <Description/>
        <Property/>
        <Option/>
        <Viewport/>
      </div>
    </div>
  </FCenterLayout>);
}


export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(ResourceDetails);
