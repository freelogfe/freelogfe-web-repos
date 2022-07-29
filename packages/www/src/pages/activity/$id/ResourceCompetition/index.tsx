import * as React from 'react';
import styles from './index.less';
import Banner1 from '@/pages/activity/$id/ResourceCompetition/Banner1';
import Participations from '@/pages/activity/$id/ResourceCompetition/Participations';
import Reward from '@/pages/activity/$id/ResourceCompetition/Reward';
import Strategy from '@/pages/activity/$id/ResourceCompetition/Strategy';
import Banner2 from '@/pages/activity/$id/ResourceCompetition/Banner2';
// import FPageFooter from '@/components/FPageFooter';
import FComponentsLib from '@freelog/components-lib';
import { Popover } from 'antd';
import FModal from '@/components/FModal';

interface ResourceCompetitionProps {

}

function ResourceCompetition({}: ResourceCompetitionProps): React.ReactElement {

  const [modalVisible, set_ModalVisible] = React.useState<boolean>(false);

  return (<div className={styles.style}>
    {/*<FLoadingTip height={window.innerHeight - 170} />*/}
    <Banner1 />
    <div style={{ height: 266 }} />
    <Participations onClickRuleBtn={() => {
      set_ModalVisible(true);
    }} />
    <div style={{ height: 100 }} />
    <Reward />
    <div style={{ height: 100 }} />
    <Strategy />
    <div style={{ height: 100 }} />
    <Banner2 onClickRuleBtn={() => {
      set_ModalVisible(true);
    }} />
    <div style={{ height: 100 }} />

    <FModal
      width={1100}
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
              <span>活动投稿时间：2021年***00:00至2021年***24:00，投稿时间以资源发行时间为准。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>结果公示时间：****，获奖结果将在Freelog主站活动页中公示。每周幸运奖获奖名单将于每周一在本活动页中的置顶讨论区、个人主页的公告栏中公示，奖励将于活动结果公示后的7个工作日内发放。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>用户可同时领取资源作者和节点商奖励，即用户可自己创建节点签约参赛资源为展品，参与展品被签约排名。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>同一用户限领3次资源创建奖励，同一账号、同一登陆设备、同一登陆IP均视为同一用户，对于非正常创建资源、展品的用户，Freelog有权取消其活动参与资格，并扣除相应奖励不予结算。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>参赛活动的节点需使用官方指定主题。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>活动期间Freelog会向每位用户发放***个***币，**币为虚拟货币，仅用于签约资源或展品，不可提现。活动结束后，**币会被清零，换以人民币进行资源或展品交易。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
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
              <span>参赛漫画资源需选择添加 <b>#内测集结！漫画家召集令#</b> 活动标签，且需大于8张图片内容，以JPG、PNG长图格式创建发行；小说资源需选择添加 <b>#内测集结！小说家召集令#</b> 活动标签，内容需大于1500个字，以TXT格式创建发行。官方将根据资源所添加的活动标签进行对应奖项评选，如未添加活动标签将不计入活动之中。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>参赛资源需符合</span>
              <a
                href={'https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2'}
                target='_blank'
              >《Freelog平台管理规范》</a>
              <span>，非合规资源平台有权取消其参赛资格并扣除奖励不予发放。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>同一参赛资源不能由多人提交，重复参加。如资源内容由多位作者共同创作，只能由一人提交参与活动，如作品获奖，奖金将发放给提交资源内容的资源作者。</span>
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.regulationItem}>
            <div className={styles.circle} />
            <div style={{ width: 15 }} />
            <div className={styles.text}>
              <span>禁止一切违规刷数据的行为，如参赛资源存在刷数据的情况，则将被视为无效资源，取消活动参与资格。</span>
            </div>
          </div>
        </div>
        <div style={{ height: 60 }} />
      </div>
    </FModal>

    <FComponentsLib.FPageFooter PopoverPatch={Popover} />

  </div>);
}

export default ResourceCompetition;
