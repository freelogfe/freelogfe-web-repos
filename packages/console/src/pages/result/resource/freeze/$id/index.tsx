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
  resourceName: string;
  freezeReason: string;
  isOwner: boolean;
}

function Freeze({ match }: FreezeProps) {

  const [resourceName, set_resourceName] = React.useState<FreezeStates['resourceName']>('');
  const [freezeReason, set_freezeReason] = React.useState<FreezeStates['freezeReason']>('');
  const [isOwner, set_isOwner] = React.useState<FreezeStates['isOwner']>(true);

  AHooks.useMount(() => {
    handleData();
  });

  AHooks.useUnmount(() => {

  });

  async function handleData() {
    const { data }: any = await FServiceAPI.Resource.info({
      resourceIdOrName: match.params.id,
      isLoadFreezeReason: 1,
    });
    // (status & 2 ) === 2
    // console.log(data, 'DDDDDDDDDfo9iwekjlskdfjsdlkj');

    if ((data.status & 2) !== 2) {
      history.replace(FUtil.LinkTo.resourceDetails({ resourceID: match.params.id }));
      return;
    }

    set_resourceName(data.resourceTitle);
    set_freezeReason(data.freezeReason || '其他违法违规');
    set_isOwner(data.userId === FUtil.Tool.getUserIDByCookies());
  }

  return (<div className={styles.container}>
    <FComponentsLib.FIcons.FForbid className={styles.FForbid} />
    <div style={{ height: 30 }} />
    <div className={styles.content}>
      {
        isOwner
          ? FI18n.i18nNext.tJSXElement('alert_resourceblocked02', {
            ResourceName: resourceName,
            DisableDetails: freezeReason,
          })
          : FI18n.i18nNext.tJSXElement('alert_resourceblocked01', {
            ResourceName: resourceName,
          })
      }
    </div>
    {/*<FComponentsLib.FTitleText text={'此资源因违规已被封禁'} type='h1' />*/}
    {/*/!*<FComponentsLib.FTitleText text={FI18n.i18nNext.t('alert_resourceblocked01')} type='h1' />*!/*/}
    {/*<div style={{ height: 80 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={`经核实，资源 ${resourceName} ，违反平台规范`} />*/}
    {/*  <FComponentsLib.FTextBtn onClick={() => {*/}
    {/*    window.open('https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2');*/}
    {/*  }}>&nbsp;查看服务协议&nbsp;</FComponentsLib.FTextBtn>*/}
    {/*  <FComponentsLib.FContentText text={` ，涉嫌 ${freezeReason} ，已经被封禁。`} />*/}
    {/*</div>*/}
    {/*{*/}
    {/*  isOwner && (<>*/}
    {/*    <div style={{ height: 20 }} />*/}
    {/*    <div className={styles.content}>*/}
    {/*      <FComponentsLib.FContentText text={'如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。'} />*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 20 }} />*/}
    {/*    <div className={styles.content}>*/}
    {/*      <FComponentsLib.FContentText text={'联系邮箱：service@freelog.com'} />*/}
    {/*      <FComponentsLib.FCopyToClipboard*/}
    {/*        text={'service@freelog.com'}*/}
    {/*        title={'复制'}*/}
    {/*      >*/}
    {/*        <FComponentsLib.FTextBtn>&nbsp;复制&nbsp;</FComponentsLib.FTextBtn>*/}
    {/*      </FComponentsLib.FCopyToClipboard>*/}
    {/*    </div>*/}
    {/*  </>)*/}
    {/*}*/}

  </div>);
}

export default withRouter(connect()(Freeze));
