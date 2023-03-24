import * as React from 'react';
import './index.less';
import banner from '@/assets/testplay/banner.png';
import cartoon from '@/assets/testplay/cartoon.png';
import cash from '@/assets/testplay/cash.png';
import invite from '@/assets/testplay/invite.png';
import jointitle from '@/assets/testplay/jointitle.png';
import New from '@/assets/testplay/new.png';
import profiletitle from '@/assets/testplay/profiletitle.png';
import quest from '@/assets/testplay/quest.png';
import redpacket from '@/assets/testplay/redpacket.png';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FFooter from '@/components/Footer';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';


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
  return (
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
      {/*<div className='h-664 over-h'>*/}
      <img src={banner} alt='' style={{ height: 650 }} />
      {/*</div>*/}
      <div className='profile-wrap w-100x'>
        <div className=' flex-column align-center pt-60 px-190 profile'>
          <div className='h-50 over-h mb-50'>
            <img src={profiletitle} alt='' className='h-100x' />
          </div>
          <div className='flex-row space-between w-100x'>
            <div className='flex-column'>
              <div className='flex-row align-center mb-40'>
                <div className='titleLabel mt-' />
                <span className='title'>创建、发行资源</span>
              </div>
              <div className='flex-row mb-27'>
                <div className='titleLabel2' />
                <span className='title2'>
                  资源作者可通过创建、发行优质数字资源获取资源变现收益
                </span>
              </div>
              <div className='flex-row mb-27'>
                <div className='titleLabel2' />
                <span className='title2'>Freelog平台不参与分成</span>
              </div>
              <div className='flex-row mb-27'>
                <div className='titleLabel2' />
                <span className='title2'>资源作者可100%独享资源变现收益</span>
              </div>
              <div className='flex-row  mb-45'>
                <div className='titleLabel2' />
                <span className='title2'>
                  内测期间成功创建发行一个资源还可领取7元现金奖
                </span>
              </div>
              <div className='flex-row '>
                <div className='titleLabel2 op-0' />
                <a
                  // href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  href={FI18n.i18nNext.t(
                    'beta_event_guideline_resouce_quickstart_link',
                  )}
                  target={'_blank'}
                  className='link mr-40'
                >
                  <span>查看图文教程</span>
                  <i className={'freelog fl-icon-tuwen ml-5'} />
                </a>
                <a
                  href={FI18n.i18nNext.t(
                    'beta_event_guideline_resouce_demo_link',
                  )}
                  target={'_blank'}
                  className='link'
                >
                  <span>查看视频教程</span>
                  <i className={'freelog fl-icon-bofang-daibiankuang ml-5'} />
                </a>
              </div>
            </div>
            <div className='flex-column'>
              <div className='flex-row align-center mb-25'>
                <div className='titleLabel' />
                <span className='title'>创建节点、添加展品</span>
              </div>
              <div className='flex-row  mb-15'>
                <div className='titleLabel2' />
                <span className='title2'>
                  节点商是平台资源的整合、运营推广者
                </span>
              </div>
              <div className='flex-row  mb-15'>
                <div className='titleLabel2' />
                <span className='title2'>
                  通过创建节点，签约已发行的资源为展品，将漫画、小说等资源以展品的形式推广给资源消费者，利用自媒体流量优势获取中间收益
                </span>
              </div>
              <div className='flex-row  mb-15'>
                <div className='titleLabel2' />
                <span className='title2'>
                  资源作者可同时创建节点为节点商，签约推广自己或他人的优质资源
                </span>
              </div>
              <div className='flex-row  mb-30'>
                <div className='titleLabel2' />
                <span className='title2'>
                  内测期间成功创建节点、添加展品还可领取7元现金奖
                </span>
              </div>
              <div className='flex-row '>
                <div className='titleLabel2 op-0' />
                <a
                  // href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  href={FI18n.i18nNext.t(
                    'beta_event_guideline_node_quickstart_link',
                  )}
                  target={'_blank'}
                  className='link mr-40'
                >
                  <span>查看图文教程</span>
                  <i className={'freelog fl-icon-tuwen ml-5'} />
                </a>
                <a
                  // href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  href={FI18n.i18nNext.t('beta_event_guideline_node_demo_link')}
                  target={'_blank'}
                  className='link'
                >
                  <span>查看视频教程</span>
                  <i className={'freelog fl-icon-bofang-daibiankuang ml-5'} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id='inner-test' className='h-60 push-test w-100x' />
      <div className='w-100x test-wrap' style={{ zIndex: 20 }}>
        <div className=' flex-column align-center py-60 pl-190 pr-160 test'>
          <div className='h-50 over-h mb-60'>
            <img src={jointitle} alt='' className='h-100x' />
          </div>
          <div className='flex-row space-between w-100x'>
            <div className='flex-column'>
              <span className='title'>一、内测集结！漫画、小说家召集令</span>
              <span className='title-grey mb-15'>活动时间</span>
              <span
                className='content mb-30'>{activityDetailsPage.startTime?.format('YYYY/MM/DD') || 'YYYY/MM/DD'}～{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY/MM/DD'}</span>
              <span className='title-grey mb-15'>活动内容</span>
              <span className='content mb-15'>
                1. 创建并发行一个合规漫画或小说资源，选择添加对应的活动标签；
              </span>
              <span className='content mb-30'>
                2. 签约参赛资源为展品，按照展品的被签约总次数排名。
              </span>
              <span className='title-grey mb-8'>活动奖励</span>
              <span className='title-yellow mb-4'>大触奖</span>
              <span className='content2'>
                小说和漫画两个赛道中，展品被签约总次数排名第一的资源作者，可分别获得2000元现金奖
              </span>
              <span className='title-yellow mb-4'>大触宣发奖</span>
              <span className='content2'>
                参赛资源可被不同节点商签约为展品，荣获大触奖展品的节点商可参与瓜分888元现金奖
              </span>
              <span className='title-yellow mb-4'>优秀奖</span>
              <span className='content2'>
                两个赛道中，展品被签约总次数排名第2—10名的资源作者，可分别参与瓜分3500元现金奖
              </span>
              <span className='title-yellow mb-4'>优秀宣发奖</span>
              <span className='content2'>
                荣获优秀奖展品的节点商可参与瓜分888元现金奖
              </span>
              <span className='title-yellow mb-4'>普照奖</span>
              <span className='content2'>
                每创建并发行1个合规资源可领取5—20元现金奖励，其中游戏类资源可获得20元，
                漫画、小说、图片等其他类型可获得5元(同一用户限领3次资源发行奖励)
              </span>
              <span className='title-yellow mb-4'>幸运奖</span>
              <span className='content2'>
                每周抽取一位上周参与排名活动的幸运鹅，赠送价值100元的京东购物卡
              </span>
            </div>
            <div className='flex-column align-center'>
              <div className='h-360 over-h mt-38'>
                <img src={cartoon} alt='' className='h-100x' />
              </div>
              <div className='text-align-center mt-60 mb-70'>
                <a
                  href={FI18n.i18nNext.t('beta_event_guideline_contest_link')}
                  target={'_blank'}
                  className='link '
                >
                  <span>快快戳我了解详情参与活动吧！</span>
                  <i className={'freelog fl-icon-qianjin ml-5'} />
                </a>
              </div>

              <div className='tip w-400'>
                资源创作赛活动仅限漫画、小说类资源参与，无具体类型、主题要求，可直接发布往期作品参赛！
              </div>
              <div className='tip w-400'>
                普照奖不限资源类型，上传漫画、小说、图片、游戏、视频、音乐、功能性插件等类型资源均可。
              </div>
            </div>
          </div>
          <div className='flex-row space-between w-100x align-center mb-30 mt-75'>
            <div className='h-360 over-h'>
              <img src={New} alt='' className='h-100x' />
            </div>
            <div className='flex-column align-center w-600 mr-30'>
              <div className='title'>二、萌新任务，完成即领20元现金奖</div>
              <div className='content mt-30 text-break text-align-center'>
                内测活动期间，完成萌新任务中的【基础任务】、【资源任务】、【节点任务】不仅可以快速了解“如何创建发行资源、如何通过Freelog对资源进行推广变现”，
              </div>
              <div className='content text-break text-align-center'>
                还能领取20元现金奖励！
              </div>

              <a
                target={'_blank'}
                href={
                  FUtil.Format.completeUrlByDomain('console') +
                  FUtil.LinkTo.dashboard()
                }
                className='link mt-30'
              >
                <span>完成全部任务仅需9分钟，快戳我领现金奖励吧！</span>
                <i className={'freelog fl-icon-qianjin ml-5'} />
              </a>
            </div>
          </div>
          <div className='flex-row space-between w-100x align-center mb-30 '>
            <div className='flex-column align-center w-600 ml-30'>
              <div className='title'>三、邀请好友，领20元现金奖</div>
              <div className='content mt-30 text-break text-align-center'>
                邀请好友参与Freelog内测，累计可领20元现金奖励，好友完成指定任务可额外领取3元现金奖励，同时抽取5位成功邀请好友的用户赠送价值400元的京东购物卡！
              </div>
              <div className='content text-break text-align-center'>
                还能领取20元现金奖励！
              </div>
              <a
                href={FI18n.i18nNext.t('beta_event_guideline_referral_link')}
                target={'_blank'}
                className='link mt-30'
              >
                <span>内测活动仅限800人，快快戳我邀请好友参加吧！</span>
                <i className={'freelog fl-icon-qianjin ml-5'} />
              </a>
            </div>
            <div className='h-360 over-h'>
              <img src={invite} alt='' className='h-100x' />
            </div>
          </div>
          <div className='flex-row space-between w-100x align-center '>
            <div className='h-360 over-h'>
              <img src={quest} alt='' className='h-100x' />
            </div>
            <div className='flex-column align-center w-600 mr-30'>
              <div className='title'>四、参与问卷调研，领6元现金奖</div>
              <div className='content mt-30 text-break text-align-center'>
                完成新手任务中的【资源任务】或【节点任务】后，参与用户问卷调研，即可领取6元现金奖，建设性意见或建议被采纳，可额外领取15元现金奖励！
              </div>
              <div className='content text-break text-align-center'>
                还能领取20元现金奖励！
              </div>
              <a
                href={FI18n.i18nNext.t('beta_event_guideline_survey_link')}
                target={'_blank'}
                className='link mt-30'
              >
                <span>快快戳我参与问卷领取现金奖吧！</span>
                <i className={'freelog fl-icon-qianjin ml-5'} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <FFooter />
    </div>
  );
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(PlayNewer);
