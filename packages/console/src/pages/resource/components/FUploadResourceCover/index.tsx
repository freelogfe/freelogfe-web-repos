import * as React from 'react';
import styles from './index.less';
import FUploadImage from '@/components/FUploadImage';
import {FContentText} from '@/components/FText';
import {RcFile, UploadChangeParam} from "antd/lib/upload/interface";
import {uploadImage} from "@/services/storages";
import {i18nMessage} from "@/utils/i18n";
import {FCloudUpload} from "@/components/FIcons";
import fMessage from "@/components/fMessage";

interface FUploadResourceCoverProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ({value, onChange}: FUploadResourceCoverProps) {

  return (<div className={styles.cover}>
    {!value
      ? (<FUploadImage
        onUploadSuccess={(url) => onChange && onChange(url)}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        <a className={styles.FUploadImageChildren}>
          {/*<i className={'freelog fl-icon-shangchuanfengmian'}/>*/}
          <FCloudUpload/>
          <span>{i18nMessage('upload_image')}</span>
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
        <a className={styles.ReUpload}>{i18nMessage('replace_resource_image')}</a>
      </FUploadImage>}
      <div style={{height: 15}}/>
      <FContentText type="additional2" text={i18nMessage('rules_resource_image')}/>
      <div style={{height: 5}}/>
      <FContentText type="additional2" text={'未上传封面时，默认使用系统封面。'}/>
    </div>
  </div>);
}
