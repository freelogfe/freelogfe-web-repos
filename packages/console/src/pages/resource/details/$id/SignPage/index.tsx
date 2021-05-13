import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import FInput from '@/components/FInput';
import {Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState, NodesModelState} from '@/models/connect';
import ResourcesAndPolicies from './ResourcesAndPolicies';
import {router} from 'umi';
import {ChangeAction, OnChangeAndVerifySignExhibitNameAction, SignContractAction} from '@/models/marketResourcePage';
import FContentLayout from "@/layouts/FContentLayout";
import FFormLayout from "@/layouts/FFormLayout";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {FLeft, FNodes} from "@/components/FIcons";

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
          src={marketResourcePage.resourceInfo?.cover || imgSrc}
        />
        <div style={{width: 8}}/>
        <FContentText text={marketResourcePage.resourceInfo?.name}/>
      </div>
    </Space>

    <div className={styles.action}>
      <FTextBtn
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'marketResourcePage/change',
            payload: {
              isSignPage: false,
            },
          });
        }}
        type="default"
      >
        <FLeft/>
        <>返回上一步</>
      </FTextBtn>
      <div style={{width: 30}}/>
      <FRectBtn
        onClick={() => dispatch<SignContractAction>({
          type: 'marketResourcePage/signContract',
        })}
        disabled={!!marketResourcePage.signExhibitNameErrorTip}
        type="primary"
      >确认签约</FRectBtn>
    </div>
  </div>}>

    <div className={styles.content}>
      <FFormLayout>
        <FFormLayout.FBlock title={'确认签约节点'}>
          <Space size={5}>
            <FNodes className={styles.yellow}/>
            <FContentText
              type="highlight"
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
            debounce={300}
            onDebounceChange={(value) => {
              dispatch<OnChangeAndVerifySignExhibitNameAction>({
                type: 'marketResourcePage/onChangeAndVerifySignExhibitName',
                payload: value,
              });
            }}
          />
          {
            marketResourcePage.signExhibitNameErrorTip && (<>
              <div style={{height: 5}}/>
              <div className={styles.signExhibitNameErrorTip}>{marketResourcePage.signExhibitNameErrorTip}</div>
            </>)
          }

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
