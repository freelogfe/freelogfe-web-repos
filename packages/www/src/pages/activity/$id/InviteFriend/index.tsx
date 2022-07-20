import * as React from 'react';
import './index.less';
import card from '@/assets/invitefriend/card.png';
import cash from '@/assets/invitefriend/cash.png';
import code from '@/assets/invitefriend/code.png';
import friend from '@/assets/invitefriend/friend.png';
// import gift from '@/assets/invitefriend/gift.svg';
import invite from '@/assets/invitefriend/invite.png';
// import inviteicon from '@/assets/invitefriend/inviteicon.png';
// import menu from '@/assets/invitefriend/menu.png';
import task from '@/assets/invitefriend/task.png';
// import FTooltip from '@/components/FTooltip';
import copy from 'copy-to-clipboard';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

import { FRectBtn } from '@/components/FButton';

interface InviteFriendProps {}

function InviteFriend({}: InviteFriendProps) {
  const [showInvite, setShowInvite] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<any>({});
  const [records, setRecords] = React.useState<any>([]);
  const getData = async () => {
    const task = await FServiceAPI.TestQualification.usedRecords({});
    console.log(task);
    const res = await FServiceAPI.TestQualification.codeDetails2({});
    setUserData({
      ...res.data,
      textCopy: `邀你一起参与Freelog内测啦！Freelog是国内首家基于智能合约的资源自动化交易平台，参与内测活动至少可领【58元】现金奖励，发布图片、小说、漫画等资源还可赢取【3000元】现金奖励！活动仅限800人，快快戳链接注册参与吧！
    \n邀请码${
      ' ' + userData.code + ' '
    }\n\n 前往Freelog注册：https://www.freelog.com/`,
    });
  };
  React.useEffect(() => {
    getData();
  }, []);
  // React.useEffect(()=>{
  //   console.log(FServiceAPI.User.currentUserInfo())
  //   setUserData(FServiceAPI.User.currentUserInfo())
  // },[])
  const scrollToAnchor = (anchorName: any) => {
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
  };
  return (
    <div className={'invite-friend flex-column align-center y-auto'}>
      <div
        className={'flex-column align-center y-auto w-100x'}
        onClick={() => setShowInvite(false)}
      >
        <div className="h-680 flex-column-center w-100x ">
          <div className="w-100x h-100x over-h">
            <img src={invite} alt="" className="h-100x banner-img" />
          </div>
          <div className="banner-container flex-column-center w-100x">
            <div className="banner">
              <div className="flex-row mb-15  align-end">
                <span></span>
                <span className="title">
                  邀请好友一起参与内测，可领20元现金奖励！
                </span>
                <span className="tip">(被邀请好友完成任务可领3元现金奖励)</span>
              </div>
              <div className="flex-row mb-15">
                <span></span>
                <span className="title">
                  同时抽取5位成功邀请好友的用户赠送价值400元的京东购物卡！
                </span>
              </div>
              <div className="flex-row mb-70">
                <span></span>
                <span className="title">
                  内测活动仅限800人，快快邀请好友参与吧！
                </span>
              </div>
              <div className="flex-row align-end">
                <span></span>
                <span className="title">更多现金奖励领取方式尽在</span>
                <span className="way px-10">Freelog内测玩法指南</span>
                <span className="tip">(至少可领58元现金奖励哦!)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-column praise w-100x align-center">
          <div className="category">活动奖励</div>
          <div className="container flex-column align-center">
            <span className="title mt-50">奖励一</span>
            <div className="flex-row title2 align-end">
              <span className="">
                活动期间，成功邀请好友参与Freelog内测，可获得对应现金奖励，累计最高可得
              </span>
              <span className="cash ">20元</span>
              <span className="">现金</span>
            </div>
            <div className="h-180 over-h ">
              <img src={cash} alt="" className="h-100x" />
            </div>
            <span className="title mt-50">奖励二</span>
            <div className="flex-row title2 align-end">
              <span className="">抽取5位成功邀请好友的用户，赠送价值</span>
              <span className="cash ">400元</span>
              <span className="">的京东购物卡（电子卡）！</span>
            </div>
            <div className="h-220 over-h ">
              <img src={card} alt="" className="h-100x" />
            </div>
          </div>
        </div>
        <div className="flex-column steps w-100x align-center">
          <div className="category">参与步骤</div>
          <div className="container flex-column align-center pt-50">
            <div className="flex-row  w-100x pl-43 pr-35">
              <span className="des w-180 mr-87">
                向好友分享
                <br />
                链接及邀请码
              </span>
              <span className="des w-180 mr-87">
                好友使用
                <br />
                邀请码注册
              </span>
              <span className="des w-180 mr-87">
                好友完成
                <br />
                指定任务
              </span>
              <span className="des w-180">
                领取
                <br />
                现金奖励
              </span>
            </div>
            <div className="flex-row w-100x mt-40 pl-43 pr-71  align-center">
              <div className=" flex-column-center pl-65 pr-20">
                <div className="step flex-column-center">1</div>
              </div>
              <div className="arrow"></div>
              <div className=" flex-column-center px-20">
                <div className="step flex-column-center">2</div>
              </div>
              <div className="arrow"></div>
              <div className=" flex-column-center px-20 p-rel">
                <div className="step flex-column-center mt-12">3</div>
                <div className="flex-column-center look-task">
                  <a
                    className=" mt-10  link"
                    onClick={() => scrollToAnchor('inner-test')}
                  >
                    查看指定任务
                  </a>
                </div>
              </div>
              <div className="arrow"></div>
              <div className=" flex-column-center px-20">
                <div className="step flex-column-center">4</div>
              </div>
            </div>
            <FRectBtn
              className="invite-button mt-88"
              disabled={userData.usedCount >= userData.limitCount}
              onClick={(e) => {
                setShowInvite(true);
                e.stopPropagation();
              }}
            >
              立即邀请
            </FRectBtn>
            <div className="flex-row w-260 space-between mt-10">
              <span className="invite-left">
                还可邀请 {userData.limitCount - userData.usedCount} 位好友
              </span>
              <a className="get-more link">获取更多名额</a>
            </div>
            <div className="record mt-60 w-100x">
              <div className="flex-row title-row align-end">
                <div className="flex-row align-end c1">
                  <span className="title">我的邀请记录</span>
                  <span className="tip">
                    好友在注册后的7天内完成指定任务，即可领取奖励
                  </span>
                </div>
                <span className="tip c2">最近更新</span>
                <span className="tip c3">奖励进度</span>
              </div>
              <div className="flex-row row">
                <span className="item c1">张三（88******q.com）</span>
                <span className="item c2">2021/02/21</span>
                <span className="item c3">已到账</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-column tutorial w-100x align-center">
          <div className="category">邀请攻略</div>
          <div className="flex-row container space-between">
            <div className="h-590 over-h ">
              <img src={friend} alt="" className="h-100x" />
            </div>
            <div className="h-590 over-h ">
              <img src={code} alt="" className="h-100x" />
            </div>
            <div className="h-590 over-h ">
              <img src={task} alt="" className="h-100x" />
            </div>
          </div>
        </div>
        <div className="flex-column rule w-100x align-center" id="inner-test">
          <div className="category">活动规则</div>
          <div className="flex-column container space-between">
            <span className="">
              1.&nbsp; &nbsp;内测活动时间：2021/**/** - 2021/**/**；
            </span>
            <span className="">
              2.&nbsp;
              &nbsp;内测活动仅限800名用户参与，在Freelog内测用户满800人后，邀请好友活动暂停，未成功使用的邀请码将暂时失效，已邀请且已注册的好友完成指定任务后仍可获得现金奖励；
            </span>
            <span className="">
              3.&nbsp;
              &nbsp;每位用户在内测活动期间可获得1个邀请码，邀请码的有效使用次数为5次，其中2次需完成特定新手任务解锁。好友填写邀请码注册成功后，即消耗1次使用次数；
            </span>
            <span className="">
              4.&nbsp;
              &nbsp;将邀请链接及个人邀请码分享给好友，好友通过您分享的链接和邀请码注册Freelog平台账号，并在7天内完成新手任务中的「资源系列任务」或「节点系列任务」，您可领取3—20元现金奖励（累计奖励），同时好友可获得3元现金奖励；
            </span>
            <span className="">
              5.&nbsp;
              &nbsp;随机抽取4位成功邀请好友的用户赠送价值400元的京东购物卡（电子卡），中奖用户名单将于2020年***公布；
            </span>
            <span className="">
              6.&nbsp; &nbsp;现金奖励发放方式及提现要求说明；
            </span>
            <span className="">
              7.&nbsp;
              &nbsp;对于存在非正常邀请行为的用户，平台将取消其活动参与资格，并扣除相应奖励不予结算；
            </span>
            <span className="">
              8.&nbsp; &nbsp;活动最终解释权归Freelog平台所有。
            </span>
          </div>
        </div>
      </div>
      <div
        className={
          'invite-text flex-column align-center pt-30 pb-25 ' +
          (showInvite ? '' : 'd-none')
        }
      >
        <textarea
          readOnly
          className="input mb-20"
          value={userData.textCopy || ''}
        />
        <FRectBtn
          onClick={() => {
            copy(userData.textCopy);
            fMessage(<span>复制成功！</span>, 'success');
          }}
        >
          复制内容
        </FRectBtn>
      </div>
    </div>
  );
}

export default InviteFriend;
