import * as React from 'react';
import styles from './index.less';
// import { FInfo } from '@/components/FIcons';
import { Space } from 'antd';
import FFormLayout from '@/components/FFormLayout';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import BoardCard from './BoardCard';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, DashboardPageModelState } from '@/models/connect';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/dashboardPage';
import { FUtil } from '@freelog/tools-lib';
import Sider from './Sider';
import Notice from './Notice';
import FPopover from '@/components/FPopover';

interface DashboardProps {
  dispatch: Dispatch;
  dashboardPage: DashboardPageModelState;
}

function Dashboard({ dispatch, dashboardPage }: DashboardProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'dashboardPage/onMount_Page',
    });
  });

  AHooks.useMount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'dashboardPage/OnUnmount_Page',
    });
  });

  return (<div className={styles.dashboard}>

    <Notice />

    <div className={styles.title}>
      <div style={{ height: 50 }} />
      <div className={styles.title1}>
        <span>萌新任务，完成即领20元现金奖励！</span>
        <FPopover
          placement='bottomRight'
          content={<div>
            <div style={{ display: 'flex' }}>
              <i
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  marginTop: 8,
                  marginRight: 5,
                  backgroundColor: '#666',
                }}
              />
              <FComponentsLib.FContentText
                text={'内测活动时间：*****'}
                type='normal'
              />
            </div>
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex' }}>
              <i
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  marginTop: 8,
                  marginRight: 5,
                  backgroundColor: '#666',
                }}
              />
              <FComponentsLib.FContentText
                text={'「基础任务」中的邀请1位好友奖励和「邀请好友」活动中的奖励可重复领取。'}
                type='normal'
              />
            </div>
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex' }}>
              <i
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  marginTop: 8,
                  marginRight: 5,
                  backgroundColor: '#666',
                }}
              />
              <FComponentsLib.FContentText
                text={'分别完成下方的基础任务、资源任务和节点任务，即可领取对应的现金奖励。'}
                type='normal'
              />
            </div>
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex' }}>
              <i
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  marginTop: 8,
                  marginRight: 5,
                  backgroundColor: '#666',
                }}
              />
              <FComponentsLib.FContentText
                text={'完成【基础任务】中的【完善个人信息】【 Freelog社区签到】两个小任务，可额外各获得一个邀请名额'}
                type='normal'
              />
            </div>
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <i
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  marginTop: 8,
                  marginRight: 5,
                  backgroundColor: '#666',
                }}
              />
              <FComponentsLib.FContentText
                text={'可通过'}
                type='normal'
              />
              <FComponentsLib.FTextBtn onClick={() => {
                self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.reward());
              }}>【个人中心】—【活动奖励】</FComponentsLib.FTextBtn>
              <FComponentsLib.FContentText
                text={'，将内测期间领取的现金奖励申请提现至微信钱宝。'}
                type='normal'
              />
            </div>
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex' }}>
              <i
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  marginTop: 8,
                  marginRight: 5,
                  backgroundColor: '#666',
                }}
              />
              <FComponentsLib.FContentText
                text={'活动的最终解释权归Freelog所有。'}
                type='normal'
              />
            </div>
          </div>}
        ><span>
          <FComponentsLib.FTextBtn>
            <FComponentsLib.FIcons.FInfo />
            <span style={{ display: 'inline-block', paddingLeft: 5 }}>活动说明</span>
          </FComponentsLib.FTextBtn>
        </span></FPopover>

      </div>
      <div style={{ height: 20 }} />
      <div className={styles.title2}>
        完成下列萌新任务，不仅可以快速了解“如何创建资源、如何通过Freelog对资源进行推广及变现”，还能领取20元现金奖励！<br />
        完成全部任务仅需9分钟，快开始萌新之旅吧~
      </div>
      <div style={{ height: 30 }} />
      <BoardCard />
      <div style={{ height: 50 }} />
    </div>

    <div style={{ height: 40 }} />
    <div className={styles.statistics}>
      <div className={styles.statisticsContent}>
        <div className={styles.statisticsLeft}>
          <FComponentsLib.FTitleText text={'资源'} />
          <div style={{ height: 20 }} />
          <div className={styles.statisticsLeft_Panel}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'数据总览'}
              >
                <div className={styles.statisticsLeft_Panel_Total}>
                  <span>{dashboardPage.resourceStatistic.totalProfit}</span>
                  <FComponentsLib.FContentText text={'总收益（枚）'} type='normal' />
                </div>
                <div style={{ height: 10 }} />
                <Space size={20} className={styles.statisticsLeft_Panel_Week}>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日收益（枚）</span>
                    <div style={{ height: 10 }} />
                    <FComponentsLib.FTitleText text={dashboardPage.resourceStatistic.lastWeekProfit} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日签约量</span>
                    <div style={{ height: 10 }} />
                    <FComponentsLib.FTitleText text={dashboardPage.resourceStatistic.lastWeekContract} type='h1' />
                  </div>
                  {/*<div className={styles.statisticsLeft_Panel_Week_Card}>*/}
                  {/*  <span>近7日浏览量</span>*/}
                  {/*  <div style={{ height: 10 }} />*/}
                  {/*  <FTitleText text={'500'} type='h1' />*/}
                  {/*</div>*/}
                </Space>
              </FFormLayout.FBlock>

              <FFormLayout.FBlock
                title={'最近发布'}
                extra={<Space size={25}>
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      window.open(FUtil.LinkTo.resourceCreator());
                    }}
                    type='default'>
                    <FComponentsLib.FIcons.FAdd style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>新资源</span>
                  </FComponentsLib.FTextBtn>

                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      window.open(FUtil.LinkTo.myResources());
                    }}
                    type='default'>
                    <FComponentsLib.FIcons.FContent style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>查看全部</span>
                  </FComponentsLib.FTextBtn>
                </Space>}
              >
                <div className={styles.releasedResources}>
                  {
                    dashboardPage.latestResources.map((lr) => {
                      return (<div key={lr.resourceID} className={styles.releasedResourceCard}>
                        <div className={styles.releasedResourceCard_Cover}>
                          <FCoverImage src={lr.cover} width={260} style={{ borderRadius: 4 }} />

                          <div className={styles.releasedResourceCard_Cover_Footer}>
                            <FCoverFooterButtons buttons={[
                              {
                                type: 'resourceDetails',
                                fn() {
                                  window.open(lr.detailUrl);
                                },
                              },
                              {
                                type: 'edit',
                                fn() {
                                  window.open(lr.editUrl);
                                },
                              },
                              {
                                type: 'update',
                                fn() {
                                  window.open(lr.updateUrl);
                                },
                              },
                            ]} />
                          </div>
                        </div>
                        <div style={{ height: 10 }} />
                        <FComponentsLib.FContentText
                          style={{ width: 250 }}
                          text={lr.resourceName}
                          type='highlight'
                          singleRow
                        />
                        <div style={{ height: 8 }} />
                        <FComponentsLib.FContentText text={FUtil.Format.resourceTypeKeyArrToResourceType(lr.type)} />
                        <div style={{ height: 12 }} />
                        <FComponentsLib.F_Contract_And_Policy_Labels
                          data={lr.policies.map((p) => {
                            return {
                              text: p,
                              dot: '',
                            };
                          })}
                          singleRow
                        />
                        <div style={{ height: 15 }} />
                        <FComponentsLib.FContentText
                          text={lr.dataTime}
                          type='additional2'
                        />
                      </div>);
                    })
                  }

                </div>

              </FFormLayout.FBlock>
            </FFormLayout>
          </div>

          <div style={{ height: 40 }} />
          <FComponentsLib.FTitleText text={'节点'} />
          <div style={{ height: 20 }} />
          <div className={styles.statisticsLeft_Panel}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'节点'}
              >
                <div className={styles.statisticsLeft_Panel_Total}>
                  <span>{dashboardPage.nodeStatistic.totalProfit}</span>
                  <FComponentsLib.FContentText text={'总收益（枚）'} type='normal' />
                </div>
                <div style={{ height: 10 }} />
                <Space size={20} className={styles.statisticsLeft_Panel_Week}>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日收益（枚）</span>
                    <div style={{ height: 10 }} />
                    <FComponentsLib.FTitleText text={dashboardPage.nodeStatistic.lastWeekProfit} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日签约量</span>
                    <div style={{ height: 10 }} />
                    <FComponentsLib.FTitleText text={dashboardPage.nodeStatistic.lastWeekContract} type='h1' />
                  </div>
                  {/*<div className={styles.statisticsLeft_Panel_Week_Card}>*/}
                  {/*  <span>近7日浏览量</span>*/}
                  {/*  <div style={{ height: 10 }} />*/}
                  {/*  <FTitleText text={'500'} type='h1' />*/}
                  {/*</div>*/}
                </Space>
              </FFormLayout.FBlock>

              <FFormLayout.FBlock
                title={'我的节点'}
                extra={<FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    window.open(FUtil.LinkTo.nodeCreator());
                  }}
                >
                  <FComponentsLib.FIcons.FAdd style={{ fontSize: 16 }} />
                  <span style={{ paddingLeft: 3, display: 'inline-block' }}>新节点</span>
                </FComponentsLib.FTextBtn>}
              >
                <div className={styles.nodeList}>
                  {
                    dashboardPage.allNode.map((an) => {
                      return (<div key={an.nodeID} className={styles.node}>
                        <FComponentsLib.FContentText text={an.nodeName} type='highlight' />
                        <Space size={20}>
                          <FComponentsLib.FTextBtn
                            type='primary'
                            onClick={() => {
                              window.open(an.displayUrl);
                            }}
                          >打开节点</FComponentsLib.FTextBtn>
                          <FComponentsLib.FTextBtn
                            type='primary'
                            onClick={() => {
                              window.open(an.managingUrl);
                            }}
                          >管理节点</FComponentsLib.FTextBtn>
                        </Space>
                      </div>);
                    })
                  }
                </div>
              </FFormLayout.FBlock>
            </FFormLayout>
          </div>
        </div>

        <Sider />
      </div>
    </div>

    <div style={{ height: 100 }} />
    <FComponentsLib.FPageFooter />
  </div>);
}

export default connect(({ dashboardPage }: ConnectState) => ({
  dashboardPage,
}))(Dashboard);
