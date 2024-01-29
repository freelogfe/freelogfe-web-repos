import * as React from 'react';
import styles from './index.less';
import { RouteComponentProps } from 'react-router';
import { history, withRouter } from 'umi';
import { connect } from 'dva';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface FreezeProps extends RouteComponentProps<{ id: string }> {

}

interface FreezeStates {
  nodeName: string;
  freezeReason: string;
}

function Freeze({ match }: FreezeProps) {

  const [isOwner, set_isOwner] = React.useState<boolean>(true);
  const [nodeName, set_nodeName] = React.useState<FreezeStates['nodeName']>('');
  const [freezeReason, set_freezeReason] = React.useState<FreezeStates['freezeReason']>('');

  AHooks.useMount(() => {
    handleData();
  });

  AHooks.useUnmount(() => {

  });

  async function handleData() {
    const { data } = await FServiceAPI.Node.details({ nodeId: Number(match.params.id) });
    // console.log(data, 'DDDDDDDDDfo9iwekjlskdfjsdlkj');

    if ((data.status & 4) !== 4) {
      history.replace(FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id) }));
      return;
    }

    set_nodeName(data.nodeName);
    set_freezeReason(data.freezeReason || '其他违法违规');
  }

  return (<div className={styles.container}>
    <FComponentsLib.FIcons.FForbid className={styles.FForbid} />
    <div style={{ height: 30 }} />
    <div className={styles.content}>
      {
        isOwner
          ? FI18n.i18nNext.tJSXElement('alert_nodedisable01', {
            NodeDomain: nodeName,
            DisableDetails: freezeReason,
          })
          : FI18n.i18nNext.tJSXElement('alert_nodedisable02', {
            NodeDomain: nodeName,
            DisableDetails: freezeReason,
          })
      }
    </div>
    {/*<FComponentsLib.FTitleText text={'你的节点已经被封停'} type='h1' />*/}
    {/*<div style={{ height: 80 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={`经核实，节点 ${nodeName} ，严重违`} />*/}
    {/*  <FComponentsLib.FTextBtn onClick={() => {*/}
    {/*    window.open('https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2');*/}
    {/*  }}>&nbsp;查看服务协议&nbsp;</FComponentsLib.FTextBtn>*/}
    {/*  <FComponentsLib.FContentText text={` ，涉嫌 ${freezeReason} ，已经被封停。`} />*/}
    {/*</div>*/}
    {/*<div style={{ height: 20 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={'如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。'} />*/}
    {/*</div>*/}
    {/*<div style={{ height: 20 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={'联系邮箱：service@freelog.com'} />*/}
    {/*  <FComponentsLib.FCopyToClipboard*/}
    {/*    text={'service@freelog.com'}*/}
    {/*    title={'复制'}*/}
    {/*  >*/}
    {/*    <FComponentsLib.FTextBtn>&nbsp;复制&nbsp;</FComponentsLib.FTextBtn>*/}
    {/*  </FComponentsLib.FCopyToClipboard>*/}
    {/*</div>*/}
    {/*<div style={{ height: 80 }} />*/}
    {/*<FTextBtn onClick={() => {*/}

    {/*}}>返回登录页</FTextBtn>*/}
  </div>);
}

export default withRouter(connect()(Freeze));
