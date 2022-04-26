import * as React from 'react';
import styles from './index.less';
import FTooltip from '@/components/FTooltip';
import { Space } from 'antd';
import { FContentText } from '@/components/FText';
import FPopover from '@/components/FPopover';
import { FTextBtn } from '@/components/FButton';

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
      <div className={styles.title3}>还差5步领取 <span>6元</span> 奖励</div>
      <div />
    </div>
    <div className={styles.tasks}>
      <div className={styles.task}>
        <FPopover
          placement='right'
          // color={'white'}
          content={<div className={styles.tooltipDisplay}>
            <FContentText text={'完善「个人中心」里的标星内容即可，更了解你一点，才能为你提供更精准的高质量内容哦。'} type='highlight' />
          </div>}
        >
          <div className={styles.taskTitle}>1.完善个人信息</div>
        </FPopover>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <FPopover
          placement='right'
          // color={'white'}
          // visible
          // overlayInnerStyle={{width: 500}}
          content={<div className={styles.tooltipDisplay}>
            <FContentText text={'Freelog平台存在资源作者和节点商两个角色：'} type='highlight' />
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex' }}>
              <i style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                marginTop: 8,
                marginRight: 5,
                backgroundColor: '#666',
              }} />
              <FContentText text={'「资源作者」可通过创建并发行资源获取收益；'} type='highlight' />
            </div>
            <div style={{ height: 15 }} />
            <div style={{ display: 'flex' }}>
              <i style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                marginTop: 8,
                marginRight: 5,
                backgroundColor: '#666',
              }} />
              <FContentText text={'「节点商」是资源的整合者，通过在节点展示推广资源获取中间人收益。'} type='highlight' />
            </div>
            <div style={{ height: 15 }} />
            <Space size={5}>
              <FContentText text={'查看'} />
              <FTextBtn type='primary'>资源作者使用教程</FTextBtn>
              <FContentText text={'或'} />
              <FTextBtn type='primary'>节点商使用教</FTextBtn>
            </Space>
          </div>}
        >
          <div className={styles.taskTitle}>2.查看Freelog使用教程</div>
        </FPopover>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <FPopover
          placement='right'
          content={<div className={styles.tooltipDisplay}>
            <FContentText text={'Freelog社区旨在提供一个由用户创建高质量内容的论坛社区，资源讨论、节点运营、产品吐槽等均可。'} type='highlight' />
          </div>}>
          <div className={styles.taskTitle}>3.Freelog论坛签到</div>
        </FPopover>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <FPopover
          placement='right'
          content={<div className={styles.tooltipDisplay}>
            <FContentText text={'浏览Freelog推荐节点，喜欢就赶紧签约吧！'} type='highlight' />
          </div>}>
          <div className={styles.taskTitle}>4.浏览推荐节点</div>
        </FPopover>
        <div className={styles.taskState}>未完成</div>
      </div>
      <div className={styles.task}>
        <FPopover
          placement='right'
          content={<div className={styles.tooltipDisplay}>
            <FContentText text={'参与「邀请好友活动」邀请更多好友加入Freelog吧，可重复领取邀请好友活动奖励， 且被邀请好友可领取3元现金奖励哦。'} type='highlight' />
          </div>}>
          <div className={styles.taskTitle}>5.邀请一位好友</div>
        </FPopover>
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
      <div className={styles.title3}>还差4步领取 <span>7元</span> 奖励</div>
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
      <div className={styles.title3}>还差4步领取 <span>7元</span> 奖励</div>
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
