import * as React from 'react';
import styles from './index.less';
import FForbid from '@/components/FIcons/FForbid';
import { FContentText, FTitleText } from '@/components/FText';
import { RouteComponentProps } from 'react-router';
import { router, withRouter } from 'umi';
import { connect } from 'dva';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FCopyToClipboard from '@/components/FCopyToClipboard';
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
      router.replace(FUtil.LinkTo.resourceDetails({ resourceID: match.params.id }));
      return;
    }

    set_resourceName(data.resourceName);
    set_freezeReason(data.freezeReason || '其他违法违规');
    set_isOwner(data.userId === FUtil.Tool.getUserIDByCookies());
  }

  return (<div className={styles.container}>
    <FForbid className={styles.FForbid} />
    <div style={{ height: 30 }} />
    <FTitleText text={'该资源已经被封停'} type='h1' />
    <div style={{ height: 80 }} />
    <div className={styles.content}>
      <FContentText text={`经核实，资源 ${resourceName} ，严重违`} />
      <FComponentsLib.FTextBtn onClick={() => {

      }}>&nbsp;查看服务协议&nbsp;</FComponentsLib.FTextBtn>
      <FContentText text={` ，涉嫌 ${freezeReason} ，已经被封停。`} />
    </div>
    {
      isOwner && (<>
        <div style={{ height: 20 }} />
        <div className={styles.content}>
          <FContentText text={'如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。'} />
        </div>
        <div style={{ height: 20 }} />
        <div className={styles.content}>
          <FContentText text={'联系邮箱：service@freelog.com'} />
          <FCopyToClipboard
            text={'service@freelog.com'}
            title={'复制'}
          >
            <FComponentsLib.FTextBtn>&nbsp;复制&nbsp;</FComponentsLib.FTextBtn>
          </FCopyToClipboard>
        </div>
      </>)
    }

  </div>);
}

export default withRouter(connect()(Freeze));
