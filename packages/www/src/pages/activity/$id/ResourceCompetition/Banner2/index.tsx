import * as React from 'react';
import styles from './index.less';
import FModal from '@/components/FModal';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import { FUtil } from '@freelog/tools-lib';

interface Banner2Props {
  activityDetailsPage: ActivityDetailsPageModelState;

  onClickRuleBtn?(): void;
}

function Banner2({ activityDetailsPage, onClickRuleBtn }: Banner2Props) {


  return (<div className={styles.banner2}>
    <div style={{ height: 100 }} />
    <div className={styles.content}>
      <FComponentsLib.FRectBtn
        style={{
          position: 'absolute',
          top: 218,
          left: 206,
          // top: 218px;
          // left: 206px;
          height: 50,
          padding: '0 50px',
        }}
        onClick={() => {
          self._czc?.push(['_trackEvent', '资源创作大赛页', '立即参赛', '', 1]);
          self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceCreator());
        }}
        disabled={activityDetailsPage.timeValidity !== 'Validity'}
      >{activityDetailsPage.timeValidity === 'NotStart'
        ? '即将开始'
        : activityDetailsPage.timeValidity === 'Finished'
          ? ' 已经结束'
          : '立即参赛'}</FComponentsLib.FRectBtn>
      <FComponentsLib.FTextBtn
        type='primary'
        style={{ bottom: 0, left: 0, position: 'absolute' }}
        onClick={() => {
          // set_ModalVisible(true);
          self._czc?.push(['_trackEvent', '资源创作大赛页', '如何参赛', '', 1]);
          onClickRuleBtn && onClickRuleBtn();
        }}
      >规则详情</FComponentsLib.FTextBtn>
      {/*<FComponentsLib.FTextBtn*/}
      {/*  type='primary'*/}
      {/*  style={{ bottom: 0, left: 80, position: 'absolute' }}*/}
      {/*  onClick={() => {*/}
      {/*    onClickRuleBtn && onClickRuleBtn();*/}
      {/*  }}*/}
      {/*>规则详情</FComponentsLib.FTextBtn>*/}
    </div>
    <div style={{ height: 100 }} />
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(Banner2);
