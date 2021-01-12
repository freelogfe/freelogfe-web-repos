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
import Viewport from '@/pages/resource/$id/index/Viewport';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import FDropdown from '@/components/FDropdown';
import {ClearDataDataAction, FetchInfoAction, InitDataAction, OnChangeVersionAction} from '@/models/marketResourcePage';
import RouterTypes from 'umi/routerTypes';
import FDropdownMenu from '@/components/FDropdownMenu';
import {Alert} from 'antd';
import SignPage from './SignPage';

interface ResourceDetailsProps
  // extends RouterTypes
{
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState,
  match: {
    params: {
      id: string;
    };
  };
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
      <div style={{height: 20}}/>
      {
        !!marketResourcePage.signResources.find((sr) => {
          return sr.status === 0;
        }) && (<Alert message={'当前主资源或上抛有未上线资源，不可用！'} type="error"/>)
      }

      <div style={{height: 20}}/>
      <Sign/>

      <div style={{height: 50}}/>

      {
        marketResourcePage.version && (<div className={styles.versionWrap}>
          <div className={styles.versionTitle}>
            <FTitleText text={'当前版本 ' + marketResourcePage.version}/>
            <div style={{width: 15}}/>
            <FContentText
              text={'发布时间 ' + marketResourcePage.releaseTime}
              type="additional1"
            />
            <div style={{width: 20}}/>
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
              <a><FSwap/></a>
            </FDropdownMenu>
          </div>

          <Description/>

          <Property/>

          <Option/>

          <Viewport/>
        </div>)
      }

    </div>
  </div>);
}


export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(ResourceDetails);
