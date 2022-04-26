import * as React from 'react';
import styles from './index.less';

interface BoardCardProps {

}

function BoardCard({}: BoardCardProps) {
  const [unfoldIndex, setUnfoldIndex] = React.useState<0 | 1 | 2>(0);
  return (<div className={styles.boards}>
    <BoardCard1
      unfold={unfoldIndex === 0}
      onMouseEnter={() => {
        setUnfoldIndex(0);
      }}
    />
    <BoardCard2
      unfold={unfoldIndex === 1}
      onMouseEnter={() => {
        setUnfoldIndex(1);
      }}
    />
    <BoardCard3
      unfold={unfoldIndex === 2}
      onMouseEnter={() => {
        setUnfoldIndex(2);
      }}
    />
  </div>);
}

export default BoardCard;

interface BoardCard1Props {
  unfold: boolean;

  onMouseEnter?(): void;
}

function BoardCard1({ unfold, onMouseEnter }: BoardCard1Props) {
  return (<div
    className={styles.board1}
    style={{ width: unfold ? 700 : 245 }}
    onMouseEnter={() => {
      onMouseEnter && onMouseEnter();
    }}
  >
    <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
      <div />
      <div className={styles.title1}>基础任务</div>
      <div className={styles.title2}
           style={{ height: unfold ? 60 : 150 }}>完成下列基础任务可以了解Freelog的基本功能，以便更顺畅的使用Freelog完成资源、节点创建和推广
      </div>
      <div className={styles.title3}>还差3步领取 6元 奖励</div>
      <div />
    </div>
    <div className={styles.tasks}>
      <div className={styles.task}>
        <div className={styles.taskTitle}>1.完善个人信息</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>2.查看Freelog使用教程</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>3.Freelog论坛签到</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>4.浏览推荐节点</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>5.邀请一位好友</div>
        <div className={styles.taskState}>未完成</div>
      </div>
    </div>

  </div>);
}

interface BoardCard2Props {
  unfold: boolean;

  onMouseEnter?(): void;
}

function BoardCard2({ unfold, onMouseEnter }: BoardCard2Props) {
  return (<div
    className={styles.board2}
    style={{ width: unfold ? 700 : 245 }}
    onMouseEnter={() => {
      onMouseEnter && onMouseEnter();
    }}
  >
    <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
      <div />
      <div className={styles.title1}>资源任务</div>
      <div className={styles.title2} style={{ height: unfold ? 60 : 150 }}>完成“资源任务”可成为Freelog资源创作者，可通过创建发行资源获取创作收益</div>
      <div className={styles.title3}>领取 7元 奖励</div>
      <div />
    </div>
    <div className={styles.tasks}>
      <div className={styles.task}>
        <div className={styles.taskTitle}>1.创建1个资源</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>2.发布资源版本</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>3.添加资源授权策略</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>4.分享我的资源</div>
        <div className={styles.taskState}>未完成</div>
      </div>
    </div>
  </div>);
}

interface BoardCard3Props {
  unfold: boolean;

  onMouseEnter?(): void;
}

function BoardCard3({ unfold, onMouseEnter }: BoardCard3Props) {
  return (<div
    className={styles.board3}
    style={{ width: unfold ? 700 : 245 }}
    onMouseEnter={() => {
      onMouseEnter && onMouseEnter();
    }}
  >
    <div className={styles.instruction} style={{ height: unfold ? 200 : 500 }}>
      <div />
      <div className={styles.title1}>节点任务</div>
      <div className={styles.title2}
           style={{ height: unfold ? 60 : 150 }}>完成“节点任务”即可成为Freelog节点商，节点商是平台资源的整合方，通过在节点上展示资源和制定授权策略获取资运营收益
      </div>
      <div className={styles.title3}>领取 7元 奖励</div>
      <div />
    </div>
    <div className={styles.tasks}>
      <div className={styles.task}>
        <div className={styles.taskTitle}>1.创建1个节点</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>2.添加并上线1个展品</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>3.激活1个主题</div>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <div className={styles.taskTitle}>4.分享我的节点</div>
        <div className={styles.taskState}>未完成</div>
      </div>
    </div>
  </div>);
}
