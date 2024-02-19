import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { withRouter, history } from 'umi';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import * as AHooks from 'ahooks';

interface SuccessProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
}

function Success({ match, dispatch }: SuccessProps) {

  const [$resourceInfo, set$resourceInfo, get$resourceInfo] = FUtil.Hook.useGetState<null | {
    cover: string;
    name: string;
    type: string[];
    version: string;
  }>(null);

  AHooks.useMount(async () => {
    const { ret, errCode, msg, data } = await FServiceAPI.Resource.info({ resourceIdOrName: match.params.id });
    // console.log(data, 'DDD9wieojflksdjflksdjlfkjlkj');
    set$resourceInfo({
      cover: data.coverImages[0] || '',
      name: data.resourceName,
      type: data.resourceType,
      version: data.latestVersion,
    });
  });

  return (<div className={styles.Success}>
    <div style={{ flexGrow: 2 }} />
    <FComponentsLib.FIcons.FCheck style={{ fontSize: 76 }} />
    <div style={{ height: 30 }} />
    <div style={{
      color: '#666',
      lineHeight: '42px',
      fontSize: 30,
    }}>{FI18n.i18nNext.t('resource_created_successfully')}</div>
    <div style={{ height: 60 }} />
    <div className={styles.resourceInfo}>
      <FCoverImage src={$resourceInfo?.cover || ''} width={68} />
      <div>
        <FComponentsLib.FContentText
          text={$resourceInfo?.name || ''}
          type={'highlight'}
          style={{ fontSize: 16, maxWidth: 265 }}
          singleRow={true}
        />
        <div style={{ height: 10 }} />
        <FComponentsLib.FContentText text={$resourceInfo?.type.join('/')} type={'additional2'} />
      </div>
    </div>
    <div style={{ height: 60 }} />
    <div className={styles.buttons}>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceDetails({
            resourceID: match.params.id,
          }));
        }}
      >查看资源详情</FComponentsLib.FTextBtn>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceVersionInfo({
            resourceID: match.params.id,
            version: get$resourceInfo()?.version,
          }));
        }}
      >管理我的资源</FComponentsLib.FTextBtn>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreatorEntry());
        }}
      >继续创建资源</FComponentsLib.FTextBtn>
    </div>
    {/*<FComponentsLib.FRectBtn onClick={goto}>{FI18n.i18nNext.t('create_first_version')}</FComponentsLib.FRectBtn>*/}
    <div style={{ flexGrow: 3 }} />

  </div>);
}

export default withRouter(connect()(Success));
