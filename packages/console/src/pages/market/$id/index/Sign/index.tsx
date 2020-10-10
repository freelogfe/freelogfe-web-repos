import * as React from 'react';
import styles from './index.less';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {FContentText, FTitleText} from '@/components/FText';
import {FDown, FFavorite} from '@/components/FIcons';
import {Checkbox, Space} from 'antd';
import {FNormalButton} from '@/components/FButton';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';
import {Dropdown, Menu} from 'antd';
import Contracts from './Contracts';
import Policies from './Policies';
import Resources from './Resources';
import NodeSelector from './NodeSelector';

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Sign({dispatch, marketResourcePage}: SignProps) {
  return (<div className={styles.info}>
    <div className={styles.infoLeft}>
      <img
        className={styles.cover}
        src={marketResourcePage.resourceInfo?.cover || undefined}
        alt={''}
      />
      <div style={{height: 10}}/>
      <div className={styles.title}>
        <span
          className={styles.titleText}>{marketResourcePage.resourceInfo?.name || ''}
        </span>
        &nbsp;
        <FCopyToClipboard
          text={marketResourcePage.resourceInfo?.name || ''}
          title={'复制资源名称'}
        />
      </div>
      <div style={{height: 10}}/>
      <div className={styles.babels}>
        <label>{marketResourcePage.resourceInfo?.type || ''}</label>
        {
          (marketResourcePage.resourceInfo?.tags || []).map((t) => (<label key={t}>{t}</label>))
        }
      </div>
      <div style={{height: 10}}/>
      <FContentText
        text={marketResourcePage.resourceInfo?.about || ''}/>
      <div style={{height: 20}}/>
      <a className={styles.favoriteBtn}>
        <FFavorite/> 收藏 ({marketResourcePage.popularity}人气)
      </a>
    </div>
    <div className={styles.cell}/>
    <div className={styles.infoRight}>
      <NodeSelector/>
      <div style={{height: 15}}/>
      <div className={styles.sign}>
        <div className={styles.signLeft}>
          <Resources/>
        </div>
        <div className={styles.signRight}>
          <Contracts/>
          <Policies/>
        </div>

      </div>
      <div style={{height: 15}}/>
      <div className={styles.signBottom}>
        {/*<FNormalButton*/}
        {/*  className={styles.signButton}*/}
        {/*>签约</FNormalButton>*/}
        <span>该资源已签约，可进入<a>展品管理</a>进行授权管理</span>
      </div>
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Sign);
