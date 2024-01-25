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
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface ChallengeColleagueProps {

}

function ChallengeColleague({}: ChallengeColleagueProps) {

  const [$invitationCode, set$invitationCode, get$invitationCode] = FUtil.Hook.useGetState<string>('');

  AHooks.useMount(() => {

  });
  
  return (<>
    <div className={styles.colleague}>
      <img src={img_colleagueTitle} style={{ width: 432, opacity: .95 }} alt={''} />
      <div className={styles.Steps}>
        <div>
          <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
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
        <Steps5 step={3} />
      </div>
      <div style={{ height: 15 }} />
      <div className={styles.Steps}>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={'邀请 1 位'} />
        </div>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={'邀请 1/3 位'} />
        </div>
        <div>
          <FComponentsLib.FContentText type={'normal'} text={'邀请 1/5 位'} />
        </div>
      </div>
      <div style={{ height: 70 }} />
      <FComponentsLib.FTitleText type={'h1'} text={'召唤好友  共赴全员瓜分盛宴'} />
      <img src={img_colleagueProcess} style={{ width: 967, opacity: .95 }} alt={''} />
      <a
        className={sharedStyles.button}
        onClick={() => {

        }}
      >去召唤好友</a>
      <div style={{ height: 60 }} />
    </div>
    <Modal
      open={true}
      title={null}
      footer={null}
      // closable={false}
      width={650}
      centered={true}
      style={{ borderRadius: 6, overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        // set$showModal(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.text}>
          <div>freelog，一款专业免费的数字资源发行和授权平台，支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类资源。立即注册，还有机会参与我们的惊喜活动，赢取丰厚好礼！</div>
          <div style={{ height: 20 }} />
          <div>点击这里开始Freelog之旅：http://www.freelog.com/</div>
          <div style={{ height: 20 }} />
          <div>邀请码：{'InvitationCode'}</div>
          <div style={{ height: 20 }} />
        </div>
        <div style={{ height: 25 }} />
        <a
          className={[sharedStyles.button, sharedStyles.small].join(' ')}
          onClick={() => {
            copy(`freelog，一款专业免费的数字资源发行和授权平台，支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类资源。立即注册，还有机会参与我们的惊喜活动，赢取丰厚好礼！

点击这里开始Freelog之旅：http://www.freelog.com/

邀请码：{'InvitationCode'}`, {
              format: 'text/plain',
            });
          }}
        >复制内容</a>
      </div>
    </Modal>
  </>);
}

export default ChallengeColleague;
