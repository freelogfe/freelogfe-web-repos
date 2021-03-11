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
// import FixedFooter from './FixedFooter';
import {router} from 'umi';
import FTooltip from '@/components/FTooltip';
import {ChangeAction, SignContractAction} from '@/models/marketResourcePage';
import FContentLayout from "@/layouts/FContentLayout";
import FFormLayout from "@/layouts/FFormLayout";
import {FIcon} from "@/components";

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

  return (<FContentLayout header={<div className={styles.header}>
    <Space size={20}>
      <FTitleText type="h1" text={'确认签约'}/>

      <div className={styles.headerResource}>
        <img
          alt={''}
          src={marketResourcePage.resourceInfo?.cover || undefined}
        />
        <div style={{width: 8}}/>
        <FContentText text={marketResourcePage.resourceInfo?.name}/>
      </div>
    </Space>

    <div className={styles.action}>
      <FTextButton onClick={() => {
        dispatch<ChangeAction>({
          type: 'marketResourcePage/change',
          payload: {
            isSignPage: false,
          },
        });
      }}>
        <FLeft/>
        <>返回上一步</>
      </FTextButton>
      <div style={{width: 30}}/>
      <FNormalButton
        onClick={() => dispatch<SignContractAction>({
          type: 'marketResourcePage/signContract',
        })}
        // disabled={!EXHIBIT_NAME.test(marketResourcePage.signExhibitName)}
      >确认签约</FNormalButton>
    </div>
  </div>}>

    <div className={styles.content}>
      <FFormLayout>
        <FFormLayout.FBlock title={'确认签约节点'}>
          <Space size={5}>
            <FIcon.FNodes className={styles.yellow}/>
            <FTitleText
              type="h5"
              text={selectedNode?.nodeName}
            />
          </Space>

        </FFormLayout.FBlock>

        <FFormLayout.FBlock
          title={'输入展品名称'}
          subtitle={<FContentText
            type="additional2"
            className={styles.yellow}
            text={'(展品名称在当前节点内部唯一，后期不可修改，仅供编码用)'}
          />}
        >
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
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={'确认签约策略'}>
          <ResourcesAndPolicies/>
        </FFormLayout.FBlock>
      </FFormLayout>

    </div>

  </FContentLayout>);
}

export default connect(({marketResourcePage, nodes}: ConnectState) => ({
  marketResourcePage,
  nodes,
}))(Sign);
