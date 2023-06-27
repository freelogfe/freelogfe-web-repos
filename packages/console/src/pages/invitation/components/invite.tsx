import * as React from 'react';
import styles from './invite.less';
import * as AHooks from 'ahooks';
// import FInput from '@/components/FInput';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { history } from 'umi';
import useUrlState from '@ahooksjs/use-url-state';
import fMessage from '@/components/fMessage';
import FComponentsLib from '@freelog/components-lib';

interface InviteProps {
  jump: any;
}

function Invite({ jump }: InviteProps) {
  // console.log('iiiiiiii')
  const [urlState] = useUrlState<{ returnUrl?: string; invitationCode?: string; }>();

  const [code, setCode] = React.useState<string>(urlState.invitationCode || '');
  // const [errorMessege, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  // const { data, error, run } = AHooks.useRequest(submit, {
  //   loadingDelay: 100,
  //   manual: true,
  // });

  // React.useEffect(() => {
  //   if (loading) {
  //     setTimeout(() => {
  //       setLoading(false);
  //       // console.log(data, 'data09weiojflsikdjflksadjflksjdflkfjlk');
  //     }, 1000);
  //   }
  // }, [data]);

  AHooks.useUnmount(() => {
  });

  async function submit() {
    setLoading(true);
    const { ret, errCode, msg, data } = await FServiceAPI.TestQualification.betaCodesActivate({
      code: code,
    });
    setLoading(false);

    // console.log(ret, errCode, msg, 'aiosdjflksdjflkl asdflkasjdlfkjsdalkfjlkj');

    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
      return;
    }

    // if (data.errCode) {
    //   setError('无效邀请码，请重新输入');
    // } else {
    fMessage('验证成功！', 'success');
    // console.log(urlState);
    if (urlState.returnUrl) {
      // console.log('returnUrl09weiojflksdfjlsdkjl');
      window.location.replace(decodeURIComponent(urlState.returnUrl));
    } else {
      // history.push('/dashboard');
      // console.log(FUtil.LinkTo.dashboard(), 'asd98fiojweikfja;lskdjflsdjl');
      window.location.replace(FUtil.LinkTo.dashboard());
    }
    // }
  }

  function flatCss(arr: Array<string>) {
    return arr.join(' ');
  }

  return (
    <div className={flatCss(['flex-column flex-1 w-100x align-center', styles.style])}>
      <div className='flex-1 flex-column'>
        <div className='flex-3' />
        <div className='shrink-0 flex-column align-center'>
          <div className={styles.title + ' mb-30'}>当前功能仅对内测用户开放</div>
          <div className={styles.title2}>填写邀请码/申请参加内测成功后，体验全部功能</div>
        </div>
        <div className='flex-2' />
      </div>
      <div className='shrink-0 flex-column  w-360'>
        <FComponentsLib.FInput.FSingleLine
          lengthLimit={-1}
          value={code}
          placeholder='请输入内测邀请码'
          className={styles.input}
          onChange={(e) => {
            // setError('');
            setCode(e.currentTarget.value.trim());
          }}
        />
        <div className={styles.codeError} />
        <FComponentsLib.FRectBtn
          onClick={() => {
            if (code.length !== 8) {
              fMessage('邀请码长度为8个字符', 'error');
              return;
            }
            submit();
          }}
          disabled={code === '' || loading}
        >
          验证邀请码
        </FComponentsLib.FRectBtn>
      </div>
      <div className='flex-1 flex-column align-center '>
        <div className={'flex-row mt-130'}>
          <span className={styles.tip}>没有内测邀请码？</span>
          <span
            className={styles.link}
            onClick={() => {
              history.push(
                '/invitation?type=apply' +
                (urlState.returnUrl ? '&returnUrl=' + urlState.returnUrl : ''),
              );
              jump('Apply');
            }}
          >
            申请参加内测
          </span>
        </div>
      </div>
      {/*{loading && (*/}
      {/*  <div className={styles.loading + ' flex-column-center'}>*/}
      {/*    <div className={'flex-column-center ' + styles.box}>*/}
      {/*      <span className={styles.text}>验证中</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}

export default Invite;
