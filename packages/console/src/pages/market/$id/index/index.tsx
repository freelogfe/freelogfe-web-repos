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
import FDropdown from "@/components/FDropdown";

interface ResourceDetailsProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState,
}

function ResourceDetails({dispatch, marketResourcePage}: ResourceDetailsProps) {

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

  return (<FCenterLayout>
    <div className={styles.wrap}>
      <div style={{height: 40}}/>
      <Sign/>
      <div style={{height: 50}}/>
      <div>
        <div className={styles.versionTitle}>
          <FTitleText text={'当前版本 ' + marketResourcePage.version}/>
          <div style={{width: 15}}/>
          <FContentText text={'发布时间 ' + marketResourcePage.releaseTime} type="additional1"/>
          <div style={{width: 20}}/>
          <FDropdown options={[{value: '0.0.1'}, {value: '0.0.2'}]}><FSwap/></FDropdown>
        </div>

        <div style={{height: 30}}/>
        <Description/>
        <div style={{height: 50}}/>
        <Property/>
        <div style={{height: 50}}/>
        <Option/>
        <div style={{height: 50}}/>
        <Viewport/>
      </div>
    </div>
  </FCenterLayout>);
}


export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(ResourceDetails);
