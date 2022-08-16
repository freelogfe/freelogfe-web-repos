import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FPopover from '@/components/FPopover';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';

interface BoardCard1Props {
  unfold: boolean;

  onMouseEnter?(): void;
}

const url = [
  FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.setting(),
  'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f',
  'https://forum.freelog.com/topic/2/freelog%E5%86%85%E6%B5%8B%E7%AD%BE%E5%88%B0%E6%A5%BC-%E5%AE%8C%E6%88%90%E7%AD%BE%E5%88%B0%E5%8D%B3%E6%9C%89%E6%9C%BA%E4%BC%9A%E9%A2%866%E5%85%83%E7%8E%B0%E9%87%91%E5%A5%96%E5%8A%B1',
  '',
  '',
] as const;

function BoardCard1({ unfold, onMouseEnter }: BoardCard1Props) {

  const [dataSource, set_dataSource] = React.useState<any[]>([]);

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.getBaseTaskInfo();
    set_dataSource(data);
  });

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
        <div className={styles.title3}>
          还差{dataSource.filter((item: any) => item.status === 1).length}步领取 <span>6元</span> 奖励
        </div>
        <div />
      </div>
      <div className={styles.tasks}>
        {
          dataSource.map((item: any, index: number) => {
            return (
              <div className={styles.task} key={item.taskConfigCode}>
                {item.taskConfigCode === 'TS000011' ? (
                  <FPopover
                    placement='right'
                    content={
                      <div className={styles.tooltipDisplay}>
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
                        <Space size={5}>
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
                          >节点商使用教</a>
                        </Space>
                      </div>
                    }
                  >
                    <a className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</a>
                  </FPopover>
                ) : (
                  <FPopover
                    placement='right'
                    content={
                      <div className={styles.tooltipDisplay}>
                        <FComponentsLib.FContentText text={item.taskConfigDescription} type='highlight' />
                      </div>
                    }
                  >
                    <a className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</a>
                  </FPopover>
                )}

                {item.status === 2 ? (
                  <div className={styles.taskState}>
                    <i
                      className={['freelog', 'fl-icon-shenqingchenggong1', styles.taskIcon].join(' ')}
                    />
                    <span className={styles.taskFinished}>已完成</span>
                  </div>
                ) : (
                  <div className={styles.taskState}>未完成</div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default BoardCard1;
