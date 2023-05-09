import * as React from 'react';
import styles from './index.less';
import FUploadCover from '@/components/FUploadCover';
// import { FCloudUpload } from '@/components/FIcons';
import fMessage from '@/components/fMessage';
import FCoverImage from '@/components/FCoverImage';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface FUploadResourceCoverProps {
  value?: string;
  onChange?: (value: string) => void;
}

function FUploadResourceCover({ value, onChange }: FUploadResourceCoverProps) {

  return (<div className={styles.cover}>
    {!value
      ? (<FUploadCover
        onUploadSuccess={(url) => onChange && onChange(url)}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        <a className={styles.FUploadImageChildren}>
          <FComponentsLib.FIcons.FCloudUpload />
          <span>{FI18n.i18nNext.t('upload_image')}</span>
        </a>
      </FUploadCover>)
      : (<div className={styles.FUploadImageChildren}>
        {/*<img src={value} alt=""/>*/}
        <FCoverImage src={value} width={200}/>
      </div>)
    }
    <div className={styles.coverTip}>
      {value && <FUploadCover
        onUploadSuccess={(url) => onChange && onChange(url)}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        <a className={styles.ReUpload}>{FI18n.i18nNext.t('replace_resource_image')}</a>
      </FUploadCover>}
      <div style={{ height: 15 }} />
      <FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('rules_resource_image')} />
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText type='additional2' text={'未上传封面时，默认使用系统封面。'} />
    </div>
  </div>);
}

export default FUploadResourceCover;
