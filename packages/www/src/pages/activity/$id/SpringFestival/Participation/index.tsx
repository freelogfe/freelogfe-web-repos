import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../shared.less';
import FComponentsLib from '@freelog/components-lib';
import { Modal, Space } from 'antd';
import fCenterMessage from '@/components/fCenterMessage';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import moment, { Moment } from 'moment';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import img_receive from '@/assets/activity/SpringFestival/receive.png';

interface ParticipationProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function Participation({ activityDetailsPage }: ParticipationProps) {
  const [$showRule, set$showRule, get$showRule] = FUtil.Hook.useGetState<boolean>(false);
  const [$isRegister, set$isRegister, get$isRegister] = FUtil.Hook.useGetState<boolean>(false);
  // userType
  AHooks.useMount(async () => {
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      return;
    }
    const { data }: {
      data: {
        userType: 0 | 1;
      }
    } = await FServiceAPI.User.currentUserInfo();
    // console.log(data, 'data sdijf;lsdkjfl;ksdjlfksjdlkfjlkjl');
    set$isRegister(data.userType === 1);
  });

  return (<>
    <div className={styles.participation}>
      <div className={sharedStyles.h1}>参与方式</div>

      <div className={styles.textContent} style={{ top: 108, left: 270 }}>
        前往freelog网页端，发布带有<FComponentsLib.FCopyToClipboard
        text={'新春召集令，freelog创作激励计划启动！'}
        title={'点击复制标签'}
      ><strong>#新春召集令，freelog创作激励计划启动！#</strong></FComponentsLib.FCopyToClipboard>标签的原创资源并成功签约至展示节点，完成一次节点或展品分享后即视为参与此次活动。
      </div>
      <div className={styles.textContent} style={{ top: 290, left: 182 }}>
        不限制内容形式，<strong>原创小说/文章、漫画、图片、音乐、播客、视频、游戏/主题/插件开发资源</strong>等均可发布。
      </div>
      <div className={styles.textContent} style={{ top: 446, left: 330 }}>
        由于平台尚在测试阶段，活动功能未全面开放。如您要参与活动，需点击下方报名入口获取内测资格。本次内测资格仅对前200名用户开放，名额有限，先到先得！
      </div>

      <Space size={25}>
        <a
          className={[sharedStyles.button, $isRegister ? sharedStyles.disabled : ''].join(' ')}
          onClick={async () => {
            if (get$isRegister()) {
              return;
            }
            if (!activityDetailsPage.startTime || !activityDetailsPage.endTime) {
              fCenterMessage({ message: '活动时间无效' });
              return;
            }
            if (moment().isBefore(activityDetailsPage.startTime)) {
              fCenterMessage({ message: '活动未开始' });
              return;
            }
            if (moment().isAfter(activityDetailsPage.endTime)) {
              fCenterMessage({ message: '活动已结束' });
              return;
            }
            const { data }: {
              data: {
                userType: 0 | 1;
              }
            } = await FServiceAPI.User.currentUserInfo();

            if (FUtil.Tool.getUserIDByCookies() === -1) {
              return;
            }
            // if (data.userType === 0) {
            //   fCenterMessage({ message: '此活动仅对内测用户开放!' });
            //   return;
            // }
            // if (FUtil.Tool.getUserIDByCookies() === -1) {
            //   // goTo=https%253A%252F%252Fconsole.testfreelog.com%252Finvitation
            //   self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({
            //     goTo: FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.invitation(),
            //   }));
            // } else {
            //
            // }
            self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.invitation());
          }}
        >{$isRegister ? '已经报名' : '立即报名'}</a>
        <a
          className={sharedStyles.button}
          onClick={() => {
            self.open('https://freelog3.freelog.com/home_freelog-query_id=62ce6f8a456ff0002e32915f');
          }}
        >查看操作教程</a>
        <a
          className={sharedStyles.button}
          onClick={() => {
            set$showRule(true);
          }}
        >活动规则</a>
      </Space>
    </div>
    <Modal
      open={$showRule}
      title={null}
      footer={null}
      // closable={false}
      width={1000}
      centered={true}
      style={{ borderRadius: 10, overflow: 'hidden' }}
      bodyStyle={{ height: 'calc(100vh - 200px)', padding: 0 }}
      onCancel={() => {
        set$showRule(false);
      }}
    >
      <div className={styles.article}>
        <div className={styles.content}>
          <div style={{ height: 40 }} />
          <div className={styles.h1}>活动规则</div>
          <div style={{ height: 40 }} />
          <div className={styles.h2}>一、活动时间</div>
          <div style={{ height: 15 }} />
          <div
            className={styles.p}>活动时间为{activityDetailsPage.startTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}至{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}，为保证您的活动参与体验，请尽量使用PC端访问freelog网页版；
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>二、结果公示</div>
          <div style={{ height: 15 }} />
          <div
            className={styles.p}>{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}之后，平台将对所有活动内容的合规性进行核查，最终活动结果将以公示日{activityDetailsPage.announceTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}的结果为准；
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>三、活动参与方式</div>
          <div style={{ height: 15 }} />
          <div className={styles.p}>当天成功发布至少一个带有#新春召集令，<strong>#新春召集令，freelog创作激励计划启动！#</strong>活动标签的原创资源并将其添加至节点后，完成一次节点或展品分享即视为完成当天活动任务，将被计算进累计完成活动天数，未添加活动标签的资源将不被视为有效参与；
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>四、活动资源要求</div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>1</div>
            <div
              className={styles.text}>原创小说/文章、漫画、图片、音乐、播客、视频、游戏/主题/插件开发等平台已支持类型资源均可发布，用户在选定资源类型后，需上传与该类型相匹配的资源文件，非有效资源文件将被官方工作人员审查后移除；
            </div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>2</div>
            <div className={styles.text}>虚假或无意义资源文件，以视频资源为例，上传仅有静止画面、白屏或黑屏内容等，将被官方工作人员审查后移除；</div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>3</div>
            <div
              className={styles.text}>参与本次活动的资源和展品必须在{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}之前保持上架状态，否则将有可能影响活动奖励发放；
            </div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>4</div>
            <div
              className={styles.text}>用户发布的资源必须为原创作品，禁止抄袭、搬运、代投、重复资源反复上传等；合作资源请指定用一个特定账号发布，不得多人重复发布；若资源因未获得授权产生纠纷，Freelog平台不承担任何法律责任；
            </div>
          </div>
          <div style={{ height: 20 }} />
          <div
            className={styles.small}>请务必遵守活动资源要求，{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}后经平台核查发现有任何影响奖励发放的情况，例如用户在完成累计7天打卡任务的过程中，有1天存在资源或展品不符合要求（如文件类型不正确、虚假、无意义的资源或已下架的状态），该用户将失去瓜分7天打卡奖励的资格，且用户在{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}之后重新上架或修改资源的行为将不会影响该结果的判定。此外，如果用户发行非原创资源，将被取消参与活动和获奖的资格。
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>五、活动常见Q&A：</div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>1</div>
            <div
              className={styles.text}>
              <div style={{ fontWeight: 600 }}>如何提交产品使用反馈</div>
              <div>用户可以Freelog【社区】的<FComponentsLib.FTextBtn
                style={{ display: 'inline-block' }}
                type={'primary'}
                onClick={() => {
                  self.open('https://forum.freelog.com/category/3');
                }}>【吐槽反馈区】</FComponentsLib.FTextBtn>，在该模块内发帖提交您的使用反馈和建议，Freelog工作人员会查看解答大家的反馈哦~
              </div>
            </div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>2</div>
            <div
              className={styles.text}>
              <div style={{ fontWeight: 600 }}>如何在授权合约流程中使用真实货币交易</div>
              <div>内测期间，Freelog暂不支持真实货币交易，为了便于用户体验资源授权合约交易中的付费相关功能，Freelog提供虚拟币——“羽币”支持。
                内测期间，羽币与真实货币无任何联系，Freelog平台不支持以任何形式、任何比例进行羽币与真实货币之间的兑换。
              </div>
            </div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>3</div>
            <div
              className={styles.text}>
              <div style={{ fontWeight: 600 }}>如何领取羽币</div>
              <div>
                <div>用户可以通过点击【个人中心】—【我的钱包】进入“羽币账户”界面，先点击激活您的羽币账户后，点击下方【立即领取】按钮即可领取100枚内测羽币。</div>
                <div style={{ height: 5 }} />
                <img src={img_receive} style={{ width: '100%' }} alt={''} />
                <div style={{ height: 5 }} />
                <div>更多活动问题答疑详见“<FComponentsLib.FTextBtn
                  style={{ display: 'inline-block' }}
                  type={'primary'}
                  onClick={() => {
                    self.open('https://freelog3.freelog.com/home_freelog-query_id=62d0d04f456ff0002e329537');
                  }}>常见问题</FComponentsLib.FTextBtn>”
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>六、违规警告</div>
          <div style={{ height: 15 }} />
          <div className={styles.p}>为保证活动公平，严禁用户恶意刷量、批量注册小号等作弊行为。若出现影响活动正常运行的违规操作，平台将立即取消参与和获奖资格；</div>
          <div style={{ height: 40 }} />
          <div className={styles.h1}>奖励规则</div>
          <div style={{ height: 40 }} />
          <div className={styles.h2}>一、奖励入围要求</div>
          <div style={{ height: 15 }} />
          <div className={styles.p}>所有奖励入围要求在活动期间至少成功发布了一个合规资源及成功签约添加至节点，并完成一次节点或展品分享者；</div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>二、奖励发放时间</div>
          <div style={{ height: 15 }} />
          <div className={styles.p}>活动奖励将在结果公示期结束后，即在官方公布最终获奖名单后的15个工作日内，发放至获奖用户的freelog账号名下；</div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>三、奖励查看及提取流程</div>
          <div style={{ height: 15 }} />
          <div
            className={styles.p}>获奖用户需登录freelog平台，进入“个人中心”—“活动奖励”模块，查看获得的奖励金额。用户需绑定指定的支付平台，以确保奖励能够顺利提取。由于支付平台的限制，每日可提取现金的上限为200元。因个人原因未能成功领取奖励则视为自愿放弃；
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.h2}>四、奖励领取注意事项</div>
          <div style={{ height: 15 }} />
          <div className={styles.p}>获奖用户需确保提供的个人信息真实有效，否则可能导致奖励领取失败。若在奖励发放过程中遇到任何问题，用户可联系freelog官方工作人员，我们将尽快为您解决。</div>
          <div style={{ height: 40 }} />
          <div className={styles.h1}>注意事项及平台声明</div>
          <div style={{ height: 40 }} />
          <div className={styles.list}>
            <div className={styles.order}>1</div>
            <div
              className={styles.text}>活动期内所有用户须遵守<FComponentsLib.FTextBtn
              style={{ display: 'inline-block' }}
              onClick={() => {
                self.open('https://freelog2.freelog.com/reader_freelog-query_id=62cce8f2456ff0002e328eb2');
              }}
            >《Freelog平台管理规范》</FComponentsLib.FTextBtn>，违规者平台有权取消其活动资格并扣除奖励不予发放；
            </div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>2</div>
            <div
              className={styles.text}>活动期间开放举报通道，用户可以通过联系官方工作人员或向Freelog发送邮件（service@freelog.com）对涉嫌违规的行为和用户进行举报。
              举报邮件内容需包含被举报作品名称、作品链接、涉嫌违规原因，否则不予处理；
            </div>
          </div>
          <div style={{ height: 15 }} />
          <div className={styles.list}>
            <div className={styles.order}>3</div>
            <div
              className={styles.text}>活动最终解释权归freelog所有，如有疑问请联系官方工作人员或发送邮件至官方邮箱service@freelog.com。
            </div>
          </div>
          <div style={{ height: 40 }} />
        </div>
      </div>
    </Modal>
  </>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(Participation);
