import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FPopover from '@/components/FPopover';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import { FServiceAPI, FI18n } from '@freelog/tools-lib';

interface BoardCard1Props {
  unfold: boolean;

  onMouseEnter?(): void;
}

const tasks = {
  TS000011: {
    name: '查看Freelog使用教程',
    popoverContent: (<div className={styles.tooltipDisplay}>
      <FComponentsLib.FContentText
        text={'Freelog平台存在资源作者和节点商两个角色：'}
        type='highlight'
      />
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
          text={'「资源作者」可通过创建并发行资源获取收益；'}
          type='highlight'
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
          text={'「节点商」是资源的整合者，通过在节点展示推广资源获取中间人收益。'}
          type='highlight'
        />
      </div>
      <div style={{ height: 15 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <FComponentsLib.FContentText text={'查看'} />
        <a
          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
          target={'_blank'}
          type='primary'
        >资源作者使用教程</a>
        <FComponentsLib.FContentText text={'或'} />
        <a
          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
          target={'_blank'}
          type='primary'
        >节点商使用教程</a>
        <FComponentsLib.FContentText
          text={'，完整观看任一视频教程即可领取现金奖励！'}
          type='highlight'
        />
      </div>
    </div>),
    onClick() {
      self.open('https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f');
    },
  },
  TS000012: {
    name: '完善个人信息',
    popoverContent: (<div className={styles.tooltipDisplay}>
      <FComponentsLib.FContentText text={'完善【个人资料】中的基本信息即可，更了解你一点，才能为你提供更高质量的服务哦。'} type='highlight' />
    </div>),
    onClick() {
      self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.setting());
    },
  },
  TS000013: {
    name: 'Freelog社区签到',
    popoverContent: (<div className={styles.tooltipDisplay}>
      <FComponentsLib.FContentText text={'Freelog社区旨在为用户提供一个高质量内容的论坛社区，包括资源讨论、节点运营、产品吐槽等。'} type='highlight' />
    </div>),
    onClick() {
      // self.open('https://forum.freelog.com/topic/2/freelog%E5%86%85%E6%B5%8B%E7%AD%BE%E5%88%B0%E6%A5%BC-%E5%AE%8C%E6%88%90%E7%AD%BE%E5%88%B0%E5%8D%B3%E6%9C%89%E6%9C%BA%E4%BC%9A%E9%A2%866%E5%85%83%E7%8E%B0%E9%87%91%E5%A5%96%E5%8A%B1');
      self.open(FI18n.i18nNext.t('beta_newbie_link_1_3'));
    },
  },
  TS000014: {
    name: '激活羽币账户',
    popoverContent: (<div className={styles.tooltipDisplay}>
      <FComponentsLib.FContentText
        text={'「羽币」是Freelog平台的虚拟货币，不可提现，仅限在内测活动期间用于签约收费的资源或展品。活动结束后，羽币会被清零，换以人民币进行资源或展品授权交易。'} type='highlight' />
    </div>),
    onClick() {
      self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet());
    },
  },
  TS000015: {
    name: '邀请一位好友',
    popoverContent: (<div className={styles.tooltipDisplay}>
      <FComponentsLib.FContentText
        text={'参与【邀请好友活动】邀请更多好友参与Freelog内测，可重复领取邀请好友活动奖励， 且被邀请好友可领取3元现金奖励。'}
        type='highlight'
      />
    </div>),
    url: FI18n.i18nNext.t('event_newbie_invitefriend_link'),
    onClick() {
      self.open(FI18n.i18nNext.t('event_newbie_invitefriend_link'));
    },
  },
} as const;

function BoardCard1({ unfold, onMouseEnter }: BoardCard1Props) {

  const [dataSource, set_dataSource] = React.useState<any[]>([]);

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.getBaseTaskInfo();
    set_dataSource(data);
  });

  const needSteps: number = dataSource.filter((item: any) => item.status === 1).length;

  return (
    <div
      className={styles.board1}
      style={{ width: unfold ? 700 : 245 }}
      onMouseEnter={() => {
        onMouseEnter && onMouseEnter();
      }}
    >
      <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
        <div />
        <div className={styles.title1}>基础任务</div>
        <div className={styles.title2} style={{ height: unfold ? 60 : 150 }}>
          完成下列基础任务可以了解Freelog的基本功能，以便更顺畅的使用Freelog完成资源、节点创建和推广
        </div>
        {
          needSteps === 0
            ? (<div className={styles.title3} style={{ opacity: .5 }}>
              6元奖励已领取
            </div>)
            : (<div className={styles.title3}>
              还差{needSteps}步领取 <span>6元</span> 奖励
            </div>)
        }
        <div />
      </div>
      <div className={styles.tasks}>
        {
          dataSource.map((item: any, index: number, arr: any[]) => {
            const taskInfo = tasks[item.taskConfigCode as 'TS000011'];

            return (<div className={styles.task} key={item.taskConfigCode}>
              <FPopover
                placement='right'
                content={taskInfo.popoverContent || <div />}
              >
                <a
                  className={styles.taskTitle}
                  onClick={taskInfo && taskInfo.onClick}
                >{index + 1 + '.' + item.taskConfigTitle}</a>
              </FPopover>

              {
                item.status === 2
                  ? (<div className={styles.taskState}>
                    <i
                      className={['freelog', 'fl-icon-shenqingchenggong1', styles.taskIcon].join(' ')}
                    />
                    <span className={styles.taskFinished}>已完成</span>
                  </div>)
                  : (<div className={styles.taskState}>未完成</div>)
              }
            </div>);
          })
        }
      </div>
    </div>
  );
}

export default BoardCard1;
