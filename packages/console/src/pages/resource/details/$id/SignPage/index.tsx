import * as React from 'react';
import styles from './index.less';
import { FTitleText, FContentText } from '@/components/FText';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FInput from '@/components/FInput';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceDetailPageModelState, NodesModelState } from '@/models/connect';
import ResourcesAndPolicies from './ResourcesAndPolicies';
import { router } from 'umi';
import {
  ChangeAction,
  OnChangeAndVerifySignExhibitNameAction,
  OnClick_ConfirmSignContract_Action,
} from '@/models/resourceDetailPage';
import FContentLayout from '@/layouts/FContentLayout';
import FFormLayout from '@/components/FFormLayout';
import { FLeft, FNodes } from '@/components/FIcons';
import FCoverImage from '@/components/FCoverImage';
import * as AHooks from 'ahooks';

interface SignProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
  nodes: NodesModelState;
}

function Sign({ dispatch, resourceDetailPage, nodes }: SignProps) {

  AHooks.useUnmount(() => {
      window.history.forward();
  });

  const selectedNode = nodes.list.find((n) => n.nodeId === resourceDetailPage.selectedNodeID);

  if (!selectedNode) {
    router.goBack();
    return null;
  }

  return (<FContentLayout header={<div className={styles.header}>
    <Space size={20}>
      <FTitleText type='h1' text={'确认签约'} />

      <div className={styles.headerResource}>
        <FCoverImage src={resourceDetailPage.resourceInfo?.cover || ''} width={36} />
        <div style={{ width: 8 }} />
        <FContentText text={resourceDetailPage.resourceInfo?.name} />
      </div>
    </Space>

    <div className={styles.action}>
      <FTextBtn
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'resourceDetailPage/change',
            payload: {
              page_State: 'details',
              // isSignPage: false,
            },
          });
        }}
        type='default'
      >
        <FLeft />
        <>返回上一步</>
      </FTextBtn>
      <div style={{ width: 30 }} />
      <FRectBtn
        onClick={() => dispatch<OnClick_ConfirmSignContract_Action>({
          type: 'resourceDetailPage/onClick_ConfirmSignContract',
        })}
        disabled={!!resourceDetailPage.signExhibitNameErrorTip}
        type='primary'
      >确认签约</FRectBtn>
    </div>
  </div>}>

    <div className={styles.content}>
      <FFormLayout>
        <FFormLayout.FBlock title={'确认签约节点'}>
          <Space size={5}>
            <FNodes className={styles.yellow} />
            <FContentText
              type='highlight'
              text={selectedNode?.nodeName}
            />
          </Space>
        </FFormLayout.FBlock>

        <FFormLayout.FBlock
          title={'输入展品名称'}
          subtitle={<FContentText
            type='additional2'
            className={styles.yellow}
            text={'(展品名称在当前节点内部唯一，后期不可修改，仅供编码用)'}
          />}
        >
          <FInput
            value={resourceDetailPage.signExhibitName}
            className={styles.exhibitNameInput}
            debounce={300}
            onDebounceChange={(value) => {
              dispatch<OnChangeAndVerifySignExhibitNameAction>({
                type: 'resourceDetailPage/onChangeAndVerifySignExhibitName',
                payload: value,
              });
            }}
          />
          {
            resourceDetailPage.signExhibitNameErrorTip && (<>
              <div style={{ height: 5 }} />
              <div className={styles.signExhibitNameErrorTip}>{resourceDetailPage.signExhibitNameErrorTip}</div>
            </>)
          }

        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={'确认签约策略'}>
          <ResourcesAndPolicies />
        </FFormLayout.FBlock>
      </FFormLayout>

    </div>

  </FContentLayout>);
}

export default connect(({ resourceDetailPage, nodes }: ConnectState) => ({
  resourceDetailPage,
  nodes,
}))(Sign);
