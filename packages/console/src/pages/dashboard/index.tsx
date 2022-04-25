import * as React from 'react';
import styles from './index.less';
import { FInfo, FWarning } from '@/components/FIcons';
import { Space } from 'antd';
import { FTextBtn } from '@/components/FButton';
import { FContentText, FTitleText } from '@/components/FText';
import FUtil1 from '@/utils';
import FFormLayout from '@/components/FFormLayout';

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
      <div className={styles.boards}>
        <div className={styles.board1}>

        </div>
        <div className={styles.board2}>

        </div>
        <div className={styles.board3}>

        </div>
      </div>
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
              >

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
              >

              </FFormLayout.FBlock>
            </FFormLayout>
          </div>
        </div>
        <div className={styles.statisticsRight}>

        </div>
      </div>
    </div>

    <div style={{ height: 100 }} />

  </div>);
}

export default Dashboard;
