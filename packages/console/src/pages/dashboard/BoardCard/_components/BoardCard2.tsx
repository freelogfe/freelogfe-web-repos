import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FPopover from '@/components/FPopover';
import FComponentsLib from '@freelog/components-lib';

interface BoardCard2Props {
  unfold: boolean;
  data: any;
  onMouseEnter?(): void;
}

function BoardCard2({ unfold, onMouseEnter, data }: BoardCard2Props) {
  return (
    <div
      className={styles.board2}
      style={{ width: unfold ? 700 : 245 }}
      onMouseEnter={() => {
        onMouseEnter && onMouseEnter();
      }}
    >
      <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
        <div />
        <div className={styles.title1}>资源任务</div>
        <div className={styles.title2} style={{ height: unfold ? 60 : 150 }}>
          完成“资源任务”可成为Freelog资源创作者，可通过创建发行资源获取创作收益
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
              {item.taskConfigCode === 'TS000021' ? (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText
                        text={
                          '成功创建1个合规资源，图片、小说、漫画、游戏、视频、音乐、插件等资源类型不限，可直接上传往期作品。'
                        }
                        type="highlight"
                      />
                      <div style={{ height: 15 }} />
                      <Space size={5}>
                        <FComponentsLib.FContentText text={'可查阅'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >资源作者使用教程</a>
                        <FComponentsLib.FContentText text={'（视频）或'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >资源创建教程</a>
                        <FComponentsLib.FContentText text={'（图文）创建资源。'} />
                      </Space>
                    </div>
                  }
                >
                  <div className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</div>
                </FPopover>
              ) : item.taskConfigCode === 'TS000022' ? (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText
                        text={
                          '通过更新资源版本可以优化和调整资源内容，以便在相同的资源中保留多个资源文件。'
                        }
                        type="highlight"
                      />
                      <div style={{ height: 15 }} />
                      <Space size={5}>
                        <FComponentsLib.FContentText text={'可查阅'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >资源版本发布教程</a>
                        <FComponentsLib.FContentText text={'（图文）或'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >资源作者使用教程</a>
                        <FComponentsLib.FContentText text={'（视频）发布资源版本。'} />
                      </Space>
                    </div>
                  }
                >
                  <div className={styles.taskTitle}>{index + 1 + '.' + item.taskConfigTitle}</div>
                </FPopover>
              ) : item.taskConfigCode === 'TS000023' ? (
                <FPopover
                  placement="right"
                  content={
                    <div className={styles.tooltipDisplay}>
                      <FComponentsLib.FContentText
                        text={
                          '授权策略（免费/收费）是资源作者对资源授权的权利声明，也是资源作者获取收益的重要部分。'
                        }
                        type="highlight"
                      />
                      <div style={{ height: 15 }} />
                      <Space size={5}>
                        <FComponentsLib.FContentText text={'可查阅'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >资源授权策略添加教程</a>
                        <FComponentsLib.FContentText text={'（图文）或'} />
                        <a
                          href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                          target={'_blank'}
                          type="primary"
                        >资源作者使用教程</a>
                        <FComponentsLib.FContentText text={'(视频) 为资源添加授权策略。'} />
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
      </div>
    </div>
  );
}
export default BoardCard2;
