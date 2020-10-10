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

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

const menu = (
  <Menu
    selectable={false}
    className={styles.Menu}
    mode="vertical"
  >
    <Menu.Item className={styles.MenuItem}>
      <Space size={10}>
        <span>节点1</span>
        <span className={styles.contracted}>(已签约)</span>
      </Space>
    </Menu.Item>
    <Menu.Item className={styles.MenuItem}>
      <Space size={10}>
        <span>节点2</span>
        <span className={styles.contracted}>(已签约)</span>
      </Space>
    </Menu.Item>
    <Menu.Item className={styles.MenuItem}>
      <Space size={10}>
        <span>节点3</span>
        <span className={styles.contracted}>(已签约)</span>
      </Space>
    </Menu.Item>
  </Menu>
);

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
      {/* <FMenu options={[{value: '1', text: '节点1'}, {value: '2', text: '节点2'}]}/> */}
      <Dropdown overlay={menu}>
        <div className={styles.nodeSelector}>
          <Space size={10}>
            <span className={styles.nodeSelectorLabel}>签约节点</span>
            <FContentText
              text={marketResourcePage.allNodes.find((n) => n.id === marketResourcePage.selectedNode)?.name || ''}/>
            <span className={styles.contracted}>(已签约)</span>
          </Space>
          <FDown/>
        </div>
      </Dropdown>
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
