import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ChangeAction, CreateBucketAction, StorageHomePageModelState} from "@/models/storageHomePage";
import FInput from "@/components/FInput";
import FModal from "@/components/FModal";
import {ConnectState} from "@/models/connect";

interface NoContentProps {
  dispatch: Dispatch;

  storageHomePage: StorageHomePageModelState;
}

function NoContent({dispatch, storageHomePage}: NoContentProps) {

  return (<>
    <div className={styles.styles} style={{height: 'calc(100vh - 70px)'}}>
      <FTipText text={'自由创作从Freelog开始'} type="primary"/>
      <div style={{height: 60}}/>
      <FTipText text={'在Freelog模拟资源池，您可以创建存储空间，上传模拟资源并进行测试。'} type="secondary"/>
      <div style={{height: 60}}/>
      <FNormalButton
        theme="big"
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
      >创建Bucket</FNormalButton>
      <div style={{height: 200}}/>
    </div>
    <FModal
      title="创建Bucket"
      visible={storageHomePage.newBucketModalVisible}
      width={640}
      onOk={() => {
        dispatch<CreateBucketAction>({
          type: 'storageHomePage/createBucket',
        });
        // setModalVisible(false);
      }}
      onCancel={() => dispatch<ChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          newBucketModalVisible: false,
        },
      })}
    >
      <div className={styles.FModalBody}>
        <div style={{height: 50}}/>
        <ul className={styles.tip}>
          <li>请注意存储空间的名称一但创建则不可修改</li>
          <li>Freelog为每个用户提供2GB的免费存储空间</li>
        </ul>
        <div style={{height: 10}}/>
        <FInput
          value={storageHomePage.newBucketName}
          onChange={(e) => {
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                newBucketName: e.target.value,
                newBucketNameError: false,
              },
            });
          }}
          wrapClassName={styles.wrapClassName}
          className={styles.FInput}
          errorText={storageHomePage.newBucketNameError ? (<div>
            <div>只能包括小写字母、数字和短横线（-）；</div>
            <div>必须以小写字母或者数字开头和结尾 ；</div>
            <div>长度必须在 1–63 字符之间。</div>
          </div>) : ''}
        />
        <div style={{height: 100}}/>
      </div>
    </FModal>
  </>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(NoContent);
