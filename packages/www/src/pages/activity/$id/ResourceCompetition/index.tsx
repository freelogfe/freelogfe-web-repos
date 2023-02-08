import * as React from 'react';
import styles from './index.less';
import Banner1 from './Banner1';
import Participations from './Participations';
import Reward from './Reward';
import AddTags from './AddTags';
// import Strategy from '@/pages/activity/$id/ResourceCompetition/Strategy';
import Banner2 from './Banner2';
import FComponentsLib from '@freelog/components-lib';
import { Popover } from 'antd';
import FModal from '@/components/FModal';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
// import { FUtil } from '@freelog/tools-lib';
// import moment from 'moment';
import * as AHooks from 'ahooks';

interface ResourceCompetitionProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function ResourceCompetition({
                               activityDetailsPage,
                             }: ResourceCompetitionProps): React.ReactElement {
  const [modalVisible, set_ModalVisible] = React.useState<boolean>(false);

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
  });

  // const [allDate, set_allDate] = React.useState<{
  //   start: string;
  //   end: string;
  //   announce: string;
  // } | null>(null);
  //
  // React.useEffect(() => {
  //   if (!!activityDetailsPage.startTime && !!activityDetailsPage.endTime) {
  //     set_allDate({
  //       start: moment(activityDetailsPage.startTime, 'YYYY·MM·DD').format('YYYY年MM月DD日'),
  //       end: moment(activityDetailsPage.endTime, 'YYYY·MM·DD').format('YYYY年MM月DD日'),
  //       announce: moment(activityDetailsPage.endTime, 'YYYY·MM·DD').add(7, 'd').format('YYYY年MM月DD日'),
  //     });
  //   } else {
  //     set_allDate(null);
  //   }
  // }, [activityDetailsPage.startTime, activityDetailsPage.endTime]);

  return (
    <div className={styles.style}>
      <Banner1 />
      <div style={{ height: 266 }} />
      <Participations
        onClickRuleBtn={() => {
          set_ModalVisible(true);
        }}
      />
      <div style={{ height: 100 }} />
      <Reward />
      {/*<div style={{ height: 100 }} />*/}
      <AddTags />
      {/*<Strategy />*/}
      {/*<div style={{ height: 100 }} />*/}
      <Banner2
        onClickRuleBtn={() => {
          set_ModalVisible(true);
        }}
      />
      <div style={{ height: 100 }} />

      <FModal
        width={1000}
        visible={modalVisible}
        footer={null}
        centered
        onCancel={() => {
          set_ModalVisible(false);
        }}
      >
        <div className={styles.regulation}>
          <div style={{ height: 60 }} />
          <div className={styles.regulationTitle}>活动规则</div>
          <div style={{ height: 40 }} />
          <div className={styles.regulationContent}>
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>
                  活动投稿时间：
                  {activityDetailsPage.startTime?.format('YYYY年MM月DD日') || 'YYYY年MM月DD日'}
                  00:00至
                  {activityDetailsPage.endTime?.format('YYYY年MM月DD日') || 'YYYY年MM月DD日'}
                  24:00，投稿时间以资源发行时间为准。
                </span>
              </div>
            </div>
            {/*<div style={{ height: 20 }} />*/}
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>
                  结果公示时间：{activityDetailsPage.announceTime?.format('YYYY年MM月DD日') || 'YYYY年MM月DD日'}，获奖结果将在Freelog主站活动页中公示。每周幸运奖获奖名单将于每周一在本活动页中的置顶讨论区、个人主页的公告栏中公示，奖励将于活动结果公示后的7个工作日内发放。
                </span>
              </div>
            </div>
            {/*<div style={{ height: 20 }} />*/}
            {/*<div className={styles.regulationItem}>*/}
            {/*  <div className={styles.circle} />*/}
            {/*  <div style={{ width: 15 }} />*/}
            {/*  <div className={styles.text}>*/}
            {/*    <span>*/}
            {/*      用户可同时领取资源作者和节点商奖励，即用户可自己创建节点签约参赛资源为展品，参与展品被签约排名。*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div style={{ height: 20 }} />*/}
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>
                  同一用户限领3次资源创建奖励，同一账号、同一登陆设备、同一登陆IP均视为同一用户，对于非正常创建资源、展品的用户，Freelog有权取消其活动参与资格，并扣除相应奖励不予结算。
                </span>
              </div>
            </div>
            {/*<div style={{ height: 20 }} />*/}
            {/*<div className={styles.regulationItem}>*/}
            {/*  <div className={styles.circle} />*/}
            {/*  <div style={{ width: 15 }} />*/}
            {/*  <div className={styles.text}>*/}
            {/*    <span>参赛活动的节点需使用官方指定主题。</span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div style={{ height: 20 }} />*/}
            {/*<div className={styles.regulationItem}>*/}
            {/*  <div className={styles.circle} />*/}
            {/*  <div style={{ width: 15 }} />*/}
            {/*  <div className={styles.text}>*/}
            {/*    <span>*/}
            {/*      活动期间，Freelog会向每位用户提供最高1000个羽币领取额度，羽币仅用于资源或展品授权合约交易，不可提现。活动结束后，累计的羽币可根据相应的规则进行奖品兑换。领取途径：<FComponentsLib.FTextBtn*/}
            {/*      style={{ display: 'contents' }} onClick={() => {*/}
            {/*      self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet());*/}
            {/*    }}>【个人中心】-【钱包】-【每日登录】</FComponentsLib.FTextBtn>。*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div style={{ height: 20 }} />*/}
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>活动最终解释权归Freelog所有。</span>
              </div>
            </div>
          </div>

          <div style={{ height: 60 }} />
          <div className={styles.regulationTitle}>投稿参赛要求</div>
          <div style={{ height: 40 }} />
          <div className={styles.regulationContent}>
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>
                  参赛漫画资源需选择资源类型“图片-插画”，同时添加{' '}
                  <FComponentsLib.FCopyToClipboard
                    text={'内测集结！漫画家召集令'}
                    title={'点击复制标签'}
                  ><b style={{
                    cursor: 'pointer',
                    color: '#E9A923',
                  }}>#内测集结！漫画家召集令#</b></FComponentsLib.FCopyToClipboard>{' '}
                  活动标签，以JPG、PNG长图格式上传，单张漫画内容需不少于10格；小说资源需选择资源类型“阅读-文章”，同时添加{' '}
                  <FComponentsLib.FCopyToClipboard
                    text={'内测集结！小说家召集令'}
                    title={'点击复制标签'}
                  ><b style={{
                    cursor: 'pointer',
                    color: '#E9A923',
                  }}>#内测集结！小说家召集令#</b></FComponentsLib.FCopyToClipboard>{' '}
                  活动标签，以TXT格式上传，字数需不少于1500字。官方将根据资源所添加的活动标签进行对应奖项评选，如未添加活动标签将不计入活动之中。
                </span>
              </div>
            </div>
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>参赛资源需符合</span>
                <a
                  href={
                    'https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2'
                  }
                  target='_blank'
                >
                  《Freelog平台管理规范》
                </a>
                <span>
                  ，非合规资源平台有权取消其参赛资格并扣除奖励不予发放。
                </span>
              </div>
            </div>
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>
                  同一参赛资源不能由多人提交，重复参加。如资源内容由多位作者共同创作，只能由一人提交参与活动，如作品获奖，奖金将发放给提交资源内容的资源作者。
                </span>
              </div>
            </div>
            <div className={styles.regulationItem}>
              <div className={styles.circle} />
              <div style={{ width: 15 }} />
              <div className={styles.text}>
                <span>
                  禁止一切违规刷数据的行为，如参赛资源存在刷数据的情况，则将被视为无效资源，取消活动参与资格。
                </span>
              </div>
            </div>
          </div>
          <div style={{ height: 60 }} />
        </div>
      </FModal>

      <FComponentsLib.FPageFooter PopoverPatch={Popover} />
    </div>
  );
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(ResourceCompetition);
