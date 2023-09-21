import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface TaskListProps {

}

const task: any = {
  'RS0000801': {
    title: '游戏/主题/插件',
    link: <div />,
  },
  'RS0000802': {
    title: '小说/漫画',
    link: <div />,
  },
  'RS0000803': {
    title: '其他类型资源',
    link: <div />,
  },
  'RS0000804': {
    title: '创建一个节点并激活主题',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={() => {
        self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeCreator());
      }}
    >立即创建节点</FComponentsLib.FTextBtn>,
  },
  'RS0000805': {
    title: '添加并上线一个展品',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={() => {
        self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.market());
      }}
    >前往资源市场</FComponentsLib.FTextBtn>,
  },
  'RS0000806': {
    title: '完成10次节点分享',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={async () => {
        const { data }: {
          data: {
            dataList: {
              nodeDomain: string;
              nodeId: number;
            }[];
          }
        } = await FServiceAPI.Node.nodes({});
        // console.log(data, 'sdio9f0jasld;kfjlsdjflk');

        if (data.dataList.length === 0) {
          self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeCreator());
        } else {
          self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeManagement({
            nodeID: data.dataList[0].nodeId,
          }));
        }
      }}
    >前往节点管理</FComponentsLib.FTextBtn>,
  },
  'RS0000807': {
    title: '完成10次展品分享',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={async () => {
        // self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.market());
        const { data }: {
          data: {
            dataList: {
              nodeDomain: string;
              nodeId: number;
            }[];
          }
        } = await FServiceAPI.Node.nodes({});
        // console.log(data, 'sdio9f0jasld;kfjlsdjflk');

        if (data.dataList.length === 0) {
          self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeCreator());
        } else {
          self.open(FUtil.Format.completeUrlByDomain(data.dataList[0].nodeDomain));
        }
      }}
    >前往节点</FComponentsLib.FTextBtn>,
  },
  'RS0000808': {
    title: '提交一个使用建议',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={() => {
        self.open('https://forum.freelog.com/category/3/%E5%90%90%E6%A7%BD%E5%8F%8D%E9%A6%88%E5%8C%BA');
      }}
    >提交建议</FComponentsLib.FTextBtn>,
  },
  'RS0000809': {
    title: '提交一个建议后被采纳',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={() => {
        self.open('https://forum.freelog.com/category/3/%E5%90%90%E6%A7%BD%E5%8F%8D%E9%A6%88%E5%8C%BA');
      }}
    >提交建议</FComponentsLib.FTextBtn>,
  },
  'RS0000810': {
    title: '提交一份活动调研问卷',
    link: <FComponentsLib.FTextBtn
      style={{ fontSize: 12 }}
      type={'primary'}
      onClick={() => {
        // self.open('https://jinshuju.net/f/nbRmg5');
        self.open(FI18n.i18nNext.t('beta_survey_link_a'));
      }}
    >填写问卷</FComponentsLib.FTextBtn>,
  },
};

const resourceTask1 = [
  {
    'code': '####',
    'title': '发行一个资源',
    'complete': '--',
    'score': '--',
  },
  {
    'code': 'RS0000801',
    'title': '游戏/主题/插件',
    'complete': '--',
    'score': '--',
  },
  {
    'code': 'RS0000802',
    'title': '小说/漫画',
    'complete': '--',
    'score': '--',
  },
  {
    'code': 'RS0000803',
    'title': '其他类型资源',
    'complete': '--',
    'score': '--',
  },
];

const resourceTask2 = [{
  'code': 'RS0000804',
  'title': '创建一个节点并激活主题',
  'complete': '--',
  'score': '--',
  'link': task['RS0000804'].link,
}, {
  'code': 'RS0000805',
  'title': '添加并上线一个展品',
  'complete': '--',
  'score': '--',
  'link': task['RS0000805'].link,
}, {
  'code': 'RS0000806',
  'title': '完成10次节点分享',
  'complete': '--',
  'score': '--',
  'link': task['RS0000806'].link,
}, {
  'code': 'RS0000807',
  'title': '完成10次展品分享',
  'complete': '--',
  'score': '--',
  'link': task['RS0000807'].link,
}, {
  'code': 'RS0000808',
  'title': '提交一个使用建议',
  'complete': '--',
  'score': '--',
  'link': task['RS0000808'].link,
}, {
  'code': 'RS0000809',
  'title': '提交一个建议后被采纳',
  'complete': '--',
  'score': '--',
  'link': task['RS0000809'].link,
}, {
  'code': 'RS0000810',
  'title': '提交一份活动调研问卷',
  'complete': '--',
  'score': '--',
  'link': task['RS0000810'].link,
}];

function TaskList({}: TaskListProps) {

  const [$isLogin, set$isLogin, get$isLogin] = FUtil.Hook.useGetState<boolean>(FUtil.Tool.getUserIDByCookies() !== -1);

  const [$resourceTask1, set$resourceTask1, get$resourceTask1] = FUtil.Hook.useGetState<{
    code: string;
    title: string;
    complete: string;
    score: string;
  }[]>(resourceTask1);
  const [$resourceTask2, set$resourceTask2, get$resourceTask2] = FUtil.Hook.useGetState<{
    code: string;
    title: string;
    complete: string;
    score: string;
    link: React.ReactNode;
  }[]>(resourceTask2);

  // console.log(JSON.stringify($resourceTask1), '$resourceTask1 weis9djf;sldkfjlksdjlkjl');
  // console.log(JSON.stringify($resourceTask2), '$resourceTask2 weis9djf;sldkfjlksdjlkjl');

  AHooks.useMount(async () => {
    if (!get$isLogin()) {
      return;
    }

    const { data: data_record1 }: {
      data: {
        code: string;
        title: string;
        completionTimes: number;
        completionTime: number;
        // rewardNum: number;
        sumRewardNum: number;
      }[];
    } = await FServiceAPI.Activity.statisticRewardRecords({
      codes: ['RS0000801', 'RS0000802', 'RS0000803'],
    });

    let totalComplete: number = 0;
    let totalScore: number = 0;

    for (const r of data_record1) {
      totalComplete += Number(r.completionTime);
      totalScore += Number(r.sumRewardNum);
    }

    // console.log(data_record1, 'TaskList dataw8eiojsdflk ');
    set$resourceTask1([
      {
        code: '####',
        title: '发行一个资源',
        complete: String(totalComplete),
        score: String(totalScore),
      },
      ...data_record1.map((r1) => {
        return {
          code: r1.code,
          // title: r1.title,
          title: task[r1.code]?.title || '',
          complete: r1.completionTime + (r1.completionTimes !== 0 ? `/${r1.completionTimes}` : ''),
          score: String(r1.sumRewardNum),
        };
      }),
    ]);
  });

  AHooks.useMount(async () => {
    if (!get$isLogin()) {
      return;
    }

    const { data: data_record2 }: {
      data: {
        code: string;
        title: string;
        completionTimes: number;
        completionTime: number;
        // rewardNum: number;
        sumRewardNum: number;
      }[];
    } = await FServiceAPI.Activity.statisticRewardRecords({
      codes: ['RS0000804', 'RS0000805', 'RS0000806', 'RS0000807', 'RS0000808', 'RS0000809', 'RS0000810'],
    });

    // console.log(data_record2, 'TaskList dataw8eiojsdflk ');

    set$resourceTask2(data_record2.map((r1) => {
      return {
        code: r1.code,
        // title: r1.title,
        title: task[r1.code]?.title || '',
        complete: r1.completionTime + (r1.completionTimes !== 0 ? `/${r1.completionTimes}` : ''),
        score: String(r1.sumRewardNum),
        link: task[r1.code]?.link || <div />,
      };
    }));

  });

  return (<>
    <div className={styles.table}>
      <div className={styles.row} style={{ height: 30 }}>
        <FComponentsLib.FContentText text={'任务详情'} type={'additional2'} />
        <FComponentsLib.FContentText text={'完成次数'} type={'additional2'} />
        <FComponentsLib.FContentText text={'获取积分'} type={'additional2'} />
        <FComponentsLib.FContentText text={'快捷入口'} type={'additional2'} />
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '80%' }}>
          {
            $resourceTask1.map((rt, ri) => {
              if (ri === 0) {
                return (<div className={styles.row} key={rt.code}>
                  <FComponentsLib.FContentText
                    text={rt.title}
                    type={'normal'}
                    style={{ fontSize: 12, width: '50%' }}
                  />
                  <FComponentsLib.FContentText
                    text={rt.complete}
                    type={'normal'}
                    style={{ fontSize: 12, width: '25%' }}
                  />
                  <FComponentsLib.FContentText
                    text={rt.score}
                    type={'normal'}
                    style={{ fontSize: 12, width: '25%' }}
                  />
                </div>);
              }
              return (<div className={styles.row} style={{ marginLeft: 20 }} key={rt.code}>
                <FComponentsLib.FContentText
                  text={rt.title}
                  type={'normal'}
                  style={{ fontSize: 12, width: 307 }}
                />
                <FComponentsLib.FContentText
                  text={rt.complete}
                  type={'normal'}
                  style={{ fontSize: 12, width: 165 }}
                />
                <FComponentsLib.FContentText
                  text={rt.score}
                  type={'normal'}
                  style={{ fontSize: 12, width: 164 }}
                />
              </div>);
            })
          }
        </div>
        <FComponentsLib.FTextBtn
          style={{ fontSize: 12 }}
          type={'primary'}
          onClick={() => {
            self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceCreator());
          }}
        >立即创建资源</FComponentsLib.FTextBtn>
      </div>
      {
        $resourceTask2.map((r2) => {
          return (<div className={styles.row} key={r2.code}>
            <FComponentsLib.FContentText text={r2.title} type={'normal'} style={{ fontSize: 12 }} />
            <FComponentsLib.FContentText text={r2.complete} type={'normal'} style={{ fontSize: 12 }} />
            <FComponentsLib.FContentText text={r2.score} type={'normal'} style={{ fontSize: 12 }} />
            {r2.link}
          </div>);
        })
      }
    </div>

  </>);
}

export default TaskList;
