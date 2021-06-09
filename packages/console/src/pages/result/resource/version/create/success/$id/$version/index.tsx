import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {withRouter, router} from "umi";
import FCenterLayout from "@/layouts/FCenterLayout";
import * as AHooks from 'ahooks';
import {connect, Dispatch} from 'dva';
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import {RouteComponentProps} from 'react-router';
import {FApiServer} from "@/services";

interface SuccessProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
}

function Success({match, dispatch}: SuccessProps) {

  const [count, setCount] = React.useState<number>(3);
  // 0：初始 1：第一个版本且无策略 2：非第一个版本或有策略
  const [gotoState, setGotoState] = React.useState<0 | 1 | 2>(0);

  AHooks.useInterval(() => {
    const c = count - 1;
    setCount(c);
    if (c === 0) {
      gotoVersionInfo();
    }
  }, gotoState === 2 ? 1000 : null);

  AHooks.useMount(async () => {
    const params: Parameters<typeof FApiServer.Resource.info>[0] = {
      resourceIdOrName: match.params.id,
    };

    const {data} = await FApiServer.Resource.info(params);
    // console.log(data, 'DDDDTTTTAAAAA');

    if (data.resourceVersions.length === 1 && data.policies.length === 0) {
      setGotoState(1);
    } else {
      setGotoState(2);
    }
  });

  function gotoVersionInfo() {
    return router.replace(FUtil.LinkTo.resourceVersion({
      resourceID: match.params.id,
      version: match.params.version,
    }));
  }

  function gotoAuth() {
    return router.replace(FUtil.LinkTo.resourceAuth({
      resourceID: match.params.id,
    }));
  }

  return (<FCenterLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      {
        gotoState !== 0 && (<>
          <i className={'freelog fl-icon-shenqingchenggong'}/>
          <div style={{height: 20}}/>
          <FTipText
            type="second"
            text={FUtil1.I18n.message('version_created_successfully', {VersionNumber: match.params.version})}
          />
        </>)
      }

      <div style={{height: 40}}/>

      {
        gotoState === 1 && (<div className={styles.goto1}>
          <FTipText type="third" text={'未添加策略的资源不会出现在资源市场中'}/>
          <div style={{height: 30}}/>
          <FRectBtn
            onClick={() => {
              gotoAuth();
            }}
            style={{padding: '0 20px'}}
          >立即添加授权策略</FRectBtn>
          <div style={{height: 15}}/>
          <FTextBtn
            onClick={() => {
              gotoVersionInfo();
            }}
          >暂不添加</FTextBtn>
        </div>)
      }
      {
        gotoState === 2 && (<div className={styles.goto2}>
          <FTipText type="third" text={FUtil1.I18n.message('jump_to_version_edit', {timer: count})}/>
          <div style={{width: 10}}/>
          <FTextBtn
            // theme={'primary'}
            onClick={gotoVersionInfo}
          >{FUtil1.I18n.message('jump_now')}</FTextBtn>
        </div>)
      }
    </div>
  </FCenterLayout>)
}


export default withRouter(connect()(Success));
