import * as React from 'react';
import './index.less';
import styles from './index.less';
import img_banner from '@/assets/activity/guidebook/banner@2x.png';
import img_officer from '@/assets/activity/guidebook/officer@2x.png';
import cartoon from '@/assets/testplay/cartoon.png';
import cash from '@/assets/testplay/cash.png';
import invite from '@/assets/testplay/invite.png';
import New from '@/assets/testplay/new.png';
import quest from '@/assets/testplay/quest.png';
import redpacket from '@/assets/testplay/redpacket.png';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FFooter from '@/components/Footer';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';

// import FComposition from '../../../../../../@freelog/components-lib/src/FIcons/FComposition';

interface PlayNewerProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function PlayNewer({ activityDetailsPage }: PlayNewerProps) {
  const scrollToAnchor = (anchorName: any) => {
    let state: any = {
      behavior: 'smooth',
      block: 'start',
    };
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView(state);
      }
    }
  };
  return (<>
    {/*<div className={styles.styles}>*/}
    {/*  <img src={banner} alt='' style={{ width: 1440 }} />*/}
    {/*</div>*/}
    <div className={'play-newer w-100x h-100x flex-column align-center'}>
      <div
        className='red-pack flex-row align-center p-15'
        onClick={() => scrollToAnchor('inner-test')}
      >
        <div className='h-40 over-h packet'>
          <img src={redpacket} alt='' className='h-100x' />
        </div>
        <div className='h-24 over-h ml-14 flex-row'>
          <div className='cash' />
          <img src={cash} alt='' className='h-100x' />
        </div>
      </div>
      <img src={img_banner} alt='' style={{ height: 650 }} />
      <div id='inner-test' className='h-60 push-test w-100x' />
      <div className='w-100x test-wrap' style={{ zIndex: 20 }}>
        <div className=' flex-column align-center py-60 pl-190 pr-160 test'>
          {/*<div className='h-50 over-h mb-60'>*/}
          {/*  <img src={jointitle} alt='' className='h-100x' />*/}
          {/*</div>*/}
          <div className='flex-row space-between w-100x'>
            <div className='flex-column'>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
                <FComponentsLib.FTitleText text={'一、解锁体验官积分玩法，'} type={'h1'} />
                <label style={{ fontSize: 34, color: '#E9A923', fontWeight: 600, lineHeight: 1 }}>¥2000</label>
                <FComponentsLib.FTitleText text={'现金大奖等你拿'} type={'h1'} />
              </div>
              {/*<span className='title'>一、解锁体验官积分玩法，&nbsp;<label*/}
              {/*  style={{ fontSize: 34, color: '#E9A923', fontWeight: 600 }}>2000元</label>&nbsp;现金大奖等你拿</span>*/}
              {/*<span className='title-grey mb-15'>活动时间</span>*/}
              <FComponentsLib.FContentText text={'活动时间'} type={'normal'} style={{ opacity: .4 }} />
              <div style={{ height: 15 }} />
              <FComponentsLib.FContentText
                text={(activityDetailsPage.startTime?.format('YYYY/MM/DD') || 'YYYY/MM/DD')
                + '～'
                + (activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY/MM/DD')}
                type={'highlight'}
              />
              <div style={{ height: 30 }} />
              {/*<span*/}
              {/*  className='content mb-30'>{activityDetailsPage.startTime?.format('YYYY/MM/DD') || 'YYYY/MM/DD'}～{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY/MM/DD'}</span>*/}
              {/*<span className='title-grey mb-15'>活动内容</span>*/}
              <FComponentsLib.FContentText text={'活动内容'} type={'normal'} style={{ opacity: .4 }} />
              <div style={{ height: 15 }} />

              <FComponentsLib.FContentText
                text={' 1. 填写招募问卷，获内测体验官资格，首批体验官名额仅限200名，先到先得！'}
                type={'highlight'}
              />
              <div style={{ height: 15 }} />
              <FComponentsLib.FContentText
                text={' 2. 3步玩转体验官积分，获得体验官专属福利，更有机会赢取现金大奖。'}
                type={'highlight'}
              />
              {/*<span className='content mb-15'>*/}
              {/*  1. 填写招募问卷，获内测体验官资格，首批体验官名额仅限200名，先到先得！*/}
              {/*</span>*/}
              {/*<span className='content mb-30'>*/}
              {/*  2. 3步玩转体验官积分，获得体验官专属福利，更有机会赢取现金大奖。*/}
              {/*</span>*/}
              <div style={{ height: 30 }} />

              {/*<span className='title-grey mb-8'>现金大奖</span>*/}
              <FComponentsLib.FContentText text={'现金大奖'} type={'normal'} style={{ opacity: .4 }} />
              <div style={{ height: 15 }} />

              <div className={styles.row}>
                <div className={[styles.GoldSilverCopper, styles.gold].join(' ')}>金牌体验官</div>
                <div style={{ width: 120 }}>
                  <FComponentsLib.FContentText text={'金牌体验官 1名'} type={'highlight'} />
                </div>
                <FComponentsLib.FContentText text={'奖励¥2000'} type={'highlight'} />
              </div>

              <div style={{ height: 15 }} />

              <div className={styles.row}>
                <div className={[styles.GoldSilverCopper, styles.silver].join(' ')}>金牌体验官</div>
                <div style={{ width: 120 }}>
                  <FComponentsLib.FContentText text={'银牌体验官 2名'} type={'highlight'} />
                </div>
                <FComponentsLib.FContentText text={'奖励¥1000'} type={'highlight'} />
              </div>

              <div style={{ height: 15 }} />

              <div className={styles.row}>
                <div className={[styles.GoldSilverCopper, styles.copper].join(' ')}>金牌体验官</div>
                <div style={{ width: 120 }}>
                  <FComponentsLib.FContentText text={'铜牌体验官 5名'} type={'highlight'} />
                </div>
                <FComponentsLib.FContentText text={'奖励¥500'} type={'highlight'} />
              </div>

              <div style={{ height: 15 }} />

              <div className={styles.row}>
                <div style={{
                  width: 70,
                  height: 22,
                  padding: '0 5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
                  <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
                  <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: '#E9A923' }} />
                </div>
                <div style={{ width: 120 }}>
                  <FComponentsLib.FContentText text={'幸运体验官 20名'} type={'highlight'} />
                </div>
                <FComponentsLib.FContentText text={'奖励¥100'} type={'highlight'} />
              </div>
              <div style={{ height: 40 }} />
              <a
                href={FI18n.i18nNext.t('beta_event_guideline_contest_link')}
                target={'_blank'}
                className={styles.link}
              >
                <i>👉</i>
                <span> 快快戳我了解详情参与活动吧！</span>
                {/*<i className={'freelog fl-icon-qianjin ml-5'} />*/}
              </a>

              {/*<div className='text-align-center'>*/}
              {/*  */}
              {/*</div>*/}

            </div>
            <div className='flex-column align-center'>
              <div style={{ height: 500, display: 'flex', alignItems: 'center' }}>
                {/*<img src={img_officer} alt='' className='h-100x' />*/}
                <img src={img_officer} alt='' style={{ height: 360 }} />
              </div>


              {/*<div className='tip w-400'>*/}
              {/*  资源创作赛活动仅限漫画、小说类资源参与，无具体类型、主题要求，可直接发布往期作品参赛！*/}
              {/*</div>*/}
              {/*<div className='tip w-400'>*/}
              {/*  普照奖不限资源类型，上传漫画、小说、图片、游戏、视频、音乐、功能性插件等类型资源均可。*/}
              {/*</div>*/}
            </div>
          </div>
          <div className='flex-row space-between w-100x align-center mb-30 mt-75'>
            <div className='h-360 over-h'>
              <img src={New} alt='' className='h-100x' />
            </div>
            <div className='flex-column align-center w-600 mr-30'>
              {/*<div className='title'>二、完成新手任务，领&nbsp;<label*/}
              {/*  style={{ fontSize: 34, color: '#E9A923', fontWeight: 600 }}>20元</label>&nbsp;现金*/}
              {/*</div>*/}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
                <FComponentsLib.FTitleText text={'二、完成新手任务，领'} type={'h1'} />
                <label style={{ fontSize: 34, color: '#E9A923', fontWeight: 600, lineHeight: 1 }}>¥20</label>
                <FComponentsLib.FTitleText text={'现金'} type={'h1'} />
              </div>
              {/*<div className='content mt-30 text-break text-align-center'>*/}
              {/*  内测活动期间，完成萌新任务中的【基础任务】、【资源任务】、【节点任务】不仅可以快速了解“如何创建发行资源、如何通过Freelog对资源进行推广变现”，*/}
              {/*</div>*/}
              {/*<div className='content text-break text-align-center'>*/}
              {/*  还能领取20元现金奖励！*/}
              {/*</div>*/}
              <div style={{ height: 40 }} />
              <FComponentsLib.FContentText
                text={'完成萌新任务中的【基础任务】、【资源任务】、【节点任务】不仅可以快速了解“如何创建发行资源、如何通过Freelog对资源进行推广变现”，还能领取20元现金奖励！'}
                type={'highlight'}
                style={{ textAlign: 'center' }}
              />
              <div style={{ height: 35 }} />

              <a
                target={'_blank'}
                href={
                  FUtil.Format.completeUrlByDomain('console') +
                  FUtil.LinkTo.dashboard()
                }
                className={styles.link}
              >
                <i>👉</i>
                <span> 完成全部任务仅需9分钟，快戳我领现金奖励吧！</span>
                {/*<i className={'freelog fl-icon-qianjin ml-5'} />*/}
              </a>
            </div>
          </div>
          <div className='flex-row space-between w-100x align-center mb-30 '>
            <div className='w-600 ml-30'>
              <FComponentsLib.FTitleText text={'三、邀请好友参与内测，赢取额外现金奖励'} type={'h1'} />
              <div style={{ height: 10 }} />
              <FComponentsLib.FContentText
                text={'成功邀请好友成为Freelog内测体验官，即有机会获得最高120元奖励'}
                type={'additional2'}
                style={{ fontSize: 14 }}
              />
              <div style={{ height: 30 }} />
              <FComponentsLib.FContentText
                text={'1、邀请1名好友奖励现金3元，邀请2名好友奖励6元，邀请3名好友奖励10元，邀请4名好友奖励14元，邀请5名好友奖励20元；'}
                type={'highlight'}
              />
              <div style={{ height: 30 }} />
              <FComponentsLib.FContentText
                text={'2、成功邀请好友成为体验官的用户，平台也将额外抽取5位，赠送100元京东购物卡'}
                type={'highlight'}
              />
              <div style={{ height: 30 }} />

              {/*<div className='title'>三、邀请好友，赢&nbsp;<label*/}
              {/*  style={{ fontSize: 34, color: '#E9A923', fontWeight: 600 }}>400元</label>&nbsp;京东购物卡*/}
              {/*</div>*/}
              {/*<div className='content mt-30 text-break text-align-center'>*/}
              {/*  邀请好友参与Freelog内测，累计可领20元现金奖励，好友完成指定任务可额外领取3元现金奖励，同时抽取5位成功邀请好友的用户赠送价值400元的京东购物卡！*/}
              {/*</div>*/}
              {/*<div className='content text-break text-align-center'>*/}
              {/*  还能领取20元现金奖励！*/}
              {/*</div>*/}
              <a
                href={FI18n.i18nNext.t('beta_event_guideline_referral_link')}
                target={'_blank'}
                className={styles.link}
              >
                <i>👉</i>
                <span> 立即邀请好友</span>
                {/*<i className={'freelog fl-icon-qianjin ml-5'} />*/}
              </a>
            </div>
            <div className='h-360 over-h'>
              <img src={invite} alt='' className='h-100x' />
            </div>
          </div>
          {/*<div className='flex-row space-between w-100x align-center '>*/}
          {/*  <div className='h-360 over-h'>*/}
          {/*    <img src={quest} alt='' className='h-100x' />*/}
          {/*  </div>*/}
          {/*  <div className='flex-column align-center w-600 mr-30'>*/}
          {/*    <div className='title'>四、参与问卷调研，领&nbsp;<label*/}
          {/*      style={{ fontSize: 34, color: '#E9A923', fontWeight: 600 }}>6元</label>&nbsp;现金奖*/}
          {/*    </div>*/}
          {/*    <div className='content mt-30 text-break text-align-center'>*/}
          {/*      完成新手任务中的【资源任务】或【节点任务】后，参与用户问卷调研，即可领取6元现金奖，建设性意见或建议被采纳，可额外领取15元现金奖励！*/}
          {/*    </div>*/}
          {/*    <a*/}
          {/*      href={FI18n.i18nNext.t('beta_event_guideline_survey_link')}*/}
          {/*      target={'_blank'}*/}
          {/*      className='link mt-30'*/}
          {/*    >*/}
          {/*      <span>快快戳我参与问卷领取现金奖吧！</span>*/}
          {/*      <i className={'freelog fl-icon-qianjin ml-5'} />*/}
          {/*    </a>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
      <FFooter />
    </div>
  </>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(PlayNewer);
