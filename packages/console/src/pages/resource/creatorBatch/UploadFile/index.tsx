import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { RcFile } from 'antd/lib/upload/interface';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import { Modal } from 'antd';
import Task from './Task';

interface UploadFileProps {
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function UploadFile({ resourceCreatorBatchPage }: UploadFileProps) {

  const [$files, set$files, get$files] = FUtil.Hook.useGetState<RcFile[]>([]);

  return (<div className={styles.container2}>
    <div style={{ height: 35 }} />
    <div className={styles.nav}>
      <div className={styles.left}>批量发行资源</div>
      <div style={{ width: 10 }} />
      <div className={styles.other}>{'>'}</div>
      <div style={{ width: 7 }} />
      <div className={styles.other}>上传资源文件</div>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.cards}>
      <div className={styles.localUpload}>
        <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={async () => {
            const { data: data_acceptResourceType }: {
              data: {
                formats: string[];
              }
            } = await FServiceAPI.Resource.getResourceTypeInfoByCode({
              code: resourceCreatorBatchPage.selectedResourceType?.value || '',
            });
            if (!data_acceptResourceType) {
              return;
            }

            // set$accept();
            const files: RcFile[] | null = await fReadLocalFiles({
              accept: data_acceptResourceType.formats.join(','),
              multiple: true,
            });

            if (!files) {
              return;
            }

            // console.log(files, 'files 09wie3ojrflsikdjflsdjlfkjlkjlk');
            set$files(files);
          }}
        >本地上传</FComponentsLib.FRectBtn>
      </div>

      <div className={styles.storageSpace}>
        <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText
          text={'选择存储空间对象作为发行对象'}
          type={'additional2'}
        />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
        >存储空间导入</FComponentsLib.FRectBtn>
      </div>
    </div>

    <Modal
      open={$files.length > 0}
      title={null}
      footer={null}
      closable={false}
      width={600}
      bodyStyle={{
        padding: 20
      }}
    >
      {
        $files.map((file) => {
          return (<Task
            key={file.uid}
            file={file}
            onFail={() => {
            }}
            onSuccess={() => {
            }}
          />);
        })
      }
    </Modal>
  </div>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(UploadFile);


