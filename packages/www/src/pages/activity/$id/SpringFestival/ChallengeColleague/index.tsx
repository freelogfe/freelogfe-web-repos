import * as React from 'react';
import styles from './index.less';
import img_colleagueTitle from '@/assets/activity/SpringFestival/colleagueTitle@2x.png';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import FComponentsLib from '@freelog/components-lib';
import Steps5 from '../Steps5';
import img_colleagueProcess from '@/assets/activity/SpringFestival/colleagueProcess@2x.png';
import sharedStyles from '../shared.less';
import { Input, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import fCenterMessage from '@/components/fCenterMessage';

interface ChallengeColleagueProps {

}

function ChallengeColleague({}: ChallengeColleagueProps) {

  const [$showModal, set$showModal, get$showModal] = FUtil.Hook.useGetState<boolean>(false);
  const [$invitationCode, set$invitationCode, get$invitationCode] = FUtil.Hook.useGetState<string>('');
  const [$usedCount, set$usedCount, get$usedCount] = FUtil.Hook.useGetState<number>(0);
  const [$success, set$success, get$success] = FUtil.Hook.useGetState<number>(0);

  AHooks.useMount(async () => {
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      return;
    }
    const { data }: {
      data: {
        usedCount: number;
        code: string;
      }

    } = await FServiceAPI.TestQualification.codeDetails2({});
    // console.log(data, 'datadsflkjsdlkfjlkdsjlkfjlk');

    const { data: data_statisticTaskRecords }: {
      data: {
        completionTime: number;
      }[];
    } = await FServiceAPI.Activity.statisticTaskRecords({
      codes: ['TS001001'],
    });
    set$invitationCode(data.code);
    set$usedCount(data.usedCount);
    set$success(data_statisticTaskRecords[0]?.completionTime || 0);
    // set$usedCount(5);
  });

  return (<>
    <div className={styles.colleague}>
      <img src={img_colleagueTitle} style={{ width: 432, opacity: .95 }} alt={''} />
      <div className={styles.Steps}>
        <div>
          <img src={img_goldCoin} style={{ width: 65, opacity: $success >= 1 ? 1 : .3 }} alt={''} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65, opacity: $success >= 3 ? 1 : .3 }} alt={''} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65, opacity: $success >= 5 ? 1 : .3 }} alt={''} />
        </div>
      </div>
      <div style={{ height: 15 }} />
      <div className={styles.Steps}>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={'瓜分800元'} />
        </div>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={'再瓜分600元'} />
        </div>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={'再瓜分600元'} />
        </div>
      </div>
      <div style={{ height: 15 }} />
      <div>
        <Steps5 step={Math.min($success, 5)} />
      </div>
      <div style={{ height: 15 }} />
      <div className={styles.Steps}>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={`邀请 ${Math.min($success, 1)}/1 位`} />
        </div>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={`邀请 ${Math.min($success, 3)}/3 位`} />
        </div>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={`邀请 ${Math.min($success, 5)}/5 位`} />
        </div>
      </div>
      <div style={{ height: 70 }} />
      <FComponentsLib.FTitleText type={'h1'} text={'召唤好友共赴全员瓜分盛宴'} />
      <img src={img_colleagueProcess} style={{ width: 967, opacity: .95 }} alt={''} />
      <FComponentsLib.FContentText type={'negative'} text={'注意：“ 好友需用您提供邀请码激活内测资格，并成功完成一次新春卷王打卡挑战 ”'} />
      <div style={{ height: 40 }} />
      <a
        className={[sharedStyles.button, $usedCount >= 5 ? sharedStyles.disabled : ''].join(' ')}
        onClick={async () => {
          const { data }: {
            data: {
              userType: 0 | 1;
            }
          } = await FServiceAPI.User.currentUserInfo();

          if (data.userType === 0) {
            fCenterMessage({ message: '此活动仅对内测用户开放!' });
            return;
          }

          if (get$usedCount() >= 5) {
            return;
          }
          set$showModal(true);
        }}
      >去召唤好友</a>
      <div style={{ height: 60 }} />
    </div>
    <Modal
      open={$showModal}
      title={null}
      footer={null}
      closable={true}
      maskClosable={true}
      closeIcon={<span />}
      width={650}
      centered={true}
      style={{ borderRadius: 6, overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        set$showModal(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.text}>
          <div>freelog，一款专业免费的数字资源发行和授权平台，支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类资源。立即注册，还有机会参与我们的惊喜活动，赢取丰厚好礼！</div>
          <div style={{ height: 20 }} />
          <div>点击这里开始Freelog之旅：{FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon({ invitationCode: $invitationCode })}</div>
          <div style={{ height: 20 }} />
          <div>邀请码：{$invitationCode}</div>
          <div style={{ height: 20 }} />
        </div>
        <div style={{ height: 25 }} />
        <a
          className={[sharedStyles.button, sharedStyles.small].join(' ')}
          onClick={() => {
            copy(`freelog，一款专业免费的数字资源发行和授权平台，支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类资源。立即注册，还有机会参与我们的惊喜活动，赢取丰厚好礼！

点击这里开始Freelog之旅：${FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon({ invitationCode: $invitationCode })}

邀请码：${$invitationCode}`, {
              format: 'text/plain',
            });
            fCenterMessage({ message: '复制成功' });
          }}
        >复制内容</a>
      </div>
    </Modal>
  </>);
}

export default ChallengeColleague;
