import * as React from 'react';
import styles from './index.less';
import FUploadImage from '@/components/FUploadImage';
import {FContentText} from '@/components/FText';
import {FCloudUpload} from "@/components/FIcons";
import fMessage from "@/components/fMessage";
import FUtil from "@/utils";

interface FUploadResourceCoverProps {
  value?: string;
  onChange?: (value: string) => void;
}

function FUploadResourceCover({value, onChange}: FUploadResourceCoverProps) {

  return (<div className={styles.cover}>
    {!value
      ? (<FUploadImage
        onUploadSuccess={(url) => onChange && onChange(url)}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        <a className={styles.FUploadImageChildren}>
          <FCloudUpload/>
          <span>{FUtil.I18n.message('upload_image')}</span>
        </a>
      </FUploadImage>)
      : (<div className={styles.FUploadImageChildren}>
        <img src={value} alt=""/>
      </div>)
    }
    <div className={styles.coverTip}>
      {value && <FUploadImage
        onUploadSuccess={(url) => onChange && onChange(url)}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        <a className={styles.ReUpload}>{FUtil.I18n.message('replace_resource_image')}</a>
      </FUploadImage>}
      <div style={{height: 15}}/>
      <FContentText type="additional2" text={FUtil.I18n.message('rules_resource_image')}/>
      <div style={{height: 5}}/>
      <FContentText type="additional2" text={'未上传封面时，默认使用系统封面。'}/>
    </div>
  </div>);
}

export default FUploadResourceCover;
