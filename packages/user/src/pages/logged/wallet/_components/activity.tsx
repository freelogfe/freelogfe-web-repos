import * as React from 'react';
import styles from './index.less';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import reward from '@/assets/reward.jpg';
import bindWarning from '@/assets/bind-warning.png';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { Modal } from 'antd';
import star from '@/assets/star.svg';
import 'animate.css';
import url from '*.svg';

interface CoinActivity {
  goActive: any;
  signSuccess?: any;
  inActive: boolean;
}

function CoinActivity(props: CoinActivity) {
  const [datas, setDatas] = React.useState({
    amount: 0,
    amountSum: '0',
    isSign: true,
  });
  const [showTip, setShowTip] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [amountSum, setAmountSum] = React.useState(0);
  const [showAccountTip, setShowAccountTip] = React.useState(false);

  AHooks.useMount(() => {
    getData();
  });

  async function sign() {
    setLoading(true);
    let { ret, errCode, data } = await FServiceAPI.User.signForCoins();
    // console.log(ret, errCode, data, '09ewiokfjlskdfjsldklll');
    if (data) {
      self._czc?.push(['_trackEvent', '个人中心页', '立即领取羽币', '', 1]);
      setTimeout(() => {
        getData(true);
        setLoading(false);
      }, 1000);
    } else {
      self._czc?.push(['_trackEvent', '个人中心页', '立即领取羽币', '', 0]);
      setLoading(false);
    }
  }

  const getData = async (sec?: boolean) => {
    const data = await FServiceAPI.User.getSignInfo();
    data.data.amountSum = parseFloat(data.data.amountSum);
    if (sec) {
      setSuccess(true);
      setDatas(data.data);
      const inter = Math.floor(1000 / (data.data.amountSum - amountSum));
      setTimeout(() => {
        const timer = setInterval(() => {
          setAmountSum((pre) => {
            if (pre >= data.data.amountSum) {
              clearInterval(timer);
              props.signSuccess();
              return data.data.amountSum;
            }
            return pre + 1;
          });
        }, inter);

      }, 1000);
    } else {
      setDatas(data.data);
      setAmountSum(data.data.amountSum);
    }
  };

  return (
    <div className='w-100x h-170 mt-20 flex-column'>
      <div
        className={'w-100x h-100x flex-column p-20 p-abs ' + styles.actionContainer}
        // style={{backgroundImage: `url(${reward})`}}
      >
        <div className={'flex-row align-center'}>
          {datas.isSign ? (
            <span
              className={
                styles.title2 + ' mt-7 ' + (success ? styles.titleMove : '')
              }
            >
              今日已领取，明天再来吧～
            </span>
          ) : (
            <>
              <span className={styles.title}>{datas.amount}枚羽币待领取</span>
              <FComponentsLib.FRectBtn
                type='primary'
                size='small'
                className='py-9 fs-14 w-96'
                onClick={() => {
                  if (props.inActive) {
                    setShowAccountTip(true);
                    return;
                  }
                  !loading && sign();
                }}
              >
                {loading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 18, color: 'white' }}
                        spin
                      />
                    }
                  />
                ) : (
                  '立即领取'
                )}
              </FComponentsLib.FRectBtn>
            </>
          )}
        </div>
        <div className='flex-row align-center'>
          <div
            className={
              styles.flight +
              ' p-abs  ' +
              (datas.isSign && success ? styles.lightMove : '')
            }
          />
          <div className={styles.total + ' ' + (datas.isSign ? 'mt-20' : 'mt-13')}>累计领取数量：{amountSum}枚</div>
          {datas.isSign && success ? (
            <div className={'w-18 ml-8 mb-10 ' + styles.starMove}>
              <img src={star} alt='' className='w-100x' />
            </div>
          ) : null}
        </div>

        <span className={styles.tip}>
          每日登陆领取羽币，活动时间：{FI18n.i18nNext.t('event_contest_eventperiod')}
        </span>
        <div className='flex-row mt-5'>
          <span className={styles.tip}>
            内测期间用户每天登录，首次可领取100羽币，以后每日登录可领取30羽币
          </span>
          <span className={styles.link} onClick={() => setShowTip(true)}>
            查看活动规则
          </span>
        </div>
      </div>
      {/*<img src={reward} alt='' className='w-100x' />*/}
      <Modal
        title={null}
        onCancel={() => setShowAccountTip(false)}
        visible={showAccountTip}
        footer={null}
        centered
        width={580}
      >
        <div className='w-100x flex-column-center'>
          <div className={styles.accountTitle}>提示</div>
          <div className='w-72 mt-60 mb-20'>
            <img src={bindWarning} className='w-100x' />
          </div>
          <div className={styles.middleTip}>需要激活羽币账户才能参加活动</div>
          <FComponentsLib.FRectBtn
            type='primary'
            size='small'
            className='py-9 fs-14 mt-60'
            onClick={() => {
              setShowAccountTip(false);
              props.goActive();
            }}
          >
            激活羽币账户
          </FComponentsLib.FRectBtn>
          <div
            className={styles.bottomTip + ' mt-20 mb-15'}
            onClick={() => {
              setShowAccountTip(false);
            }}
          >
            稍后再说
          </div>
        </div>
      </Modal>
      <Modal
        title={null}
        onCancel={() => setShowTip(false)}
        visible={showTip}
        footer={null}
        centered
        wrapClassName='login-reward'
        width={740}
      >
        <div className='w-692 h-509 px-46 py-10'>
          <div className='flex-row-center '>
            <span className={styles.tiptile}>每日登陆领取羽币</span>
          </div>
          <div className={styles.text + ' mt-20'}>活动时间</div>
          <div className='flex-row mt-10 align-center'>
            <span className={styles.text1}>内测期间：{FI18n.i18nNext.t('event_contest_eventperiod')}</span>
          </div>
          <div className={styles.text + ' mt-20'}>羽币领取规则</div>
          <div className='flex-row mt-10 align-center'>
            <div className={styles.dot} />
            <span className={styles.text1}>
              首次领取羽币，需激活羽币账号，激活成功后即可领取100羽币；
            </span>
          </div>
          <div className='flex-row mt-10 align-center'>
            <div className={styles.dot} />
            <span className={styles.text1}>
              可通过每日登陆领取羽币，内测活动期间
              ，用户每日成功登陆Freelog，即可领取30羽币；
            </span>
          </div>
          <div className='flex-row mt-10 align-center'>
            <div className={styles.dot} />
            <span className={styles.text1}>
              内测活动期间，羽币领取上限为1000羽币。
            </span>
          </div>

          <div className={styles.text + ' mt-20'}>羽币使用规则</div>
          <div className='flex-row mt-10 align-center'>
            <div className={styles.dot} />
            <span className={styles.text1}>
              羽币可用于购买Freelog平台上的资源或展品授权；
            </span>
          </div>
          <div className='flex-row mt-10 align-center'>
            <div className={styles.dot} />
            <span className={styles.text1}>羽币仅限内测活动期间使用。</span>
          </div>

          <div className={styles.text + ' mt-20'}>羽币兑换规则</div>
          <div className='flex-row mt-10 align-center'>
            <div className={styles.dot + ' shrink-0'} />
            <div className={styles.text1 + ' text-breakAll'}>
              内测期间，Freelog暂不支持真实货币交易，为了便于用户体验资源授权合约交易中的付费相关功能，Freelog提供虚拟币——“羽币”支持。
            </div>
          </div>
          <div className='flex-row mt-30 align-center'>
            <div className={styles.dot + ' shrink-0'} />
            <div className={styles.text1 + ' text-breakAll'}>
              内测期间，羽币与真实货币无任何联系，Freelog平台不支持以任何形式、任何比例进行羽币与真实货币之间的兑换。
            </div>
          </div>
          {/*<div className='flex-row mt-10 align-center'>*/}
          {/*  <div className={styles.dot + ' shrink-0'} />*/}
          {/*  <div className={styles.text1 + ' text-breakAll'}>*/}
          {/*    羽币为Freelog平台的虚拟货币，与真实货币无任何联系，Freelog平台不支持以任何形式、任何比例进行羽币与真实货币中间的兑换；*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className='flex-row mt-30 align-center'>*/}
          {/*  <div className={styles.dot + ' shrink-0'} />*/}
          {/*  <div className={styles.text1 + ' text-breakAll'}>*/}
          {/*    用户在内测活动期间，使用羽币购买资源或展品授权的次数达到3次及以上，内测活动结束后，积累的羽币可在Freelog积分商城进行奖品兑换，使用羽币购买资源或展品授权的次数少于3次，内测活动结束后，所得羽币将会清零。*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </Modal>
    </div>
  );
}

export default CoinActivity;
