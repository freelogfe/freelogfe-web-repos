import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FPopover from '@/components/FPopover';
import FComponentsLib from '@freelog/components-lib';

interface BoardCard3Props {
  unfold: boolean;
  data: any;
  onMouseEnter?(): void;
}

function BoardCard3({ unfold, onMouseEnter, data }: BoardCard3Props) {
  return (
    <div
      className={styles.board3}
      style={{ width: unfold ? 700 : 245 }}
      onMouseEnter={() => {
        onMouseEnter && onMouseEnter();
      }}
    >
      <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
        <div />
        <div className={styles.title1}>节点任务</div>
        <div className={styles.title2} style={{ height: unfold ? 60 : 150 }}>
          完成“节点任务”即可成为Freelog节点商，节点商是平台资源的整合方，通过在节点上展示资源和制定授权策略获取资运营收益
        </div>
        <div className={styles.title3}>
          还差{data.filter((item: any) => item.status === 1).length}步领取 <span>7元</span> 奖励
        </div>
        <div />
      </div>
      <div className={styles.tasks}>
        {data.map((item: any, index: number) => {
          return (
            <div className={styles.task} key={item.taskConfigCode}>
              {item.taskConfigCode === 'TS000031' ? (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText text={'成功创建1个节点即可。'} type="highlight" />
                      <div style={{ height: 15 }} />
                      <Space size={5}>
                        <FComponentsLib.FContentText text={'可查阅'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >节点商使用教程</a>
                        <FComponentsLib.FContentText text={'（视频）或'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >节点创建教程</a>
                        <FComponentsLib.FContentText text={'（图文）创建节点。'} />
                      </Space>
                    </div>
                  }
                >
                  <div className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</div>
                </FPopover>
              ) : item.taskConfigCode === 'TS000032' ? (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText text={'资源被签约到节点即变为展品。'} type="highlight" />
                      <div style={{ height: 15 }} />
                      <Space size={5}>
                        <FComponentsLib.FContentText text={'可查阅'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >展品添加上线教程</a>
                        <FComponentsLib.FContentText text={'（图文）或'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >节点商使用教程</a>
                        <FComponentsLib.FContentText text={'（视频）在资源市场添加并上线展品。'} />
                      </Space>
                      <div style={{ height: 15 }} />
                      <div style={{ color: '#EE4040' }}>
                        *只有处于上线状态的展品才能被用户签约消费。
                      </div>
                    </div>
                  }
                >
                  <div className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</div>
                </FPopover>
              ) : item.taskConfigCode === 'TS000033' ? (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText text={'主题决定节点的展示外观。'} type="highlight" />
                      <div style={{ height: 15 }} />
                      <Space size={5}>
                        <FComponentsLib.FContentText text={'可查阅'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >主题激活教程</a>
                        <FComponentsLib.FContentText text={'（图文）或'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >节点商使用教程</a>
                        <FComponentsLib.FContentText text={'（视频）激活主题。'} />
                      </Space>
                    </div>
                  }
                >
                  <div className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</div>
                </FPopover>
              ) : (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText text={item.taskConfigDescription} type="highlight" />
                    </div>
                  }
                >
                  <div className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</div>
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
        })}

        <div className={styles.task}>
          <FPopover
            placement="right"
            content={
              <div className={styles.tooltipDisplay}>
                <FComponentsLib.FContentText text={'主题决定节点的展示外观。'} type="highlight" />
                <div style={{ height: 15 }} />
                <Space size={5}>
                  <FComponentsLib.FContentText text={'可查阅'} />
                  <a
                    href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                    target={'_blank'}
                    type="primary"
                  >主题激活教程</a>
                  <FComponentsLib.FContentText text={'（图文）或'} />
                  <a
                    href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                    target={'_blank'}
                    type="primary"
                  >节点商使用教程</a>
                  <FComponentsLib.FContentText text={'（视频）激活主题。'} />
                </Space>
              </div>
            }
          >
            <div className={styles.taskTitle}>3.激活1个主题</div>
          </FPopover>
          <div className={styles.taskState}>未完成</div>
        </div>
        <div className={styles.task}>
          <FPopover
            placement="right"
            content={
              <div className={styles.tooltipDisplay}>
                <FComponentsLib.FContentText
                  text={'分享节点可以获得更多签约消费，快去复制链接和好友分享你的节点吧。'}
                  type="highlight"
                />
              </div>
            }
          >
            <div className={styles.taskTitle}>4.分享我的节点</div>
          </FPopover>
          <div className={styles.taskState}>未完成</div>
        </div>
      </div>
    </div>
  );
}
export default BoardCard3;
