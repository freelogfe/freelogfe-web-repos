import * as React from 'react';
import styles from './index.less';
import FUploadCover from '@/components/FUploadCover';
import { FContentText } from '@/components/FText';
import { FCloudUpload } from '@/components/FIcons';
import fMessage from '@/components/fMessage';
// import FUtil1 from '@/utils';
import FCoverImage from '@/components/FCoverImage';
import { fI18nNext } from '@freelog/tools-lib';

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
          <FCloudUpload />
          <span>{fI18nNext.t('upload_image')}</span>
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
        <a className={styles.ReUpload}>{fI18nNext.t('replace_resource_image')}</a>
      </FUploadCover>}
      <div style={{ height: 15 }} />
      <FContentText type='additional2' text={fI18nNext.t('rules_resource_image')} />
      <div style={{ height: 5 }} />
      <FContentText type='additional2' text={'未上传封面时，默认使用系统封面。'} />
    </div>
  </div>);
}

export default FUploadResourceCover;
