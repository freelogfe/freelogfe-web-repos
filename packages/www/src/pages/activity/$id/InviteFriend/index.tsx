import * as React from 'react';
import './index.less';
import card from '@/assets/invitefriend/card.png';
import cash from '@/assets/invitefriend/cash.png';
import code from '@/assets/invitefriend/code.png';
import friend from '@/assets/invitefriend/friend.png';
import invite from '@/assets/invitefriend/invite.png';
import task from '@/assets/invitefriend/task.png';
import copy from 'copy-to-clipboard';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { withRouter } from 'umi';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import FFooter from '@/components/Footer';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';

const states = {
  expire: '已过期',
  onRoad: '在路上',
  received: '已到账',
} as const;

interface InviteFriendProps extends RouteComponentProps<{ id: string }> {
  // dispatch: Dispatch;
  activityDetailsPage: ActivityDetailsPageModelState;
}

function InviteFriend({ activityDetailsPage }: InviteFriendProps) {
  const [showInvite, setShowInvite] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<any>({});
  const [records, setRecords] = React.useState<{
    userId: number;
    username: string;
    createDate: string;
    email: string;
    mobile: string;
    state: 'expire' | 'onRoad' | 'received';
  }[]>([]);

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
    getData();
  });

  async function getData() {
    const userID: number = FUtil.Tool.getUserIDByCookies();
    if (userID !== -1) {
      const {
        data: data_invitees,
      }: {
        data: {
          userId: number;
          username: string;
          invitedDate: string;
          email: string;
          mobile: string;
        }[];
      } = await FServiceAPI.TestQualification.invitees({ userId: userID });
      // console.log(data, 'task093iolksdfjlsdkfjlsdfjk');
      // setRecords(task.data.dataList);

      const { data: data_friendInfos } =
        await FServiceAPI.Activity.listInviteFriendInfos(
          data_invitees.map((di) => {
            return {
              userId: di.userId,
              username: di.username,
              createDate: di.invitedDate,
            };
          }),
        );

      // console.log(
      //   data_friendInfos,
      //   '111data_friendInfosi9oewdsfklsdjflsdkjflsdkjflkj',
      // );

      setRecords(
        data_invitees.map((d) => {
          const status: 0 | 1 | 3 =
            data_friendInfos.find((df: any) => {
              return df.friendId === d.userId;
            })?.status || 0;

          let state: 'expire' | 'onRoad' | 'received';

          switch (status) {
            case 0:
              state = 'expire';
              break;
            case 1:
              state = 'onRoad';
              break;
            case 3:
              state = 'received';
              break;
          }
          return {
            ...d,
            createDate: FUtil.Format.formatDateTime(d.invitedDate),
            state,
          };
        }),
      );
    }

    const res = await FServiceAPI.TestQualification.codeDetails2({});
    let userInfo = { data: {} };
    userInfo =
      userID > -1 ? await FServiceAPI.User.currentUserInfo() : userInfo;
    // console.log(userInfo);
    // setUserData({
    //   userInfo: userInfo.data,
    //   ...res.data,
    //   textCopy: `邀你一起参与Freelog内测啦！Freelog是国内首家基于智能合约的资源自动化交易平台，参与内测活动至少可领【58元】现金奖励，发布图片、小说、漫画等资源还可赢取【3000元】现金奖励！活动仅限800人，快快戳链接注册参与吧！
    // \n邀请码${
    //     ' ' + res.data.code + ' '
    //   }\n\n 前往Freelog注册：https://www.freelog.com/`,
    // });
    setUserData({
      userInfo: userInfo.data,
      ...res.data,
      textCopy: `邀你一起参与Freelog内测啦！Freelog，国内首家基于智能合约的资源自动化交易平台，参与内测至少可领【61元】现金奖励，发布小说、漫画等资源还可赢取【2000元】现金奖励！活动仅限800人，快快戳链接注册参与吧！


前往Freelog注册：${FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon({ invitationCode: res.data.code })}


邀请码：${res.data.code}
`,
    });
  }

  function scrollToAnchor(anchorName: any) {
    let state: any = {
      behavior: 'smooth',
      block: 'start',
    };
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView(state);
      }
    }
  }

  return (
    <div className={'invite-friend flex-column align-center y-auto'}>
      <div
        className={'flex-column align-center y-auto w-100x'}
        onClick={() => setShowInvite(false)}
      >
        <div className='h-680 flex-column-center w-100x '>
          <div className='w-100x h-100x over-h'>
            <img src={invite} alt='' className='h-100x banner-img' />
          </div>
          <div className='banner-container flex-column-center w-100x'>
            <div className='banner'>
              <div className='flex-row mb-15  align-end'>
                <span />
                <span className='title'>
                  邀请好友一起参与内测，可领20元现金奖励！
                </span>
                <span className='tip'>(被邀请好友参与内测可领3元现金奖励)</span>
              </div>
              <div className='flex-row mb-15'>
                <span />
                <span className='title'>
                  同时抽取5位成功邀请好友的用户赠送价值100元的京东购物卡！
                </span>
              </div>
              <div className='flex-row mb-70'>
                <span />
                <span className='title'>
                  内测活动仅限200人，快快邀请好友参与吧！
                </span>
              </div>
              <div className='flex-row align-end'>
                <span />
                <span className='title'>更多现金奖励领取方式尽在</span>
                <a
                  className='way px-10'
                  href={FI18n.i18nNext.t(
                    'beta_event_referralprogram_guideline_link',
                  )}
                  target={'_blank'}
                >
                  Freelog内测玩法指南
                </a>
                <span className='tip'>(至少可领61元现金奖励哦!)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-column praise w-100x align-center'>
          <div className='category'>
            <div className='invite-circle active-reward'>
              <div className='circle-inside'></div>
            </div>
            <span>活动奖励</span>
          </div>
          <div className='container flex-column align-center'>
            <span className='title mt-50'>奖励一</span>
            <div className='flex-row title2 align-end'>
              <span className=''>
                活动期间，成功邀请好友参与Freelog内测，可获得对应现金奖励，累计最高可得
              </span>
              <span className='cash '>20元</span>
              <span className=''>现金</span>
            </div>
            <div className='h-180 over-h '>
              <img src={cash} alt='' className='h-100x' />
            </div>
            <span className='title mt-50'>奖励二</span>
            <div className='flex-row title2 align-end'>
              <span className=''>抽取5位成功邀请好友的用户，赠送价值</span>
              <span className='cash '>100元</span>
              <span className=''>的京东购物卡（电子卡）！</span>
            </div>
            <div className='h-220 over-h '>
              <img src={card} alt='' className='h-100x' />
            </div>
          </div>
        </div>
        <div className='flex-column steps w-100x align-center'>
          <div className='category'>
            <div className='invite-circle active-step'>
              <div className='circle-inside'></div>
            </div>
            <span>参与步骤</span>
          </div>
          <div
            className={
              'container flex-column align-center pt-50 ' +
              (records.length != 0 ? 'h-796' : 'h-460')
            }
          >
            {/*<div className='flex-row  w-100x pl-43 pr-35'>*/}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
              className={'des'}
            >
              <div style={{
                flexBasis: '25%',
                textAlign: 'center',
              }} className={'des'}>
                {/*向好友分享*/}
                分享邀请码
                <br />
                给好友
              </div>
              <div style={{
                flexBasis: '25%',
                textAlign: 'center',
              }}>
                好友完成
                <br />
                Freelog网站注册
              </div>
              <div style={{
                flexBasis: '25%',
                textAlign: 'center',
              }} className={'des'}>
                好友用邀请码
                <br />
                激活内测资格
              </div>
              <div style={{
                flexBasis: '25%',
                textAlign: 'center',
              }} className={'des'}>
                奖励
                <br />
                到账
              </div>
            </div>
            <div className='flex-row w-100x mt-40 pl-43 pr-71  align-center'>
              <div className=' flex-column-center pl-65 pr-20'>
                <div className='step flex-column-center'>1</div>
              </div>
              <div className='arrow' />
              <div className=' flex-column-center px-20'>
                <div className='step flex-column-center'>2</div>
              </div>
              <div className='arrow' />
              <div className=' flex-column-center px-20 p-rel'>
                <div className='step flex-column-center mt-12'>3</div>
                <div className='flex-column-center look-task'>
                  {/*<a*/}
                  {/*  className=' mt-10  link'*/}
                  {/*  onClick={() => scrollToAnchor('inner-test')}*/}
                  {/*>*/}
                  {/*  查看指定任务*/}
                  {/*</a>*/}
                </div>
              </div>
              <div className='arrow' />
              <div className=' flex-column-center px-20'>
                <div className='step flex-column-center'>4</div>
              </div>
            </div>
            <FComponentsLib.FRectBtn
              className='invite-button mt-88'
              disabled={
                userData.usedCount >= userData.limitCount ||
                activityDetailsPage.timeValidity !== 'Validity'
              }
              onClick={(e) => {
                if (!userData.limitCount) return;
                if (userData.userInfo.userType != 1) {
                  fMessage(<span>此活动仅对内测用户开放!</span>, 'warning');
                  return;
                }
                self._czc?.push([
                  '_trackEvent',
                  '邀请好友页',
                  '立即邀请',
                  '',
                  1,
                ]);
                setShowInvite(true);
                e.stopPropagation();
              }}
            >
              {/*{taskInfo.status === 4 ? '立即邀请' : status[taskInfo.status]}*/}
              {activityDetailsPage.timeValidity === 'NotStart'
                ? '即将开始'
                : activityDetailsPage.timeValidity === 'Finished'
                  ? '已经结束'
                  : userData.limitCount
                    ? '立即邀请'
                    : '登录后立即邀请'}
            </FComponentsLib.FRectBtn>
            <div className='flex-row w-260 space-between mt-10'>
              {userData.limitCount && (
                <span className='invite-left'>
                  还可邀请 {userData.limitCount - userData.usedCount} 位好友
                </span>
              )}
              {userData.usedCount < 5 && (
                <a
                  className='get-more link'
                  onClick={() => {
                    self._czc?.push([
                      '_trackEvent',
                      '邀请好友页',
                      '获取更多邀请名额',
                      '',
                      1,
                    ]);
                    scrollToAnchor('inner-test');
                  }}
                >
                  获取更多名额
                </a>
              )}
            </div>
            {records.length != 0 && (
              <div className='record mt-60 w-100x'>
                <div className='flex-row title-row align-end'>
                  <div className='flex-row align-end c1'>
                    <span className='title'>我的邀请记录</span>
                    <span className='tip'>
                      好友在注册后的7天内完成指定任务，即可领取奖励
                    </span>
                  </div>
                  <span className='tip c2'>最近更新</span>
                  <span className='tip c3'>奖励进度</span>
                </div>

                {records.length === 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                    }}
                  >
                    <FComponentsLib.FContentText
                      text={'暂无'}
                      type={'additional2'}
                    />
                  </div>
                )}
                {records.map((r) => {
                  return (
                    <div className='flex-row row' key={r.userId}>
                      <span className='item c1'>
                        {r.username}（{r.mobile || r.email || '****'}）
                      </span>
                      <span className='item c2'>{r.createDate}</span>
                      <span className='item c3'>
                        {states[r.state] || '未知'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className='flex-column tutorial w-100x align-center'>
          <div className='category'>
            <div className='invite-circle active-policy'>
              <div className='circle-inside' />
            </div>
            <span>邀请攻略</span>
          </div>
          {/*<div className='flex-row container'>*/}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 1060 }}>
            {/*<div className='h-590 over-h '>*/}
            <div style={{ width: 515 }}>
              <img src={friend} alt='' style={{ width: '100%' }} />
            </div>
            {/*<div className='h-590 over-h '>*/}
            <div style={{ width: 515 }}>
              <img src={code} alt='' style={{ width: '100%' }} />
            </div>
            {/*<div className='h-590 over-h '>*/}
            {/*  <img src={task} alt='' className='h-100x' />*/}
            {/*</div>*/}
          </div>
        </div>
        <div className='flex-column rule w-100x align-center' id='inner-test'>
          <div className='category'>
            <div className='invite-circle active-rule'>
              <div className='circle-inside' />
            </div>
            <span>活动规则</span>
          </div>
          <div className='flex-column container space-between'>
            <span className=''>
              1.&nbsp; &nbsp;内测活动时间：
              {activityDetailsPage.startTime?.format('YYYY/MM/DD') ||
                'YYYY/MM/DD'}{' '}
              -{' '}
              {activityDetailsPage.endTime?.format('YYYY/MM/DD') ||
                'YYYY/MM/DD'}
              ；
            </span>
            {/*<span className=''>*/}
            {/*  2.&nbsp;*/}
            {/*  &nbsp;内测活动仅限800名用户参与，在Freelog内测用户满800人后，邀请好友活动暂停，未成功使用的邀请码将暂时失效，已邀请且已注册的好友完成指定任务后仍可获得现金奖励；*/}
            {/*</span> */}
            <span className=''>
              2.&nbsp;
              &nbsp;内测活动仅限200名用户参与，在Freelog内测用户满200人后，邀请好友活动将会暂停；
            </span>
            {/*<span className=''>*/}
            {/*  3.&nbsp;*/}
            {/*  &nbsp;每位用户在内测活动期间可获得1个邀请码，邀请码的有效使用次数为3次。*/}
            {/*  完成*/}
            {/*  <a*/}
            {/*    href={FI18n.i18nNext.t('beta_event_guideline_newbie_link')}*/}
            {/*    target={'_blank'}*/}
            {/*  >*/}
            {/*    新手任务*/}
            {/*  </a>*/}
            {/*  中的【完善个人信息】【*/}
            {/*  Freelog社区签到】两个小任务，可额外各获得一个邀请名额。好友填写邀请码注册成功后，即消耗1次使用次数；*/}
            {/*</span>*/}
            <span className=''>
              3.&nbsp;
              &nbsp;将邀请链接及个人邀请码分享给好友，好友通过您分享的链接和邀请码注册Freelog平台账号，您可领取3—20元现金奖励（累计奖励），同时好友可获得3元现金奖励；内测期间成功邀请好友所获取的累计奖励可在【个人中心】—【活动奖励】提现至微信钱包；
            </span>
            <span className=''>
              4.&nbsp;
              &nbsp;随机抽取5位成功邀请好友的用户赠送价值100元的京东购物卡（电子卡），中奖用户名单将于
              {activityDetailsPage.announceTime?.format('YYYY年MM月DD日') ||
                'YYYY年MM月DD日'}
              公布；
            </span>
            {/*<span className=''>*/}
            {/*  5.&nbsp;*/}
            {/*  &nbsp;现金奖励发放方式及提现要求说明；*/}
            {/*</span>*/}
            <span className=''>
              5.&nbsp;
              &nbsp;每位用户在内测活动期间可获得1个邀请码，邀请码的有效使用次数为5次，其中2次需完成特定新手任务解锁。好友填写邀请码注册成功后，即消耗1次使用次数；
            </span>
            {/*<div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>*/}
            {/*  <span className=''>*/}
            {/*    6.&nbsp; &nbsp;邀请好友参与Freelog内测活动*/}
            {/*    ，好友在7天内完成相应指定任务，即可领取3-20元现金奖励。可通过*/}
            {/*  </span>*/}
            {/*  <FComponentsLib.FTextBtn*/}
            {/*    type={'primary'}*/}
            {/*    onClick={() => {*/}
            {/*      self.open(*/}
            {/*        FUtil.Format.completeUrlByDomain('user') +*/}
            {/*        FUtil.LinkTo.reward(),*/}
            {/*      );*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    【个人中心】—【活动奖励】*/}
            {/*  </FComponentsLib.FTextBtn>*/}
            {/*  <span>，将内测期间领取的现金奖励申请提现至微信钱宝。</span>*/}
            {/*</div>*/}
            <span className=''>
              6.&nbsp;
              &nbsp;对于存在非正常邀请行为的用户，平台将取消其活动参与资格，并扣除相应奖励不予结算；
            </span>
            <span className=''>
              7.&nbsp; &nbsp;活动最终解释权归Freelog平台所有。
            </span>
          </div>
        </div>
        <FFooter />
      </div>
      {
        showInvite && (<div
          className={'invite-text-container'}
          onClick={() => setShowInvite(false)}
        >
          <div
            className={'invite-text flex-column align-center pt-30 pb-25 '}
            onClick={(e) => e.stopPropagation()}
          >
          <textarea
            readOnly
            className='input mb-20'
            value={userData.textCopy || ''}
          />
            <FComponentsLib.FRectBtn
              onClick={() => {
                copy(userData.textCopy, {
                  format: 'text/plain',
                });
                fMessage(<span>复制成功！</span>, 'success');
              }}
            >
              复制内容
            </FComponentsLib.FRectBtn>
          </div>
        </div>)
      }

    </div>
  );
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(withRouter(InviteFriend));
