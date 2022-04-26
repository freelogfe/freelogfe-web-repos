import * as React from 'react';
import styles from './index.less';

interface BoardCardProps {

}

function BoardCard({}: BoardCardProps) {
  return (<div className={styles.boards}>
    <BoardCard1 unfold={false} />
    <BoardCard2 unfold={false} />
    <BoardCard3 unfold={true} />
  </div>);
}

export default BoardCard;

interface BoardCard1Props {
  unfold: boolean;
}

function BoardCard1({ unfold }: BoardCard1Props) {
  return (<div className={styles.board1} style={{ width: unfold ? 700 : 245 }}>
    <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
      <div className={styles.title1}>基础任务</div>
      <div className={styles.title2}
           style={{ height: unfold ? 60 : 150 }}>完成下列基础任务可以了解Freelog的基本功能，以便更顺畅的使用Freelog完成资源、节点创建和推广
      </div>
      <div className={styles.title3}>还差3步领取 6元 奖励</div>
      <div />
    </div>
  </div>);
}

interface BoardCard2Props {
  unfold: boolean;
}

function BoardCard2({ unfold }: BoardCard2Props) {
  return (<div className={styles.board2} style={{ width: unfold ? 700 : 245 }}>
    <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
      <div className={styles.title1}>资源任务</div>
      <div className={styles.title2} style={{ height: unfold ? 60 : 150 }}>完成“资源任务”可成为Freelog资源创作者，可通过创建发行资源获取创作收益</div>
      <div className={styles.title3}>领取 7元 奖励</div>
      <div />
    </div>
  </div>);
}

interface BoardCard3Props {
  unfold: boolean;
}

function BoardCard3({ unfold }: BoardCard3Props) {
  return (<div className={styles.board3} style={{ width: unfold ? 700 : 245 }}>
    <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
      <div className={styles.title1}>节点任务</div>
      <div className={styles.title2}
           style={{ height: unfold ? 60 : 150 }}>完成“节点任务”即可成为Freelog节点商，节点商是平台资源的整合方，通过在节点上展示资源和制定授权策略获取资运营收益
      </div>
      <div className={styles.title3}>领取 7元 奖励</div>
      <div />
    </div>
  </div>);
}
