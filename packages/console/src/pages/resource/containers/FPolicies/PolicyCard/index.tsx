import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import StatusLabel from "@/pages/resource/components/StatusLabel";
import {FTextBtn} from "@/components/FButton";
import FDropdownMenu from "@/components/FDropdownMenu";
// import FUtil1 from "@/utils";
import { FI18n } from '@freelog/tools-lib';

interface PolicyCardProps {
  title: string;
  status: 'executing' | 'stopped';
  code: string;
  onPreview?: () => void;
  onChangeStatus?: (value: PolicyCardProps['status']) => void;
}

function PolicyCard({title, status, code, onPreview, onChangeStatus}: PolicyCardProps) {
  return (<div className={styles.policy}>
    <div className={styles.policyHeader}>
      <FContentText text={title} singleRow={true}/>
      <FDropdownMenu
        onChange={(value: any) => {
          if (value !== status) {
            return onChangeStatus && onChangeStatus(value);
          }
        }}
        text={<StatusLabel status={status}/>}
        options={[
          // {value: 'executing', text: FUtil.I18n.message('enabled')},
          {value: 'executing', text: FI18n.i18nNext.t('enabled')},
          {value: 'stopped', text: FI18n.i18nNext.t('disabled')},
        ]}
      />
    </div>
    <div style={{height: 5}}/>
    <div className={styles.policyContent}>
      <pre>{code}</pre>
    </div>
    <div style={{height: 3}}/>
    <div className={styles.fullscreen}>
      <FTextBtn type="default" onClick={onPreview}>全屏查看</FTextBtn>
    </div>
  </div>);
}

export default PolicyCard;
