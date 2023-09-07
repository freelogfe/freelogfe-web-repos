import * as React from 'react';
import styles from './index.less';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import img_banner from '@/assets/activity/ExperienceOfficer/banner@2x.png';
import img_award1 from '@/assets/activity/ExperienceOfficer/award1@2x.png';
import img_award2 from '@/assets/activity/ExperienceOfficer/award2@2x.png';
import img_questionnaire1 from '@/assets/activity/ExperienceOfficer/questionnaire1@2x.png';
import img_questionnaire2 from '@/assets/activity/ExperienceOfficer/questionnaire2@2x.png';
import img_questionnaire3 from '@/assets/activity/ExperienceOfficer/questionnaire3@2x.png';
import img_point1 from '@/assets/activity/ExperienceOfficer/point1@2x.png';
import img_point2 from '@/assets/activity/ExperienceOfficer/point2@2x.png';
import { Affix, Popover, Space, Table } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FPropaganda from '@/components/FPropaganda';
import { Link } from 'umi';
import { useGetState } from '@/layouts/FBaseLayout';

interface ExperienceOfficerProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function ExperienceOfficer({}: ExperienceOfficerProps) {

  const position = AHooks.useScroll(self.document.getElementById('layout-content'));
  // console.log(position, 'positionoisdjlkfjsldjflkjl');

  const ref_content1 = React.useRef<HTMLDivElement>(null);
  const ref_content2 = React.useRef<HTMLDivElement>(null);
  const ref_content3 = React.useRef<HTMLDivElement>(null);
  const ref_content4 = React.useRef<HTMLDivElement>(null);
  const ref_content5 = React.useRef<HTMLDivElement>(null);

  const [$activated, set$activated, get$activated] = useGetState<number>(1);

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
  });

  React.useEffect(() => {
    const info1 = ref_content1.current?.getBoundingClientRect();
    const info2 = ref_content2.current?.getBoundingClientRect();
    const info3 = ref_content3.current?.getBoundingClientRect();
    const info4 = ref_content4.current?.getBoundingClientRect();
    const info5 = ref_content5.current?.getBoundingClientRect();
    if (info1 && info1.top > 155 && info1.top < 300) {
      set$activated(1);
    } else if (info2 && info2.top > 155 && info2.top < 300) {
      set$activated(2);
    } else if (info3 && info3.top > 155 && info3.top < 300) {
      set$activated(3);
    } else if (info4 && info4.top > 155 && info4.top < 300) {
      set$activated(4);
    } else if (info5 && info5.top > 155 && info5.top < 300) {
      set$activated(5);
    }
  }, [position]);

  return (<div className={styles.styles}>
    <img className={styles.banner} src={img_banner} alt={''} />
    <Affix
      offsetTop={0}
      target={() => {
        return self.document.getElementById('layout-content');
      }}
    >
      <div className={styles.AffixContent}>
        <div className={styles.links}>
          <a
            className={[styles.link, $activated === 1 ? styles.activated : ''].join(' ')}
            onClick={() => {
              const info = ref_content1.current?.getBoundingClientRect();
              self.document.getElementById('layout-content')?.scrollBy({
                top: (info?.top || 0) - 160,
                behavior: 'smooth',
              });
              // set$activated(1);
            }}
          >活动日程</a>
          <a
            onClick={() => {
              const info = ref_content2.current?.getBoundingClientRect();
              self.document.getElementById('layout-content')?.scrollBy({
                top: (info?.top || 0) - 160,
                behavior: 'smooth',
              });
              // set$activated(2);
            }}
            className={[styles.link, $activated === 2 ? styles.activated : ''].join(' ')}
          >活动奖励</a>
          <a
            onClick={() => {
              const info = ref_content3.current?.getBoundingClientRect();
              self.document.getElementById('layout-content')?.scrollBy({
                top: (info?.top || 0) - 160,
                behavior: 'smooth',
              });
              // set$activated(3);
            }}
            className={[styles.link, $activated === 3 ? styles.activated : ''].join(' ')}
          >活动玩法</a>
          <a
            onClick={() => {
              const info = ref_content4.current?.getBoundingClientRect();
              self.document.getElementById('layout-content')?.scrollBy({
                top: (info?.top || 0) - 160,
                behavior: 'smooth',
              });
              // set$activated(4);
            }}
            className={[styles.link, $activated === 4 ? styles.activated : ''].join(' ')}
          >如何参与</a>
          <a
            onClick={() => {
              const info = ref_content5.current?.getBoundingClientRect();
              self.document.getElementById('layout-content')?.scrollBy({
                top: (info?.top || 0) - 160,
                behavior: 'smooth',
              });
              // set$activated(5);
            }}
            className={[styles.link, $activated === 5 ? styles.activated : ''].join(' ')}
          >活动规则</a>
        </div>
      </div>
    </Affix>
    <div className={styles.content}>
      <div style={{ height: 40 }} />
      <div className={styles.activityTime} ref={ref_content1}>
        <div className={styles.activityTimeCard}>
          <Space size={10}>
            <div className={styles.dot} style={{ backgroundColor: '#42C28C' }} />
            <div className={styles.text}>活动开启</div>
          </Space>
          <div style={{ height: 20 }} />
          <div className={styles.text}>2023/mm/dd</div>
        </div>
        <div className={styles.activityTimeCard}>
          <Space size={10}>
            <div className={styles.dot} style={{ backgroundColor: '#EE4040' }} />
            <div className={styles.text}>活动结束</div>
          </Space>
          <div style={{ height: 20 }} />
          <div className={styles.text}>2023/mm/dd</div>
        </div>
        <div className={styles.activityTimeCard}>
          <Space size={10}>
            <div className={styles.dot} style={{ backgroundColor: '#2784FF' }} />
            <div className={styles.text}>结果公示</div>
          </Space>
          <div style={{ height: 20 }} />
          <div className={styles.text}>2023/mm/dd</div>
        </div>
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.award} ref={ref_content2}>
        <div style={{ height: 60 }} />
        <div className={styles.h1}>体验官优秀奖</div>
        <div style={{ height: 10 }} />
        <div className={styles.h2}>体验官积分排名前八者可依次获得现金奖励</div>
        <div style={{ height: 40 }} />
        <img style={{ width: 820 }} src={img_award1} alt={''} />
        <div style={{ height: 50 }} />
        <Space size={20}>
          <div className={styles.horizontalLine} />
          <div className={styles.h3}>排名将会在活动结束后一周时公示，敬请期待</div>
          <div className={styles.horizontalLine} />
        </Space>
        <div style={{ height: 60 }} />
        <div className={styles.longDashed} />
        <div style={{ height: 60 }} />
        <div className={styles.h1}>体验官优秀奖</div>
        <div style={{ height: 10 }} />
        <div className={styles.h2}>体验官积分排名前八者可依次获得现金奖励</div>
        <div style={{ height: 40 }} />
        <img style={{ width: 560 }} src={img_award2} alt={''} />
        <div style={{ height: 50 }} />
        <Space size={20}>
          <div className={styles.horizontalLine} />
          <div className={styles.h3}>排名将会在活动结束后一周时公示，敬请期待</div>
          <div className={styles.horizontalLine} />
        </Space>
        <div style={{ height: 60 }} />
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.questionnaire} ref={ref_content3}>
        <div style={{ height: 60 }} />
        <div className={styles.h1}>填写体验官招募问卷，获参与资格</div>
        <div style={{ height: 10 }} />
        <div className={styles.h2}>首批体验官名额仅限200名，先到先得！</div>
        <div style={{ height: 40 }} />
        <div style={{ width: 640, display: 'flex', justifyContent: 'space-between' }}>
          <img style={{ width: 184 }} src={img_questionnaire1} alt={''} />
          <img style={{ width: 184 }} src={img_questionnaire2} alt={''} />
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 730 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <FComponentsLib.FContentText text={'招募漫画、小说/文章、图片/插画、'} type={'highlight'} />
            <FComponentsLib.FContentText text={'音乐/音效/播客、视频等内容创作者及游戏、'} type={'highlight'} />
            <FComponentsLib.FContentText text={'主题、插件开发者'} type={'highlight'} />
          </div>
          <div>
            <FComponentsLib.FContentText text={'参与方式：填写招募问卷即可报名参与内测'} type={'highlight'} />
          </div>
        </div>
        <div style={{ height: 40 }} />
        <a className={styles.button}>立即成为首批体验官</a>
        <div style={{ height: 60 }} />
        <div className={styles.longDashed} />
        <div style={{ height: 60 }} />
        <div className={styles.h1}>3步玩转体验官积分，赢¥2000现金大奖</div>
        <div style={{ height: 10 }} />
        <div className={styles.h2}>参与体验官积分活动，获得体验官专属福利，更有机会赢取现金大奖</div>
        <div style={{ height: 50 }} />
        <img style={{ width: 748 }} src={img_questionnaire3} alt={''} />
        <div style={{ height: 50 }} />
        <Space size={30}>
          <a className={styles.button}>查看教程快速上手</a>
          <a className={styles.button}>了解体验官积分规则</a>
        </Space>
        <div style={{ height: 60 }} />

      </div>
      <div style={{ height: 50 }} />
      <div className={styles.point} ref={ref_content4}>
        <div style={{ height: 60 }} />
        <div className={styles.h1}>立即开启体验官积分之旅</div>
        <div style={{ height: 60 }} />
        <img style={{ width: 1060 }} src={img_point1} alt={''} />
        <div style={{ height: 40 }} />
        <Space size={30}>
          <div className={styles.h3}>每天12：00更新：最近更新{'更新数据时间'}</div>
          <FComponentsLib.FTextBtn type={'primary'} style={{ fontSize: 12 }}>积分活动获取记录</FComponentsLib.FTextBtn>
        </Space>
        <div style={{ height: 60 }} />
        <div className={styles.longDashed} />
        <div style={{ height: 60 }} />
        <img style={{ width: 334 }} src={img_point2} alt={''} />
        <div style={{ height: 40 }} />
        <Table
          style={{ width: '100%' }}
          columns={[
            {
              title: '任务详情',
              dataIndex: 'task',
              key: 'task',
            },
            {
              title: '完成次数',
              dataIndex: 'count',
              key: 'count',
            },
            {
              title: '获取积分',
              dataIndex: 'point',
              key: 'point',
            },
            {
              title: '快捷入口',
              dataIndex: 'entry',
              key: 'entry',
            },
          ]}
        />
        <div style={{ height: 60 }} />
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.regulation} ref={ref_content5}>
        <div style={{ height: 60 }} />
        <div className={styles.h1}>内测体验官积分玩法详情</div>
        <div style={{ height: 60 }} />
        <Space size={20} direction={'vertical'} style={{ width: 820 }}>
          <div className={styles.regulationTitle}>一、体验官积分活动相关时间和奖励发放规则说明</div>
          <div className={styles.regulationContent}>
            <label>1</label>
            <div>体验官积分活动期为{'活动开始时间'}至{'活动结束时间'}；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>2</label>
            <div>活动公示时间为{'活动结束后一周'}，优秀体验官和幸运体验官获奖者将在此页奖励模块中公示，所有中奖者会有Freelog官方工作人员与您取得联系，7个工作日内发放相应奖励；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>3</label>
            <div>幸运体验官获奖者入选条件为：除金银铜牌体验官以外的所有体验官；最低要求完成新手任务+提交至少一条有效建议+提交活动问卷。</div>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <Space size={20} direction={'vertical'} style={{ width: 820 }}>
          <div className={styles.regulationTitle}>二、成功发行1个合规资源，即可获得对应积分奖励，活动期内可获积分无上限，不同资源类型可获积分规则如下：</div>
          <div className={styles.regulationContent}>
            <label>1</label>
            <div>成功发行一个游戏/主题/插件类合规资源，可获得20积分；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>2</label>
            <div>
              <div>成功发行一个小说/漫画类合规资源，可获得5积分；</div>
              <div style={{ height: 5 }} />
              <FComponentsLib.FContentText
                type={'additional2'}
                text={'建议按小说每章或漫画每话逐个发行资源，一个资源内上传了多章小说或者多话漫画的，仍按一个资源积分计算'}
              />
            </div>
          </div>
          <div className={styles.regulationContent}>
            <label>3</label>
            <div>成功发行一个图片/音频/视频/其他类合规资源，可获得2积分；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>4</label>
            <div>若体验官对已发行资源在活动期内进行下架操作，则该资源所获积分将会被扣除；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>5</label>
            <div>所有已发行资源将在活动结束后一周内由Freelog工作人员做内容合规巡检，若有违规资源，将做资源禁用并扣除相应积分。</div>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <Space size={20} direction={'vertical'} style={{ width: 820 }}>
          <div className={styles.regulationTitle}>三、完成创建并运营节点相关任务，即可获得对应积分奖励</div>
          <div className={styles.regulationContent}>
            <label>1</label>
            <div>成功创建一个节点并激活主题的，可获得2积分，目前每位用户最多可以创建3个节点，活动期内可获得积分上限6分。当体验官将已创建的节点访问限制被设置为“私密”或“暂停运营”，则该节点所获得的积分将扣除；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>2</label>
            <div>在上述节点中，每添加并上线一个展品，可获得2积分。在活动期内，当体验官将已上架的展品操作下架，则该展品所获得的积分将扣除；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>3</label>
            <div>分享本人或者其他用户节点至社交平台，每天每分享一个节点可获得2积分，每天分享的节点不可重复，活动期内通过分享节点可获得的积分上限为20分；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>4</label>
            <div>分享本人或其他用户节点的展品至社交平台，每天每分享一个展品可获得2积分，每天分享的展品不可重复，活动期内通过分享展品可获得的积分上限为20分。</div>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <Space size={20} direction={'vertical'} style={{ width: 820 }}>
          <div className={styles.regulationTitle}>四、向Freelog平台提出有效建议并完成活动问卷，即可获得对应积分奖励</div>
          <div className={styles.regulationContent}>
            <label>1</label>
            <div>在活动期内，通过特定反馈入口提交有效建议的，每条建议可获得2积分，被平台采纳的建议可额外获得5积分。同一个用户提交的建议，平台工作人员将在活动期结束后一周内进行审查，被判定为无效建议（无实质内容或者内容重复的），将扣除该建议获得的积分；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>2</label>
            <div>在活动期内，完成活动问卷提交可获得5积分；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>3</label>
            <div>对提出建设性意见并被采纳的内测体验官，平台将在版本更新中进行鸣谢。</div>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <Space size={20} direction={'vertical'} style={{ width: 820 }}>
          <div className={styles.regulationTitle}>五、违规用户行为说明</div>
          <div className={styles.regulationContent}>
            <label>1</label>
            <div>活动期内所有内测体验官须遵守
              <FComponentsLib.FTextBtn
                style={{ display: 'inline' }}
                type={'primary'}
              >《Freelog平台管理规范》</FComponentsLib.FTextBtn>
              ，违规者平台有权取消其体验官资格并扣除奖励不予发放；
            </div>
          </div>
          <div className={styles.regulationContent}>
            <label>2</label>
            <div>同一资源不能由多人提交，重复参加。如资源内容由多位作者共同创作，只能由一人提交参与活动，相关奖励将发放给提交资源内容的资源作者；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>3</label>
            <div>禁止一切违规刷数据的行为，如参赛资源存在刷数据的情况，则将被视为无效资源，取消活动参与资格；</div>
          </div>
          <div className={styles.regulationContent}>
            <label>4</label>
            <div>活动期间开放举报通道，用户可以通过向Freelog发送邮件（service@freelog.com）对涉嫌违规的行为和用户进行举报。
              举报邮件内容需包含被举报作品名称、作品链接、涉嫌违规原因，否则不予处理。
            </div>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <Space size={20} direction={'vertical'} style={{ width: 820 }}>
          <div className={styles.regulationTitle}>六、本活动最终解释权归Freelog所有，如有疑问可联系官方邮箱service@freelog.com</div>
        </Space>
      </div>
      <div style={{ height: 100 }} />

    </div>
    <FPropaganda style={{ backgroundColor: '#fff' }} />
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ border: '1px solid #979797', width: 680, opacity: .15 }} />
    </div>
    <FComponentsLib.FPageFooter
      PopoverPatch={Popover}
      style={{}}
    />
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(ExperienceOfficer);
