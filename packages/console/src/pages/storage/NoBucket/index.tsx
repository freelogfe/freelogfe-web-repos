import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ChangeAction, StorageHomePageModelState} from "@/models/storageHomePage";
import {ConnectState} from "@/models/connect";
import FUtil from "@/utils";

interface NoContentProps {
  dispatch: Dispatch;

  storageHomePage: StorageHomePageModelState;
}

function NoContent({dispatch, storageHomePage}: NoContentProps) {

  return (<>
    <div className={styles.styles} style={{height: 'calc(100vh - 70px)'}}>
      <FTipText
        // text={'自由创作从Freelog开始'}
        text={FUtil.I18n.message('manage_buckets_empty_title')}
        type="first"
      />
      <div style={{height: 60}}/>
      <FTipText
        // text={'在Freelog模拟资源池，您可以创建存储空间，上传模拟资源并进行测试。'}
        text={FUtil.I18n.message('manage_buckets_empty_msg')}
        type="second"
      />
      <div style={{height: 60}}/>
      <FRectBtn
        type="primary"
        size="large"
        style={{paddingLeft: 50, paddingRight: 50}}
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              newBucketName: '',
              newBucketNameError: false,
              newBucketModalVisible: true,
            },
          });
        }}
      >{FUtil.I18n.message('create_bucket')}</FRectBtn>
      <div style={{height: 200}}/>
    </div>
  </>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(NoContent);
