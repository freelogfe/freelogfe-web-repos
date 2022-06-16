import * as React from 'react';
import styles from './invite.less';
import * as AHooks from 'ahooks';
import { FRectBtn } from '@/components/FButton';
import FInput from '@/components/FInput';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { Divider } from 'antd';
import { router } from 'umi';
import useUrlState from '@ahooksjs/use-url-state';
import url from '../../../../../@freelog/components-lib/src/index.config';

interface InviteProps {
  jump:any;
}

function Invite({jump}: InviteProps) {
  const [code, setCode] = React.useState<string>('');
  const [isCorrect, setIsCorrect] = React.useState<boolean>(true);
  function submit() {
    return FServiceAPI.TestQualification.betaCodesActivate({
      // @ts-ignore
      code: code,
    });
  }
  const [urlState] = useUrlState<any>();

  const { loading, data, error, run } = AHooks.useRequest(submit, {
    loadingDelay: 400,
    manual: true,
  });
  React.useEffect(() => {
    if (data) {
      if (data.errCode) {
        setIsCorrect(false);
      }
    }
    // if (data) {
    //   window.location.href = 'http://user.testfreelog.com';
    // }
  }, [data]);

  AHooks.useUnmount(() => {});
  function flatCss(arr: Array<string>) {
    return arr.join(' ');
  }
  return (
    <div className={flatCss(['flex-column flex-1 w-100x align-center', styles.style])}>
      <div className="flex-1 flex-column">
        <div className="flex-3"></div>
        <div className="shrink-0 flex-column align-center">
          <div className={styles.title + ' mb-30'}>当前功能仅对内测用户开放</div>
          <div className={styles.title2}>填写邀请码/申请参加内测成功后，体验全部功能</div>
        </div>
        <div className="flex-2"></div>
      </div>
      <div className="shrink-0 flex-column  w-360">
        <FInput
          placeholder="请输入内测邀请码"
          wrapClassName={styles.input}
          onChange={(e) => {
            setIsCorrect(true);
            setCode(e.currentTarget.value);
          }}
        />
        <div className={styles.codeError}>{isCorrect ? '' : '无效邀请码，请重新输入'}</div>
        <FRectBtn onClick={run} disabled={!code || !isCorrect}>
          验证邀请码
        </FRectBtn>
      </div>
      <div className="flex-1 flex-column align-center ">
        <div className={'flex-row mt-130'}>
          <span className={styles.tip}>没有内测邀请码？</span>
          <span
            className={styles.link}
            onClick={() => {
              router.push('/invitation?type=apply' + (urlState.returnUrl? '&returnUrl=' + urlState.returnUrl : ''));
              jump('Apply')
            }}
          >
            申请参加内测
          </span>
        </div>
      </div>
      {loading && (
        <div className={styles.loading + ' flex-column-center'}>
          <div className={'flex-column-center ' + styles.box}>
            <span className={styles.text}>验证中</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invite;
