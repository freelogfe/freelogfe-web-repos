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
import * as AHooks from 'ahooks';
import { Dispatch } from 'redux';
import { ChangeAction } from '@/models/resourceCreatorBatchPage';
import { getFilesSha1Info } from '@/utils/service';

interface UploadFileProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function UploadFile({ dispatch, resourceCreatorBatchPage }: UploadFileProps) {

  const [$files, set$files, get$files] = FUtil.Hook.useGetState<RcFile[]>([]);

  const [$successFiles, set$successFiles, get$successFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
  }[]>([]);
  const [$failFiles, set$failFiles, get$failFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
  }[]>([]);

  AHooks.useDebounceEffect(() => {
    if ($files.length > 0 && ($successFiles.length + $failFiles.length === $files.length)) {
      gotoList();
    }
  }, [$files, $successFiles, $failFiles], {
    wait: 300,
  });

  async function gotoList() {
    const { data }: {
      data: {
        [k: string]: {
          resourceNewNames: string[];
          status: 1 | 2;
        };
      }
    } = await FServiceAPI.Resource.generateResourceNames({
      data: get$successFiles().map((f) => {
        return {
          name: f.name.replace(new RegExp(/\.[\w-]+$/), ''),
          num: 1,
        };
      }),
    });
    // console.log(data, '但是覅收到了 奥萨蒂哦附件 adsf 刘');

    const result = await getFilesSha1Info({
      sha1: get$successFiles().map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    console.log(result, 'result s9difjlsdkjflkdsjlfkjdslkjflkdsjfljsdlkfjlksjdkfjlksdf');

    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        showPage: 'resourceList',
        resourceListInfo: get$successFiles().map((f) => {
          const name: string = data[f.name.replace(new RegExp(/\.[\w-]+$/), '')].resourceNewNames[0];
          return {
            fileUID: f.uid,
            fileName: f.name,
            sha1: f.sha1,
            cover: '',
            resourceName: name,
            resourceTitle: name,
            resourceLabels: [],
            resourcePolicies: [],
            showMore: false,
            rawProperties: [],
            additionalProperties: [],
            customProperties: [],
            customConfigurations: [],
            directDependencies: [],
            baseUpcastResources: [],
          };
        }),
      },
    });
  }

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
        padding: 20,
      }}
    >
      {
        $files.map((file) => {
          return (<Task
            key={file.uid}
            file={file}
            onFail={(value) => {
              set$failFiles([
                ...get$failFiles(),
                value,
              ]);
            }}
            onSuccess={(value) => {
              set$successFiles([
                ...get$successFiles(),
                value,
              ]);
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


