import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '../../../../../../@freelog/tools-lib';

interface UploadFileProps {
  onLocalUpload?(): void;

  onImportStorage?(): void;
}

function UploadFile({ onLocalUpload, onImportStorage }: UploadFileProps) {
  return (<div className={styles.container2}>
    <div style={{ height: 35 }} />
    <div className={styles.nav}>
      <div className={styles.left}>{FI18n.i18nNext.t('brr_title_bulkreleaseresource')}</div>
      <div style={{ width: 10 }} />
      <div className={styles.other}>{'>'}</div>
      <div style={{ width: 7 }} />
      <div className={styles.other}>{FI18n.i18nNext.t('brr_submitresource_title')}</div>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.cards}>
      <div className={styles.localUpload}>
        <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('brr_submitresource_upload_msg')}
          type={'additional2'}
        />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={async () => {
            onLocalUpload && onLocalUpload();
          }}
        >{FI18n.i18nNext.t('brr_submitresource_btn_uploadfromlocal')}</FComponentsLib.FRectBtn>
      </div>

      <div className={styles.storageSpace}>
        <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('brr_submitresource_importfromstorage_msg')}
          type={'additional2'}
        />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={async () => {
            onImportStorage && onImportStorage();
          }}
        >{FI18n.i18nNext.t('brr_submitresource_btn_importfromstorage')}</FComponentsLib.FRectBtn>
      </div>
    </div>


  </div>);
}

export default UploadFile;

