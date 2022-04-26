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
import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';
import FCoverImage from '@/components/FCoverImage';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import BoardCard from './BoardCard';

interface DashboardProps {

}

function Dashboard({}: DashboardProps) {
  return (<div className={styles.dashboard}>
    <div className={styles.notice}>
      <div className={styles.noticeContent}>
        <Space size={10}>
          <FWarning />
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
                  <span>--</span>
                  <FContentText text={'总收益（元）'} type='normal' />
                </div>
                <div style={{ height: 10 }} />
                <div className={styles.statisticsLeft_Panel_Week}>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日收益（元）</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={'--'} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日签约量</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={'500'} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日浏览量</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={'500'} type='h1' />
                  </div>
                </div>
              </FFormLayout.FBlock>

              <FFormLayout.FBlock
                title={'最近发布'}
                extra={<Space size={25}>
                  <FTextBtn type='default'>
                    <FAdd style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>新资源</span>
                  </FTextBtn>

                  <FTextBtn type='default'>
                    <FContent style={{ fontSize: 16 }} />
                    <span style={{ paddingLeft: 3, display: 'inline-block' }}>查看全部</span>
                  </FTextBtn>
                </Space>}
              >
                <div className={styles.releasedResources}>
                  <div className={styles.releasedResourceCard}>
                    <div className={styles.releasedResourceCard_Cover}>
                      <FCoverImage src={''} width={260} style={{ borderRadius: 4 }} />

                      <div className={styles.releasedResourceCard_Cover_Footer}>
                        <FCoverFooterButtons buttons={[
                          {
                            type: 'resourceDetails',
                            fn() {
                              // onClickDetails && onClickDetails();
                            },
                          },
                          {
                            type: 'edit',
                            fn() {
                              // onClickEditing && onClickEditing();
                            },
                          },
                          {
                            type: 'update',
                            fn() {
                              // onClickRevision && onClickRevision();
                            },
                          },
                        ]} />
                      </div>
                    </div>
                    <div style={{ height: 10 }} />
                    <FContentText text={'桌面整理技巧'} type='highlight' singleRow />
                    <div style={{ height: 8 }} />
                    <FContentText text={'markdown'} />
                    <div style={{ height: 12 }} />
                    <F_Contract_And_Policy_Labels
                      data={[{
                        text: '免费',
                        dot: '',
                      }]}
                      singleRow
                    />
                    <div style={{ height: 15 }} />
                    <FContentText text={'2021/03/01 12:00'} type='additional2' />
                  </div>

                  <div className={styles.releasedResourceCard}>
                    <div className={styles.releasedResourceCard_Cover}>
                      <FCoverImage src={''} width={260} style={{ borderRadius: 4 }} />

                      <div className={styles.releasedResourceCard_Cover_Footer}>
                        <FCoverFooterButtons buttons={[
                          {
                            type: 'resourceDetails',
                            fn() {
                              // onClickDetails && onClickDetails();
                            },
                          },
                          {
                            type: 'edit',
                            fn() {
                              // onClickEditing && onClickEditing();
                            },
                          },
                          {
                            type: 'update',
                            fn() {
                              // onClickRevision && onClickRevision();
                            },
                          },
                        ]} />
                      </div>
                    </div>
                    <div style={{ height: 10 }} />
                    <FContentText text={'桌面整理技巧'} type='highlight' singleRow />
                    <div style={{ height: 8 }} />
                    <FContentText text={'markdown'} />
                    <div style={{ height: 12 }} />
                    <F_Contract_And_Policy_Labels
                      data={[{
                        text: '免费',
                        dot: '',
                      }]}
                      singleRow
                    />
                    <div style={{ height: 15 }} />
                    <FContentText text={'2021/03/01 12:00'} type='additional2' />
                  </div>

                  <div className={styles.releasedResourceCard}>
                    <div className={styles.releasedResourceCard_Cover}>
                      <FCoverImage src={''} width={260} style={{ borderRadius: 4 }} />

                      <div className={styles.releasedResourceCard_Cover_Footer}>
                        <FCoverFooterButtons buttons={[
                          {
                            type: 'resourceDetails',
                            fn() {
                              // onClickDetails && onClickDetails();
                            },
                          },
                          {
                            type: 'edit',
                            fn() {
                              // onClickEditing && onClickEditing();
                            },
                          },
                          {
                            type: 'update',
                            fn() {
                              // onClickRevision && onClickRevision();
                            },
                          },
                        ]} />
                      </div>
                    </div>
                    <div style={{ height: 10 }} />
                    <FContentText text={'桌面整理技巧'} type='highlight' singleRow />
                    <div style={{ height: 8 }} />
                    <FContentText text={'markdown'} />
                    <div style={{ height: 12 }} />
                    <F_Contract_And_Policy_Labels
                      data={[{
                        text: '免费',
                        dot: '',
                      }]}
                      singleRow
                    />
                    <div style={{ height: 15 }} />
                    <FContentText text={'2021/03/01 12:00'} type='additional2' />
                  </div>
                </div>

              </FFormLayout.FBlock>
            </FFormLayout>
          </div>

          <div style={{ height: 40 }} />
          <FTitleText text={'资源'} />
          <div style={{ height: 20 }} />
          <div className={styles.statisticsLeft_Panel}>
            <FFormLayout>
              <FFormLayout.FBlock
                title={'节点'}
              >
                <div className={styles.statisticsLeft_Panel_Total}>
                  <span>1087.5</span>
                  <FContentText text={'总收益（元）'} type='normal' />
                </div>
                <div style={{ height: 10 }} />
                <div className={styles.statisticsLeft_Panel_Week}>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日收益（元）</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={'500'} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日签约量</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={'500'} type='h1' />
                  </div>
                  <div className={styles.statisticsLeft_Panel_Week_Card}>
                    <span>近7日浏览量</span>
                    <div style={{ height: 10 }} />
                    <FTitleText text={'500'} type='h1' />
                  </div>
                </div>
              </FFormLayout.FBlock>

              <FFormLayout.FBlock
                title={'我的节点'}
                extra={<FTextBtn type='default'>
                  <FAdd style={{ fontSize: 16 }} />
                  <span style={{ paddingLeft: 3, display: 'inline-block' }}>新节点</span>
                </FTextBtn>}
              >
                <div className={styles.nodeList}>
                  <div className={styles.node}>
                    <FContentText text={'The official node of freelog'} type='highlight' />

                    <Space size={20}>
                      <FTextBtn type='primary'>打开节点</FTextBtn>
                      <FTextBtn type='primary'>管理节点</FTextBtn>
                    </Space>
                  </div>
                  <div className={styles.node}>
                    <FContentText text={'The official node of freelog'} type='highlight' />

                    <Space size={20}>
                      <FTextBtn type='primary'>打开节点</FTextBtn>
                      <FTextBtn type='primary'>管理节点</FTextBtn>
                    </Space>
                  </div>
                  <div className={styles.node}>
                    <FContentText text={'The official node of freelog'} type='highlight' />

                    <Space size={20}>
                      <FTextBtn type='primary'>打开节点</FTextBtn>
                      <FTextBtn type='primary'>管理节点</FTextBtn>
                    </Space>
                  </div>
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

  </div>);
}

export default Dashboard;
