import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState, NodesModelState } from '@/models/connect';
import ResourcesAndPolicies from './ResourcesAndPolicies';
import { history } from 'umi';
import {
  ChangeAction,
  OnChangeAndVerifySignExhibitNameAction,
  OnClick_ConfirmSignContract_Action,
} from '@/models/resourceDetailPage';
import FContentLayout from '@/layouts/FContentLayout';
import FFormLayout from '@/components/FFormLayout';
import FCoverImage from '@/components/FCoverImage';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';

interface SignProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
  nodes: NodesModelState;
}

function Sign({ dispatch, resourceDetailPage, nodes }: SignProps) {

  const [signExhibitName, setSignExhibitName] = React.useState<string>(resourceDetailPage.sign_SignExhibitName);

  AHooks.useUnmount(() => {
    window.history.forward();
  });

  AHooks.useDebounceEffect(() => {
    dispatch<OnChangeAndVerifySignExhibitNameAction>({
      type: 'resourceDetailPage/onChangeAndVerifySignExhibitName',
      payload: signExhibitName,
    });
  }, [signExhibitName], {
    wait: 300,
  });

  const selectedNode = nodes.list.find((n) => n.nodeId === resourceDetailPage.sign_SelectedNodeID);

  if (!selectedNode) {
    history.goBack();
    return null;
  }

  return (<FContentLayout header={<div className={styles.header}>
    <Space size={20}>
      <FComponentsLib.FTitleText type='h1' text={'确认签约'} />

      <div className={styles.headerResource}>
        <FCoverImage src={resourceDetailPage.resource_Info?.cover || ''} width={36} />
        <div style={{ width: 8 }} />
        <FComponentsLib.FContentText text={resourceDetailPage.resource_Info?.name} />
      </div>
    </Space>

    <div className={styles.action}>
      <FComponentsLib.FTextBtn
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
        <FComponentsLib.FIcons.FLeft style={{fontSize: 12}} />
        <>返回上一步</>
      </FComponentsLib.FTextBtn>
      <div style={{ width: 30 }} />
      <FComponentsLib.FRectBtn
        onClick={() => dispatch<OnClick_ConfirmSignContract_Action>({
          type: 'resourceDetailPage/onClick_ConfirmSignContract',
        })}
        disabled={resourceDetailPage.sign_SignExhibitNameErrorTip !== ''}
        type='primary'
      >确认签约</FComponentsLib.FRectBtn>
    </div>
  </div>}>

    <div className={styles.content}>
      <FFormLayout>
        <FFormLayout.FBlock title={'确认签约节点'}>
          <Space size={5}>
            <FComponentsLib.FIcons.FNodes className={styles.yellow} />
            <FComponentsLib.FContentText
              type='highlight'
              text={selectedNode?.nodeName}
            />
          </Space>
        </FFormLayout.FBlock>

        <FFormLayout.FBlock
          title={'输入展品名称'}
          subtitle={<FComponentsLib.FContentText
            type='additional2'
            className={styles.yellow}
            // text={'(展品名称在当前节点内部唯一，后期不可修改，仅供编码用)'}
            text={FI18n.i18nNext.t('addresourcetonode_exhibitname_info')}
          />}
        >
          {/*<FInput*/}
          {/*  value={resourceDetailPage.sign_SignExhibitName}*/}
          {/*  className={styles.exhibitNameInput}*/}
          {/*  debounce={300}*/}
          {/*  onDebounceChange={(value) => {*/}
          {/*    dispatch<OnChangeAndVerifySignExhibitNameAction>({*/}
          {/*      type: 'resourceDetailPage/onChangeAndVerifySignExhibitName',*/}
          {/*      payload: value,*/}
          {/*    });*/}
          {/*  }}*/}
          {/*/>*/}
          <FComponentsLib.FInput.FSingleLine
            value={signExhibitName}
            className={styles.exhibitNameInput}
            // debounce={300}
            onChange={(e) => {
              // console.log('#@#######');
              setSignExhibitName(e.target.value);
            }}
            lengthLimit={60}
          />
          {
            resourceDetailPage.sign_SignExhibitNameErrorTip && (<>
              <div style={{ height: 5 }} />
              <div
                className={styles.signExhibitNameErrorTip}>{resourceDetailPage.sign_SignExhibitNameErrorTip}</div>
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
