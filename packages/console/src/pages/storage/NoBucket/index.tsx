import * as React from 'react';
import styles from './index.less';
import {connect, Dispatch} from 'dva';
import {StorageHomePageModelState} from "@/models/storageHomePage";
import {ConnectState} from "@/models/connect";
import { router } from 'umi';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface NoContentProps {
  dispatch: Dispatch;

  storageHomePage: StorageHomePageModelState;
}

function NoContent({dispatch, storageHomePage}: NoContentProps) {

  return (<>
    <div className={styles.styles} style={{height: 'calc(100vh - 70px)'}}>
      <FComponentsLib.FTipText
        // text={'自由创作从Freelog开始'}
        text={FI18n.i18nNext.t('manage_buckets_empty_title')}
        type="first"
      />
      <div style={{height: 30}}/>
      <FComponentsLib.FTipText
        // text={'在Freelog模拟资源池，您可以创建存储空间，上传模拟资源并进行测试。'}
        text={FI18n.i18nNext.t('manage_buckets_empty_msg')}
        type="second"
      />
      <div style={{height: 30}}/>
      <FComponentsLib.FRectBtn
        type="primary"
        size="large"
        style={{paddingLeft: 50, paddingRight: 50}}
        onClick={() => {
          // dispatch<ChangeAction>({
          //   type: 'storageHomePage/change',
          //   payload: {
          //     newBucketName: '',
          //     newBucketNameError: false,
          //     newBucketModalVisible: true,
          //   },
          // });
          router.replace(FUtil.LinkTo.storageSpace({
            createBucket: true,
          }));
        }}
      >{FI18n.i18nNext.t('create_bucket')}</FComponentsLib.FRectBtn>
      <div style={{height: 200}}/>
    </div>
  </>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(NoContent);
