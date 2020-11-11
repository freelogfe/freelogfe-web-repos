import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FNormalButton, FTextButton} from '@/components/FButton';
import FCenterLayout from '@/layouts/FCenterLayout';
import {FInfo, FSwap} from '@/components/FIcons';
import FInput from '@/components/FInput';
import {Space, Tooltip, Drawer} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState, NodesModelState} from '@/models/connect';
import FLeft from '@/components/FIcons/FLeft';
import ResourcesAndPolicies from './ResourcesAndPolicies';
import FixedFooter from './FixedFooter';
import {router} from 'umi';
import FTooltip from '@/components/FTooltip';
import {ChangeAction} from '@/models/marketResourcePage';

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
  nodes: NodesModelState;
}

function Sign({dispatch, marketResourcePage, nodes}: SignProps) {
  const selectedNode = nodes.list.find((n) => n.nodeId === marketResourcePage.selectedNodeID);

  if (!selectedNode) {
    router.goBack();
    return null;
  }

  return (<FCenterLayout>
    <div className={styles.header}>
      <FTitleText text={'确认签约'}/>
      <div style={{width: 50}}/>
      <div className={styles.headerResource}>
        <img
          alt={''}
          src={marketResourcePage.resourceInfo?.cover || undefined}
        />
        <div style={{width: 8}}/>
        <FContentText text={marketResourcePage.resourceInfo?.name}/>
      </div>
    </div>

    <div className={styles.content}>
      <div>
        <FTitleText
          type="h3"
          text={'确认签约节点'}
        />
        <div style={{height: 20}}/>
        <div className={styles.nodeName}>
          <FTitleText
            type="h5"
            text={selectedNode?.nodeName}
          />
          {/*<div style={{width: 20}}/>*/}
          {/*<FSwap/>*/}
        </div>
        <div style={{height: 50}}/>
        <div className={styles.nameTitle}>
          <FTitleText
            text={'输入展品名称'}
            type="h3"
          />
          <div style={{width: 10}}/>
          <FContentText
            type="additional2"
            text={'(展品名称在当前节点内部唯一，后期不可修改，仅供编码用)'}
          />
        </div>
        <div style={{height: 20}}/>
        <div className={styles.exhibitName}>
          <FInput
            value={marketResourcePage.signExhibitName}
            className={styles.exhibitNameInput}
            onChange={(e) => dispatch<ChangeAction>({
              type: 'marketResourcePage/change',
              payload: {
                signExhibitName: e.target.value,
                signExhibitNameErrorTip: '',
              },
            })}
          />
          <div style={{height: 5}}/>
          <div className={styles.signExhibitNameErrorTip}>{marketResourcePage.signExhibitNameErrorTip}</div>
          {/*<FTooltip*/}
          {/*  placement="bottomLeft"*/}
          {/*  title={'展品名称在当前节点内部唯一，后期不可修改，仅供编码用'}*/}
          {/*><FInfo/></FTooltip>*/}
        </div>
        <div style={{height: 50}}/>

        <ResourcesAndPolicies/>
      </div>
    </div>

    <div style={{height: 50}}/>

    <FixedFooter/>

  </FCenterLayout>);
}

export default connect(({marketResourcePage, nodes}: ConnectState) => ({
  marketResourcePage,
  nodes,
}))(Sign);
