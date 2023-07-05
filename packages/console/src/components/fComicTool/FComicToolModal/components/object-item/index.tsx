/** 存储对象组件（含上传状态） */

import './index.less';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { Popconfirm, Progress, Tooltip } from 'antd';
import { useContext } from 'react';
import { comicToolContext } from '../..';

interface Props {
  data: any;
  cancel?: (uid: string) => void;
  upload?: (task: any) => void;
  update?: (task: any) => void;
  importFile?: (task: any) => void;
  insert?: (task: any) => void;
}

export const ObjectItem = (props: Props) => {
  const { loaderShow } = useContext(comicToolContext);
  const { data, cancel, upload, update, importFile, insert } = props;

  const statusMapping: any = {
    uploading: {
      btn: (
        <Tooltip
          overlayClassName="object-btn-tooltip"
          placement="bottomRight"
          title={FI18n.i18nNext.t('uploadobject_tooltip_cancel_uploading')}
        >
          <i className="freelog fl-icon-guanbi"></i>
        </Tooltip>
      ),
    },
    success: {
      status: FI18n.i18nNext.t('uploadobject_msg_uploaded_successfully'),
    },
    cancel: {
      status: FI18n.i18nNext.t('uploadobject_msg_canceled'),
      btn: (
        <Tooltip
          overlayClassName="object-btn-tooltip"
          placement="bottomRight"
          title={FI18n.i18nNext.t('uploadobject_tooltip_resume_uploading')}
        >
          <i className="freelog fl-icon-zhongzhi"></i>
        </Tooltip>
      ),
    },
    fail: {
      status: FI18n.i18nNext.t('uploadobject_msg_upload_failed'),
      btn: (
        <Tooltip
          overlayClassName="object-btn-tooltip"
          placement="bottomRight"
          title={FI18n.i18nNext.t('uploadobject_tooltip_resume_uploading')}
        >
          <i className="freelog fl-icon-zhongzhi"></i>
        </Tooltip>
      ),
    },
    repeatName: {
      status: FI18n.i18nNext.t('uploadobject_msg_object_exist'),
      btn: (
        <Tooltip
          overlayClassName="object-btn-tooltip"
          placement="bottomRight"
          title={FI18n.i18nNext.t('uploadobject_tooltip_update')}
        >
          <div className="update-btn">
            {FI18n.i18nNext.t('uploadobject_btn_update')}
          </div>
        </Tooltip>
      ),
    },
  };

  /** 操作 */
  const operate = () => {
    const { uploadStatus, uid } = data;
    if (uploadStatus === 'uploading') {
      // 正在上传，进行取消上传操作
      cancel && cancel(uid);
    } else if (['cancel', 'fail'].includes(uploadStatus)) {
      // 取消上传/上传失败，进行重新上传操作
      upload && upload(data);
    } else if (uploadStatus === 'repeatName') {
      // 存在同名对象，进行更新操作
      update && update(data);
    }
  };

  return (
    <div className="object-item-wrapper" key={data.objectId}>
      {!data.uploadStatus || data.uploadStatus === 'success' ? (
        <div className="info-area">
          <div
            className="object-name"
            title={`${data.bucketName}/${data.objectName}`}
          >{`${data.bucketName}/${data.objectName}`}</div>
          <div className="other-info">{`${FI18n.i18nNext.t(
            'cbformatter_import_label_lastupdated',
          )} ${FUtil.Format.formatDateTime(data.updateDate, true)}`}</div>
        </div>
      ) : (
        <div className="info-area">
          <div className="object-name">{data.file.name}</div>
          <div className="other-info">
            {FUtil.Format.humanizeSize(data.file.size)}
          </div>
        </div>
      )}

      {data.uploadStatus === 'uploading' ? (
        <div className="status">
          <div className="percent">{data.progress}%</div>
          <Progress
            percent={data.progress}
            status="active"
            showInfo={false}
            strokeColor="#2784FF"
          />
        </div>
      ) : (
        <div className={`status ${data.uploadStatus}`}>
          {statusMapping[data.uploadStatus]?.status}
        </div>
      )}

      {!data.uploadStatus || data.uploadStatus === 'success' ? (
        <Popconfirm
          placement="bottomRight"
          title={FI18n.i18nNext.t('cbformatter_import_confirmation')}
          disabled={!importFile}
          onConfirm={() => importFile && importFile(data)}
          okButtonProps={{ loading: loaderShow }}
          cancelButtonProps={{ disabled: loaderShow }}
          okText={FI18n.i18nNext.t('btn_import_post')}
          cancelText={FI18n.i18nNext.t('btn_cancel')}
        >
          <div className="choose-btn" onClick={() => insert && insert(data)}>
            {FI18n.i18nNext.t('btn_import_post')}
          </div>
        </Popconfirm>
      ) : (
        <div className="other-btn" onClick={operate}>
          {statusMapping[data.uploadStatus].btn}
        </div>
      )}
    </div>
  );
};
