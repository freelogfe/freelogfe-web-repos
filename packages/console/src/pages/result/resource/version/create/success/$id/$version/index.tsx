import * as React from 'react';
import styles from './index.less';
import { withRouter, history } from 'umi';
import FCenterLayout from '@/layouts/FCenterLayout';
import * as AHooks from 'ahooks';
import { connect, Dispatch } from 'dva';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import FComponentsLib from '@freelog/components-lib';
import { resourceOnline } from '@/pages/resource/containers/Sider';

interface SuccessProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
}

function Success({ match, dispatch }: SuccessProps) {

  const [count, setCount] = React.useState<number>(3);
  // 0：初始 1：第一个版本且无策略 2：非第一个版本或有策略
  const [gotoState, setGotoState] = React.useState<0 | 1 | 2>(0);

  AHooks.useInterval(() => {
    const c = count - 1;
    setCount(c);
    if (c === 0) {
      gotoVersionInfo();
    }
  }, gotoState === 2 ? 1000 : undefined);

  AHooks.useMount(async () => {
    const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: match.params.id,
    };

    const { data } = await FServiceAPI.Resource.info(params);
    // console.log(data, 'DDDDTTTTAAAAA');

    if (data.resourceVersions.length === 1 && data.policies.length === 0) {
      setGotoState(1);
    } else {
      setGotoState(2);
    }
  });

  function gotoVersionInfo() {
    return history.replace(FUtil.LinkTo.resourceVersion({
      resourceID: match.params.id,
      version: match.params.version,
    }));
  }

  function gotoAuth() {
    return history.replace(FUtil.LinkTo.resourceAuth({
      resourceID: match.params.id,
    }));
  }

  return (<FCenterLayout>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      {
        gotoState !== 0 && (<>
          <i className={'freelog fl-icon-shenqingchenggong'} />
          <div style={{ height: 20 }} />
          <FComponentsLib.FTipText
            type='second'
            text={FI18n.i18nNext.t('version_created_successfully', { VersionNumber: match.params.version })}
          />
        </>)
      }

      <div style={{ height: 40 }} />

      {
        gotoState === 1 && (<div className={styles.goto1}>
          <FComponentsLib.FTipText type='third' text={'添加策略后可将资源上架，上架后才能在资源'} />
          <div style={{ height: 30 }} />
          <FComponentsLib.FRectBtn
            onClick={async () => {
              // gotoAuth();
              const onlineSuccess = await resourceOnline(match.params.id);
              if (onlineSuccess) {
                // history.replace(FUtil.LinkTo.resourceInfo({
                //   resourceID: match.params.id,
                // }));
                gotoVersionInfo();
              }
            }}
            style={{ padding: '0 20px' }}
          >创建策略并上架资源</FComponentsLib.FRectBtn>
          <div style={{ height: 15 }} />
          <FComponentsLib.FTextBtn
            onClick={() => {
              gotoVersionInfo();
            }}
          >暂不添加</FComponentsLib.FTextBtn>
        </div>)
      }
      {
        gotoState === 2 && (<div className={styles.goto2}>
          <FComponentsLib.FTipText type='third' text={FI18n.i18nNext.t('jump_to_version_edit', { timer: count })} />
          <div style={{ width: 10 }} />
          <FComponentsLib.FTextBtn
            // theme={'primary'}
            onClick={gotoVersionInfo}
          >{FI18n.i18nNext.t('jump_now')}</FComponentsLib.FTextBtn>
        </div>)
      }
    </div>
  </FCenterLayout>);
}


export default withRouter(connect()(Success));
