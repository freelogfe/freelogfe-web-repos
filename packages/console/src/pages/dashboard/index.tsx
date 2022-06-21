import * as React from 'react';
import styles from './index.less';
import { FAdd, FInfo, FWarning } from '@/components/FIcons';
import { Space } from 'antd';
import { FTextBtn } from '@/components/FButton';
import { FContentText, FTitleText } from '@/components/FText';
import FFormLayout from '@/components/FFormLayout';
import img_Questionnaire from '@/assets/questionnaire.png';
import img_Invite from '@/assets/invite.png';
import FContent from '@/components/FIcons/FContent';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import BoardCard from './BoardCard';
import FLoudspeaker from '@/components/FIcons/FLoudspeaker';
import * as AHooks from 'ahooks';
import { connect, Dispatch } from 'dva';
import { ConnectState, DashboardPageModelState } from '@/models/connect';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/dashboardPage';
import { FUtil } from '@freelog/tools-lib';

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
    <div className={styles.notice}>
      <div className={styles.noticeContent}>
        <Space size={10}>
          <FLoudspeaker style={{ color: '#2784FF' }} />
          <span>系统维护通知：2月1日至3日进行系统维护。</span>
        </Space>
        <Space size={15}>
          <span>2020/12/23</span>
          <FTextBtn type='primary'>查看详情</FTextBtn>
        </Space>
      </div>
    </div>
    <div className={styles.title}>
      <div style={{ height: 50 }} />
      <div className={styles.title1}>
        <span>萌新任务，完成即领20元现金奖励！</span>
        <FTextBtn>
          <FInfo />
          <span style={{ display: 'inline-block', paddingLeft: 5 }}>活动说明</span>
        </FTextBtn>
      </div>
      <div style={{ height: 20 }} />
      <div className={styles.title2}>
        完成下列萌新任务，不仅可以快速了解“如何创建资源、如何通过Freelog对资源进行推广及变现”，还能领取20元现金奖励！<br />
        完成全部任务仅需**分钟，快开始萌新之旅吧~
      </div>
      <div style={{ height: 30 }} />
      <BoardCard />
      <div style={{ height: 50 }} />
    </div>

    <div style={{ height: 40 }} />
    <div className={styles.statistics}>
      <div className={styles.statisticsContent}>
        <div className={styles.statisticsLeft}>
          <FTitleText text={'资源'} />
          <div style={{ height: 20 }} />
          <div className={styles.statisticsLeft_Panel}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'数据总览'}
              >
                <div className={styles.statisticsLeft_Panel_Total}>
                  <span>{dashboardPage.resourceStatistic.totalProfit}</span>
                  <FContentText text={'总收益（枚）'} type='normal' />
                </div>
                <div style={{ height: 10 }} />
                <Space size={20} className={styles.statisticsLeft_Panel_Week}>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日收益（枚）</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={dashboardPage.resourceStatistic.lastWeekProfit} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日签约量</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={dashboardPage.resourceStatistic.lastWeekContract} type='h1' />
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
                  <FTextBtn
                    onClick={() => {
                      window.open(FUtil.LinkTo.resourceCreator());
                    }}
                    type='default'>
                    <FAdd style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>新资源</span>
                  </FTextBtn>

                  <FTextBtn
                    onClick={() => {
                      window.open(FUtil.LinkTo.myResources());
                    }}
                    type='default'>
                    <FContent style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>查看全部</span>
                  </FTextBtn>
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
                        <FContentText
                          style={{ width: 250 }}
                          text={lr.resourceName}
                          type='highlight'
                          singleRow
                        />
                        <div style={{ height: 8 }} />
                        <FContentText text={lr.type} />
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
                        <FContentText
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
          <FTitleText text={'节点'} />
          <div style={{ height: 20 }} />
          <div className={styles.statisticsLeft_Panel}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'节点'}
              >
                <div className={styles.statisticsLeft_Panel_Total}>
                  <span>{dashboardPage.nodeStatistic.totalProfit}</span>
                  <FContentText text={'总收益（枚）'} type='normal' />
                </div>
                <div style={{ height: 10 }} />
                <Space size={20} className={styles.statisticsLeft_Panel_Week}>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日收益（枚）</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={dashboardPage.nodeStatistic.lastWeekProfit} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日签约量</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={dashboardPage.nodeStatistic.lastWeekContract} type='h1' />
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
                extra={<FTextBtn
                  type='default'
                  onClick={() => {
                    window.open(FUtil.LinkTo.nodeCreator());
                  }}
                >
                  <FAdd style={{ fontSize: 16 }} />
                  <span style={{ paddingLeft: 3, display: 'inline-block' }}>新节点</span>
                </FTextBtn>}
              >
                <div className={styles.nodeList}>
                  {
                    dashboardPage.allNode.map((an) => {
                      return (<div key={an.nodeID} className={styles.node}>
                        <FContentText text={an.nodeName} type='highlight' />
                        <Space size={20}>
                          <FTextBtn
                            type='primary'
                            onClick={() => {
                              window.open(an.displayUrl);
                            }}
                          >打开节点</FTextBtn>
                          <FTextBtn
                            type='primary'
                            onClick={() => {
                              window.open(an.managingUrl);
                            }}
                          >管理节点</FTextBtn>
                        </Space>
                      </div>);
                    })
                  }

                  {/*<div className={styles.node}>*/}
                  {/*  <FContentText text={'The official node of freelog'} type='highlight' />*/}

                  {/*  <Space size={20}>*/}
                  {/*    <FTextBtn type='primary'>打开节点</FTextBtn>*/}
                  {/*    <FTextBtn type='primary'>管理节点</FTextBtn>*/}
                  {/*  </Space>*/}
                  {/*</div>*/}
                  {/*<div className={styles.node}>*/}
                  {/*  <FContentText text={'The official node of freelog'} type='highlight' />*/}

                  {/*  <Space size={20}>*/}
                  {/*    <FTextBtn type='primary'>打开节点</FTextBtn>*/}
                  {/*    <FTextBtn type='primary'>管理节点</FTextBtn>*/}
                  {/*  </Space>*/}
                  {/*</div>*/}
                </div>
              </FFormLayout.FBlock>
            </FFormLayout>
          </div>
        </div>
        <Space size={10} direction={'vertical'} className={styles.statisticsRight}>
          <a href={'#'} className={styles.imgCard}>
            <img src={img_Invite} alt={''} />
          </a>

          <a href={'#'} className={styles.imgCard}>
            <img src={img_Questionnaire} alt={''} />
          </a>

          <div className={styles.panelCard}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'我的节点'}
                extra={<FTextBtn type='default'>更多 &gt;</FTextBtn>}
              >
                <div className={styles.linkList}>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>如何创建资源？</a>
                  </div>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>如何创建节点？</a>
                  </div>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>Freelog有哪些使用场景？</a>
                  </div>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>资源作者和节点商有什么区别？</a>
                  </div>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>如何添加授权策略？</a>
                  </div>
                </div>
              </FFormLayout.FBlock>
            </FFormLayout>
          </div>

          <div className={styles.panelCard}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'热门讨论'}
                extra={<FTextBtn type='default'>更多 &gt;</FTextBtn>}
              >
                <div className={styles.linkList}>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>Freelog内测签到盖楼，完成签到和其他基础任务领6元现金奖励！</a>
                  </div>
                  <div className={styles.linkListItem}>
                    <i />
                    <span />
                    <a href={'#'}>Freelog内测等你来“找茬”，参与有机会赢取400元京东购物卡！</a>
                  </div>
                </div>
              </FFormLayout.FBlock>
            </FFormLayout>
          </div>

        </Space>
      </div>
    </div>

    <div style={{ height: 100 }} />
    <FComponentsLib.FPageFooter />
  </div>);
}

export default connect(({ dashboardPage }: ConnectState) => ({
  dashboardPage,
}))(Dashboard);
