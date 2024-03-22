import * as React from 'react';
import styles from './index.less';
import img_reward from '@/assets/activity/SpringFestival/reward@2x.png';
import img_rewardTitle1 from '@/assets/activity/SpringFestival/rewardTitle1@2x.png';
import img_rewardTitle2 from '@/assets/activity/SpringFestival/rewardTitle2@2x.png';
import img_rewardTitle3 from '@/assets/activity/SpringFestival/rewardTitle3@2x.png';
import img_rewardTitle4 from '@/assets/activity/SpringFestival/rewardTitle4@2x.png';
import img_rewardTitle5 from '@/assets/activity/SpringFestival/rewardTitle5@2x.png';
import sharedStyles from '../shared.less';
import fCenterMessage from '@/components/fCenterMessage';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import moment from 'moment';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';

// import FComponentsLib from '@freelog/components-lib';

interface RewardProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function Reward({ activityDetailsPage }: RewardProps) {
  const [$showModal, set$showModal, get$showModal] = FUtil.Hook.useGetState<boolean>(false);
  return (<>
    <img src={img_reward} style={{ width: 1060 }} alt={''} />
    <div style={{ height: 50 }} />

    {
      // activityDetailsPage.announceTime && moment().isBefore(activityDetailsPage.announceTime)
      FI18n.i18nNext.t('event_cn_newyear_2024_winnerlist_switch') !== '1'
        ? (<FComponentsLib.FContentText
          type={'additional2'}
          text={`获奖公示时间：${activityDetailsPage.announceTime?.format('YYYY-MM-DD HH:mm:ss') || 'YYYY-MM-DD HH:mm:ss'}，敬请关注`}
        />)
        : (<a
          className={sharedStyles.button}
          onClick={() => {
            if (!activityDetailsPage.announceTime) {
              fCenterMessage({ message: '公示时间无效' });
              return;
            }
            if (moment().isBefore(activityDetailsPage.announceTime)) {
              fCenterMessage({ message: `获奖公示时间：${activityDetailsPage.announceTime.format('YYYY-MM-DD HH:mm:ss')}，敬请关注` });
              return;
            }
            set$showModal(true);
          }}
        >查看获奖公示</a>)
    }


    <Modal
      open={$showModal}
      title={null}
      footer={null}
      // closable={false}
      width={1000}
      centered={true}
      style={{ borderRadius: 10, overflow: 'hidden' }}
      bodyStyle={{ height: 'calc(100vh - 200px)', padding: 0 }}
      onCancel={() => {
        set$showModal(false);
      }}
    >
      <div className={styles.article}>
        <div className={styles.content}>
          <div style={{ height: 40 }} />
          <div className={styles.h1}>获奖公示</div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>“新春召集令，freelog创作激励计划启动！”活动已结束，感谢大家的热情参与！</div>
          <div style={{ height: 15 }} />
          <div className={styles.h3}>以下是本次活动获奖名单，我们将在15个工作日内发放活动奖励至您的freelog【个人中心】—【活动奖励】模块，请留意官方信息，以便及时领取您的奖励！</div>
          <div style={{ height: 40 }} />
          <img src={img_rewardTitle1} className={styles.imgTitle} alt={''} />
          <div style={{ height: 20 }} />
          <div className={styles.h2}>经过大家的齐心协力，新春瓜分奖励池成功解锁至 <span
            className={styles.strong}>666元</span> ！
            {/*现在人均可获得丰厚的 <span*/}
            {/*className={styles.strong}>xx元</span> 奖励，*/}
            感谢大家的辛勤付出与参与！
          </div>
          <div style={{ height: 40 }} />
          <img src={img_rewardTitle2} className={styles.imgTitle} alt={''} />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>共13人完成累计打卡21天挑战，瓜分奖励¥2888</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'Bex110204',
              'aaa',
              'cyy',
              'jeno',
              'wxy15737841802',
              'SSSR',
              'xxt',
              'myy',
              'qwe3523199631',
              'yueyueyue',
              'Eeyore',
              '111',
              'wjh19837861207',
            ]}
            pentagramColor={'#FF6A1F'}
          />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>共20人完成累计打卡14天挑战，瓜分奖励¥1888</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'Bex110204',
              'jeno',
              'wjh19837861207',
              'wxy15737841802',
              'aaa',
              'cyy',
              'qwe3523199631',
              '111',
              'SSSR',
              'myy',
              'xxt',
              'Tsuki7789',
              'yueyueyue',
              'Eeyore',
              'looopy',
              'Tsuki',
              'fdk',
              'WASD',
              'hlb',
              'ADiii',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>共25人完成累计打卡7天挑战，瓜分奖励¥888</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'Bex110204',
              'jeno',
              'wjh19837861207',
              'wxy15737841802',
              'aaa',
              'cyy',
              'qwe3523199631',
              '111',
              'SSSR',
              'myy',
              'xxt',
              'Tsuki7789',
              'yueyueyue',
              'Eeyore',
              'looopy',
              'Tsuki',
              'fdk',
              'WASD',
              'hlb',
              'ADiii',
              'wmy13781185013',
              'btsjk0901',
              'YC-1123',
              'hqw1345',
              'zaxizecuo3611',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 40 }} />
          <img src={img_rewardTitle3} className={styles.imgTitle} alt={''} />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>共3人完成邀请5位好友任务，瓜分奖励¥600</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'qwe3523199631',
              'SSSR',
              'aaa',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>共5人完成邀请3位好友任务，瓜分奖励¥600</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'qwe3523199631',
              'SSSR',
              'aaa',
              'WASD',
              'thinkoutofthebox',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>共9人完成邀请1位好友任务，瓜分奖励¥800</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'qwe3523199631',
              'aaa',
              'wjh19837861207',
              'Bex110204',
              'SSSR',
              'btsjk0901',
              'WASD',
              'thinkoutofthebox',
              'wmy13781185013',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 40 }} />
          <img src={img_rewardTitle4} className={styles.imgTitle} alt={''} />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>46位新人首次参与了freelog活动并完成一次活动任务，瓜分奖励￥666</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'spring',
              'abcdefg',
              'fafafa111',
              'z398544891',
              'ansailong',
              'yy',
              'hcy',
              'hlb',
              'PL',
              'YC-1123',
              'cathy',
              'ADiii',
              'WASD',
              'kesideyu',
              'zzz',
              'syd',
              'Tsuki',
              'hqw1345',
              'fdk',
              'looopy',
              'luzhiyao',
              'kylin',
              'myy',
              'X',
              '87',
              'yuu',
              'lan',
              'a11',
              'SSSR',
              'xxt',
              'Tsuki7789',
              'zhaoheng123',
              'qwe123456',
              'zaxizecuo3611',
              'wxy15737841802',
              'Bex110204',
              'wjh19837861207',
              'wmy13781185013',
              'cyy',
              'hhk258069',
              'two',
              'jeno',
              'aaaa1',
              'hid-q605f6xsrxtc-4t',
              '1117837800554',
              'qwe3523199631',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>前100位完成的用户分别额外获得¥3奖励</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'spring',
              'abcdefg',
              'fafafa111',
              'z398544891',
              'ansailong',
              'yy',
              'hcy',
              'hlb',
              'PL',
              'YC-1123',
              'cathy',
              'ADiii',
              'WASD',
              'kesideyu',
              'zzz',
              'syd',
              'Tsuki',
              'hqw1345',
              'fdk',
              'looopy',
              'luzhiyao',
              'kylin',
              'myy',
              'X',
              '87',
              'yuu',
              'lan',
              'a11',
              'SSSR',
              'xxt',
              'Tsuki7789',
              'zhaoheng123',
              'qwe123456',
              'zaxizecuo3611',
              'wxy15737841802',
              'Bex110204',
              'wjh19837861207',
              'wmy13781185013',
              'cyy',
              'hhk258069',
              'two',
              'jeno',
              'aaaa1',
              'hid-q605f6xsrxtc-4t',
              '1117837800554',
              'qwe3523199631',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 40 }} />
          <img src={img_rewardTitle5} className={styles.imgTitle} alt={''} />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>转发点赞最高奖¥166</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'qwe3523199631 (小红书)',
              'Bex110204 (微博)',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 25 }} />
          <strong className={styles.strong}>14位锦鲤，每人奖励¥66</strong>
          <div style={{ height: 15 }} />
          <RewardList
            names={[
              'jeno',
              'SSSR',
              'hid-q605f6xsrxtc-4t',
              'Eeyore',
              'aaa',
              'kylin',
              'Tsuki',
              'kesideyu',
              'YC-1123',
              '111',
              'cyy',
              'xxt',
              'wmy13781185013',
              'yueyueyue',
            ]}
            pentagramColor={'#E9A923'}
          />
          <div style={{ height: 40 }} />

        </div>
      </div>
    </Modal>
  </>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(Reward);

interface RewardListProps {
  names: string[];
  pentagramColor: string;
}

function RewardList({ names, pentagramColor }: RewardListProps) {
  return (<div className={styles.list}>
    {
      names.map((n, i) => {
        return (<label key={i}>
          <FComponentsLib.FIcons.FPentacle style={{ fontSize: 12, color: pentagramColor }} />
          <span>{n}</span>
        </label>);
      })
    }
  </div>);
}
