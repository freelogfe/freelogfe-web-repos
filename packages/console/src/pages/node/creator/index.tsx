import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeCreatorPageModelState } from '@/models/connect';
import {
  OnBlur_DomainInput_Action,
  OnBlur_NameInput_Action,
  OnChange_DomainInput_Action,
  OnChange_NameInput_Action,
  OnClick_CreateBtn_Action,
} from '@/models/nodeCreatorPage';
import FContentLayout from '@/layouts/FContentLayout';
import * as AHooks from 'ahooks';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/nodeCreatorPage';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import moment from 'moment';

interface NodeCreatorProps {
  dispatch: Dispatch;
  nodeCreatorPage: NodeCreatorPageModelState;
}

function NodeCreator({ nodeCreatorPage, dispatch }: NodeCreatorProps) {
  // console.log(moment(FI18n.i18nNext.t('event_contest_eventperiod_end')).format('YYYY-MM-DD'), 'sdiofjsdlkfjlskdjflkjlkjl');
  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
    dispatch<OnMount_Page_Action>({
      type: 'nodeCreatorPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'nodeCreatorPage/onUnmount_Page',
    });
  });

  const createBtnDisabled: boolean = nodeCreatorPage.nodeDomain.trim() === ''
    || nodeCreatorPage.nodeDomainState === 'verifying'
    || nodeCreatorPage.nodeDomainError !== ''
    || nodeCreatorPage.nodeName.trim() === ''
    || nodeCreatorPage.nodeNameState === 'verifying'
    || nodeCreatorPage.nodeNameError !== '';

  if (!createBtnDisabled) {
    FComponentsLib.fSetHotspotTooltipVisible('createNodePage.createBtn', {
      value: true,
      effectiveImmediately: true,
      onlyNullish: true,
    });

    setTimeout(() => {
      FComponentsLib.fSetHotspotTooltipVisible('createNodePage.createBtn', {
        value: false,
        effectiveImmediately: false,
        onlyNullish: false,
      });
    });
  }

  return (<>
    <FContentLayout header={<FComponentsLib.FTitleText
      type='h1'
      text={'创建节点'} />}
    >
      <div className={styles.body}>
        <div style={{ height: 80 }} />
        <Space size={10}>
          <div className={styles.domain}>
            <FComponentsLib.FContentText
              type='negative'
              // text={'节点地址'}
              text={FI18n.i18nNext.t('createnode_input_nodeaddress_label')}
            />
            <div className={styles.inputWrap}>
              <FComponentsLib.FInput.FSingleLine
                lengthLimit={-1}
                value={nodeCreatorPage.nodeDomain}
                className={styles.input}
                placeholder={FI18n.i18nNext.t('createnode_input_nodeaddress_hint')}
                onChange={(e) => {
                  dispatch<OnChange_DomainInput_Action>({
                    type: 'nodeCreatorPage/onChange_DomainInput',
                    payload: { value: e.target.value },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_DomainInput_Action>({
                    type: 'nodeCreatorPage/onBlur_DomainInput',
                  });
                }}
              />
            </div>
            <FComponentsLib.FContentText
              type='negative'
              text={FUtil.Format.completeUrlByDomain('').replace(/(http|https):\/\//, '')}
            />
          </div>
          <div style={{ width: 18 }}>
            {nodeCreatorPage.nodeDomainState === 'verifying' && <FComponentsLib.FIcons.FLoading />}
            {nodeCreatorPage.nodeDomainState === 'verified' && !nodeCreatorPage.nodeDomainError &&
            <FComponentsLib.FIcons.FCheck />}
          </div>
        </Space>
        <pre className={styles.errorTip}>{nodeCreatorPage.nodeDomainError}</pre>
        <Space size={10}>
          <div className={styles.name}>
            <FComponentsLib.FContentText
              type='negative'
              text={FI18n.i18nNext.t('createnode_input_nodeid_label')}
            />
            <div className={styles.inputWrap}>
              <FComponentsLib.FInput.FSingleLine
                lengthLimit={-1}
                value={nodeCreatorPage.nodeName}
                onChange={(e) => {
                  dispatch<OnChange_NameInput_Action>({
                    type: 'nodeCreatorPage/onChange_NameInput',
                    payload: { value: e.target.value },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_NameInput_Action>({
                    type: 'nodeCreatorPage/onBlur_NameInput',
                  });
                }}
                className={styles.input}
                placeholder={FI18n.i18nNext.t('createnode_input_nodeid_hint')}
              />
            </div>
          </div>
          <div style={{ width: 18 }}>
            {nodeCreatorPage.nodeNameState === 'verifying' && <FComponentsLib.FIcons.FLoading />}
            {nodeCreatorPage.nodeNameState === 'verified' && !nodeCreatorPage.nodeNameError &&
            <FComponentsLib.FIcons.FCheck />}
          </div>
        </Space>

        {
          nodeCreatorPage.nodeNameError === ''
            ? (<div style={{ height: 10 }} />)
            : (<pre className={styles.errorTip} style={{ height: 30 }}>{nodeCreatorPage.nodeNameError}</pre>)
        }
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('createnode_input_nodeid_alarm')}
          type={'additional2'}
          style={{ width: 624 }}
        />
        {
          nodeCreatorPage.nodeNameError === '' && (<div style={{ height: 20 }} />)
        }

        <div style={{ height: 30 }} />

        <FComponentsLib.FHotspotTooltip
          id={'createNodePage.createBtn'}
          style={{ left: -52, top: 4 }}
          text={FI18n.i18nNext.t('hotpots_createnode_btn_create')}
        >
          <FComponentsLib.FRectBtn
            className={styles.button}
            disabled={createBtnDisabled}
            onClick={() => {
              dispatch<OnClick_CreateBtn_Action>({
                type: 'nodeCreatorPage/onClick_CreateBtn',
              });
            }}
            type='primary'
          >创建节点</FComponentsLib.FRectBtn>
        </FComponentsLib.FHotspotTooltip>

        <div style={{ height: 60 }} />
        <FComponentsLib.FContentText text={'每个用户最多可创建3个节点，节点创建之后无法删除，请谨慎操作。'} type={'additional2'} />
      </div>
    </FContentLayout>
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ nodeCreatorPage }: ConnectState) => ({
  nodeCreatorPage,
}))(NodeCreator);
