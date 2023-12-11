import * as React from 'react';
import styles from './index.less';
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
import { FI18n, FUtil } from '@freelog/tools-lib';
import Sider from './Sider';
import Notice from './Notice';
import FPopover from '@/components/FPopover';
import fNoviceGuide, {
  getNoviceGuide_LocalStorage_Content,
  setNoviceGuide_LocalStorage_Content,
  clear,
} from '@/components/fNoviceGuide';

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

  AHooks.useMount(async () => {

    const noviceGuide_LocalStorage_Content = getNoviceGuide_LocalStorage_Content('dashboardPage');
    if (noviceGuide_LocalStorage_Content === 'finished') {
      return;
    }

    await FUtil.Tool.promiseSleep(300);
    const header_createBtn = self.document.getElementById('header.createBtn');
    if (!header_createBtn) {
      return;
    }
    // console.log(header_createBtn.getClientRects(), 'header_createBtniojlksjdlfksjdlkj');
    const header_createBtn_ClientRects = header_createBtn.getClientRects()[0];
    // const
    const header_createBtn_result = await fNoviceGuide({
      windowInfo: {
        top: header_createBtn_ClientRects.y + 10,
        left: header_createBtn_ClientRects.x - 10,
        width: header_createBtn_ClientRects.width + 20,
        height: header_createBtn_ClientRects.height - 20,
      },
      title: FI18n.i18nNext.t('tours_dashboard_menu_create'),
      step: 1,
      total: 5,
    });

    // console.log(header_createBtn_result, 'header_createBtn_resultoisdjflksdjflkjl');
    if (!header_createBtn_result) {
      setNoviceGuide_LocalStorage_Content('dashboardPage', 'finished');
      return;
    }
    /******* 第二步 ******************/
    const dashboardPage_resource_data = self.document.getElementById('dashboardPage.resource.data');
    if (!dashboardPage_resource_data) {
      return;
    }
    dashboardPage_resource_data.scrollIntoView({
      // behavior: 'smooth',
      block: 'center',
    });
    // await FUtil.Tool.promiseSleep(300);
    const dashboardPage_resource_data_ClientRects = dashboardPage_resource_data.getClientRects()[0];

    const dashboardPage_resource_data_result = await fNoviceGuide({
      windowInfo: {
        top: dashboardPage_resource_data_ClientRects.y - 50,
        left: dashboardPage_resource_data_ClientRects.x - 10,
        width: dashboardPage_resource_data_ClientRects.width + 20,
        height: dashboardPage_resource_data_ClientRects.height + 50,
      },
      title: FI18n.i18nNext.t('tours_dashboard_section_resource_datas'),
      step: 2,
      total: 5,
    });

    if (!dashboardPage_resource_data_result) {
      setNoviceGuide_LocalStorage_Content('dashboardPage', 'finished');
      return;
    }

    /******* 第三步 ******************/
    const dashboardPage_resource_release = self.document.getElementById('dashboardPage.resource.release');
    if (!dashboardPage_resource_release) {
      return;
    }
    dashboardPage_resource_release.scrollIntoView({
      // behavior: 'smooth',
      block: 'center',
    });
    // await FUtil.Tool.promiseSleep(300);
    const dashboardPage_resource_release_ClientRects = dashboardPage_resource_release.getClientRects()[0];

    const dashboardPage_resource_release_result = await fNoviceGuide({
      windowInfo: {
        top: dashboardPage_resource_release_ClientRects.y - 50,
        left: dashboardPage_resource_release_ClientRects.x - 10,
        width: dashboardPage_resource_release_ClientRects.width + 20,
        height: dashboardPage_resource_release_ClientRects.height + 50,
      },
      title: FI18n.i18nNext.t('tours_dashboard_section_resource_list'),
      step: 3,
      total: 5,
    });

    if (!dashboardPage_resource_release_result) {
      setNoviceGuide_LocalStorage_Content('dashboardPage', 'finished');
      return;
    }

    /******* 第四步 ******************/
    const dashboardPage_node_data = self.document.getElementById('dashboardPage.node.data');
    if (!dashboardPage_node_data) {
      return;
    }
    dashboardPage_node_data.scrollIntoView({
      // behavior: 'smooth',
      block: 'center',
    });
    // await FUtil.Tool.promiseSleep(300);
    const dashboardPage_node_data_ClientRects = dashboardPage_node_data.getClientRects()[0];

    const dashboardPage_node_data_result = await fNoviceGuide({
      windowInfo: {
        top: dashboardPage_node_data_ClientRects.y - 50,
        left: dashboardPage_node_data_ClientRects.x - 10,
        width: dashboardPage_node_data_ClientRects.width + 20,
        height: dashboardPage_node_data_ClientRects.height + 50,
      },
      title: FI18n.i18nNext.t('tours_dashboard_section_node_datas'),
      step: 4,
      total: 5,
    });

    if (!dashboardPage_node_data_result) {
      setNoviceGuide_LocalStorage_Content('dashboardPage', 'finished');
      return;
    }

    /******* 第五步 ******************/
    const dashboardPage_node_release = self.document.getElementById('dashboardPage.node.release');
    if (!dashboardPage_node_release) {
      return;
    }
    dashboardPage_node_release.scrollIntoView({
      // behavior: 'smooth',
      block: 'center',
    });
    // await FUtil.Tool.promiseSleep(300);
    const dashboardPage_node_release_ClientRects = dashboardPage_node_release.getClientRects()[0];

    const dashboardPage_node_release_result = await fNoviceGuide({
      windowInfo: {
        top: dashboardPage_node_release_ClientRects.y - 50,
        left: dashboardPage_node_release_ClientRects.x - 10,
        width: dashboardPage_node_release_ClientRects.width + 20,
        height: dashboardPage_node_release_ClientRects.height + 50,
      },
      title: FI18n.i18nNext.t('tours_dashboard_section_node_list'),
      step: 5,
      total: 5,
    });

    // if (!dashboardPage_node_release_result) {
    setNoviceGuide_LocalStorage_Content('dashboardPage', 'finished');
    // return;
    // }
  });

  // console.log('*****8sdo;ifjlsdkjflkj');

  AHooks.useUnmount(() => {
    // console.log('CCCCcccc098rufijosdkj');
    clear();
  });


  return (<div className={styles.dashboard}>

    <Notice />

    {/*<div className={styles.title}>*/}
    {/*  <div style={{ height: 50 }} />*/}
    {/*  <div className={styles.title1}>*/}
    {/*    <span>萌新任务，完成即领20元现金奖励！</span>*/}
    {/*    <FPopover*/}
    {/*      placement='bottomRight'*/}
    {/*      content={<div>*/}
    {/*        <div style={{ display: 'flex' }}>*/}
    {/*          <i*/}
    {/*            style={{*/}
    {/*              width: 3,*/}
    {/*              height: 3,*/}
    {/*              borderRadius: '50%',*/}
    {/*              marginTop: 8,*/}
    {/*              marginRight: 5,*/}
    {/*              backgroundColor: '#666',*/}
    {/*              flexShrink: 0,*/}
    {/*            }}*/}
    {/*          />*/}
    {/*          <FComponentsLib.FContentText*/}
    {/*            text={'内测活动时间：' + FI18n.i18nNext.t('event_newbie_eventperiod')}*/}
    {/*            type='normal'*/}
    {/*          />*/}
    {/*        </div>*/}
    {/*        <div style={{ height: 15 }} />*/}
    {/*        <div style={{ display: 'flex' }}>*/}
    {/*          <i*/}
    {/*            style={{*/}
    {/*              width: 3,*/}
    {/*              height: 3,*/}
    {/*              borderRadius: '50%',*/}
    {/*              marginTop: 8,*/}
    {/*              marginRight: 5,*/}
    {/*              backgroundColor: '#666',*/}
    {/*              flexShrink: 0,*/}
    {/*            }}*/}
    {/*          />*/}
    {/*          <FComponentsLib.FContentText*/}
    {/*            text={'分别完成下方的基础任务、资源任务和节点任务，即可领取对应的现金奖励。'}*/}
    {/*            type='normal'*/}
    {/*          />*/}
    {/*        </div>*/}
    {/*        <div style={{ height: 15 }} />*/}
    {/*        <div style={{ display: 'flex' }}>*/}
    {/*          <i*/}
    {/*            style={{*/}
    {/*              width: 3,*/}
    {/*              height: 3,*/}
    {/*              borderRadius: '50%',*/}
    {/*              marginTop: 8,*/}
    {/*              marginRight: 5,*/}
    {/*              backgroundColor: '#666',*/}
    {/*            }}*/}
    {/*          />*/}
    {/*          <FComponentsLib.FContentText*/}
    {/*            text={'完成【基础任务】中的【查看Freelog使用教程】【 Freelog社区签到】两个小任务，可额外各获得一个邀请名额'}*/}
    {/*            type='normal'*/}
    {/*          />*/}
    {/*        </div>*/}
    {/*        <div style={{ height: 15 }} />*/}
    {/*        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>*/}
    {/*          <i*/}
    {/*            style={{*/}
    {/*              width: 3,*/}
    {/*              height: 3,*/}
    {/*              borderRadius: '50%',*/}
    {/*              marginTop: 8,*/}
    {/*              // marginRight: 5,*/}
    {/*              backgroundColor: '#666',*/}
    {/*              flexShrink: 0,*/}
    {/*            }}*/}
    {/*          />*/}
    {/*          <FComponentsLib.FContentText*/}
    {/*            text={'可通过'}*/}
    {/*            type='normal'*/}
    {/*          />*/}
    {/*          <FComponentsLib.FTextBtn onClick={() => {*/}
    {/*            self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.reward());*/}
    {/*          }}>【个人中心】—【活动奖励】</FComponentsLib.FTextBtn>*/}
    {/*          <FComponentsLib.FContentText*/}
    {/*            text={'，将内测期间获取的现金奖励提现至微信钱包。'}*/}
    {/*            type='normal'*/}
    {/*          />*/}
    {/*        </div>*/}
    {/*        <div style={{ height: 15 }} />*/}
    {/*        <div style={{ display: 'flex' }}>*/}
    {/*          <i*/}
    {/*            style={{*/}
    {/*              width: 3,*/}
    {/*              height: 3,*/}
    {/*              borderRadius: '50%',*/}
    {/*              marginTop: 8,*/}
    {/*              marginRight: 5,*/}
    {/*              backgroundColor: '#666',*/}
    {/*              flexShrink: 0,*/}
    {/*            }}*/}
    {/*          />*/}
    {/*          <FComponentsLib.FContentText*/}
    {/*            text={'活动的最终解释权归Freelog所有。'}*/}
    {/*            type='normal'*/}
    {/*          />*/}
    {/*        </div>*/}
    {/*      </div>}*/}
    {/*    ><span>*/}
    {/*      <FComponentsLib.FTextBtn>*/}
    {/*        <FComponentsLib.FIcons.FInfo />*/}
    {/*        <span style={{ display: 'inline-block', paddingLeft: 5 }}>活动说明</span>*/}
    {/*      </FComponentsLib.FTextBtn>*/}
    {/*    </span></FPopover>*/}

    {/*  </div>*/}
    {/*  <div style={{ height: 20 }} />*/}
    {/*  <div className={styles.title2}>*/}
    {/*    完成下列萌新任务，不仅可以快速了解“如何创建资源、如何通过Freelog对资源进行推广及变现”，还能领取20元现金奖励！<br />*/}
    {/*    完成全部任务仅需9分钟，快开始萌新之旅吧~*/}
    {/*  </div>*/}
    {/*  <div style={{ height: 30 }} />*/}
    {/*  <BoardCard />*/}
    {/*  <div style={{ height: 50 }} />*/}
    {/*</div>*/}

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
                <div id={'dashboardPage.resource.data'}>
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
                </div>
              </FFormLayout.FBlock>

              <FFormLayout.FBlock
                title={'最近发布'}
                extra={<Space size={25}>
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      self.open(FUtil.LinkTo.resourceCreator());
                    }}
                    type='default'>
                    <FComponentsLib.FIcons.FAdd style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>新资源</span>
                  </FComponentsLib.FTextBtn>

                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      self.open(FUtil.LinkTo.myResources());
                    }}
                    type='default'>
                    <FComponentsLib.FIcons.FContent style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>查看全部</span>
                  </FComponentsLib.FTextBtn>
                </Space>}
              >
                <div className={styles.releasedResources} id={'dashboardPage.resource.release'}>
                  {
                    dashboardPage.latestResources.length > 0 && dashboardPage.latestResources.map((lr) => {
                      return (<div key={lr.resourceID} className={styles.releasedResourceCard}>
                        <div className={styles.releasedResourceCard_Cover}>
                          <FCoverImage src={lr.cover} width={260} style={{ borderRadius: 4 }} />

                          <div className={styles.releasedResourceCard_Cover_Footer}>
                            <FCoverFooterButtons buttons={[
                              {
                                type: 'resourceDetails',
                                fn() {
                                  self.open(lr.detailUrl);
                                },
                              },
                              {
                                type: 'edit',
                                fn() {
                                  self.open(lr.editUrl);
                                },
                              },
                              {
                                type: 'update',
                                fn() {
                                  self.open(lr.updateUrl);
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

                  {
                    dashboardPage.latestResources.length === 0 && (<div style={{
                      height: 220,
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <FComponentsLib.FContentText text={'还未创建任何资源'} />
                      <div style={{ height: 20 }} />
                      <FComponentsLib.FRectBtn
                        onClick={() => {
                          self.open(FUtil.LinkTo.resourceCreator());
                        }}
                      >创建资源</FComponentsLib.FRectBtn>
                    </div>)
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
                <div id={'dashboardPage.node.data'}>
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
                </div>
              </FFormLayout.FBlock>

              <FFormLayout.FBlock
                title={'我的节点'}
                extra={<FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    self.open(FUtil.LinkTo.nodeCreator());
                  }}
                >
                  <FComponentsLib.FIcons.FAdd style={{ fontSize: 16 }} />
                  <span style={{ paddingLeft: 3, display: 'inline-block' }}>新节点</span>
                </FComponentsLib.FTextBtn>}
              >
                <div className={styles.nodeList} id={'dashboardPage.node.release'}>
                  {
                    dashboardPage.allNode.length > 0 && dashboardPage.allNode.map((an) => {
                      return (<div key={an.nodeID} className={styles.node}>
                        <FComponentsLib.FContentText text={an.nodeName} type='highlight' />
                        <Space size={20}>
                          <FComponentsLib.FTextBtn
                            type='primary'
                            onClick={() => {
                              self.open(an.displayUrl);
                            }}
                          >打开节点</FComponentsLib.FTextBtn>
                          <FComponentsLib.FTextBtn
                            type='primary'
                            onClick={() => {
                              self.open(an.managingUrl);
                            }}
                          >管理节点</FComponentsLib.FTextBtn>
                        </Space>
                      </div>);
                    })
                  }

                  {
                    dashboardPage.allNode.length === 0 && (<div style={{
                      height: 220,
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <FComponentsLib.FContentText text={'还未创建任何节点'} />
                      <div style={{ height: 20 }} />
                      <FComponentsLib.FRectBtn
                        onClick={() => {
                          self.open(FUtil.LinkTo.nodeCreator());
                        }}
                      >创建节点</FComponentsLib.FRectBtn>
                    </div>)
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
