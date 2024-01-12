import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Progress, Space } from 'antd';
import * as AHooks from 'ahooks';
import { getFilesSha1Info } from '@/utils/service';
import { Canceler } from 'axios';
import img from '@/assets/file-object.svg';

interface TaskProps {
  order: number;
  file: RcFile;
  resourceTypeCode: string;
  resourceType: string[];

  onSuccess?(value: {
    uid: string;
    name: string;
    sha1: string;
  }): void;

  onFail?(value: {
    uid: string;
    name: string;
    sha1: string;
    reason: string;
  }): void;

  onCancel?(): void;
}

function Task({ order, file, resourceTypeCode, resourceType, onSuccess, onFail, onCancel }: TaskProps) {
  const canceler = React.useRef<Canceler | null>(null);
  // const [$taskState, set$taskState, get$taskState] = FUtil.Hook.useGetState<'loading' | 'uploading' | 'parsing' | 'success' | 'failed' | 'canceled'>('loading');
  const [$progress, set$progress, get$progress] = FUtil.Hook.useGetState<number>(0);

  AHooks.useMount(async () => {

    if (resourceType[0] === '视频' && file.size > 1024 * 1024 * 1024) {
      // fMessage('文件大小不能超过1GB', 'error');
      onFail && onFail({
        uid: file.uid,
        name: file.name,
        sha1: '',
        reason: '文件大小不能超过1GB',
      });
      return;
    }

    if (resourceType[0] !== '视频' && file.size > 200 * 1024 * 1024) {
      // fMessage('文件大小不能超过200MB', 'error');
      onFail && onFail({
        uid: file.uid,
        name: file.name,
        sha1: '',
        reason: '文件大小不能超过200MB',
      });
      return;
    }

    const fileSha1: string = await FUtil.Tool.getSHA1Hash(file);
    const params0: Parameters<typeof FServiceAPI.Storage.fileIsExist>[0] = {
      sha1: fileSha1,
    };
    const { data: data_fileIsExist } = await FServiceAPI.Storage.fileIsExist(params0);

    if (data_fileIsExist[0].isExisting) {
      const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
        fileSha1: fileSha1,
      };
      const { data: data_ResourcesBySha1 }: {
        data: {
          userId: number;
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          version: string;
          resourceVersions: {
            version: string;
          }[];
        }[];
      } = await FServiceAPI.Resource.getResourceBySha1(params3);

      if (data_ResourcesBySha1.length > 0 && data_ResourcesBySha1[0].userId !== FUtil.Tool.getUserIDByCookies()) {
        onFail && onFail({
          uid: file.uid,
          name: file.name,
          sha1: '',
          reason: '资源被他人占用',
        });
        return;
      }
    } else {
      const params: Parameters<typeof FServiceAPI.Storage.uploadFile>[0] = {
        file: file,
      };
      // set$taskState('uploading');
      const [promise, cancel]: any = FServiceAPI.Storage.uploadFile(params, {
        onUploadProgress(progressEvent) {
          set$progress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);

      canceler.current = cancel;

      try {
        const { data } = await promise;
      } catch (e) {
        // onFail && onFail({
        //   uid: file.uid,
        //   name: file.name,
        //   sha1: fileSha1,
        //
        // });
        return;
      }
    }

    set$progress(100);

    // set$taskState('parsing');
    const { result } = await getFilesSha1Info({
      sha1: [fileSha1],
      resourceTypeCode: resourceTypeCode,
    });
    // console.log(result, 'result sdjf;lsdjfl;kjsdlkfjksldjfklj');

    if (result[0].state === 'success') {
      // set$taskState('success');
      onSuccess && onSuccess({
        uid: file.uid,
        name: file.name,
        sha1: fileSha1,
      });
      return;
    }
    // set$taskState('failed');
    onFail && onFail({
      uid: file.uid,
      name: file.name,
      sha1: fileSha1,
      reason: '未知',
    });
  });

  AHooks.useUnmount(() => {

  });

  // if ($taskState === 'canceled') {
  //   return null;
  // }

  return (<div>
    <FComponentsLib.FContentText
      text={FI18n.i18nNext.t('brr_resourcelisting_item_no', {
        ResourceNO: order,
      })}
      type={'highlight'}
      style={{ fontSize: 12 }}
    />
    <div className={styles.fileInfo}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={file.name}
            style={{ maxWidth: 600 }}
            singleRow
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={'本地上传'}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: 270 }}>
        <FComponentsLib.FContentText
          text={`${$progress}%`}
          type={'additional1'}
          style={{ color: '#222' }}
        />
        <div style={{ width: 10 }} />
        <Progress
          percent={$progress}
          showInfo={false}
          style={{ width: 140 }}
        />
        <div style={{ width: 20 }} />
        {
          $progress < 100 && (<FComponentsLib.FTextBtn
            style={{ fontSize: 12 }}
            type={'danger'}
            onClick={() => {
              canceler.current && canceler.current();
              onCancel && onCancel();
              // set$taskState('canceled');
              // set_progress(0);
              // onFail && onFail({
              //   uid: file.uid,
              //   name: file.name,
              //   sha1: '',
              //   reason: '取消上传',
              // });
            }}
          >取消上传</FComponentsLib.FTextBtn>)
        }

        {
          $progress === 100 && (<FComponentsLib.FContentText
            type={'additional1'}
            // className={styles.delete}
          >正在解析...</FComponentsLib.FContentText>)
        }

      </div>
    </div>
  </div>);
}

export default Task;
