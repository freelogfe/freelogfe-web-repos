import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import FDropdown from "@/components/FDropdown";
import StatusLabel from "@/pages/resource/components/StatusLabel";
import {i18nMessage} from "@/utils/i18n";
import {FTextButton} from "@/components/FButton";
import FDropdownMenu from "@/components/FDropdownMenu";

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
          // {value: 'executing', text: i18nMessage('enabled')},
          {value: 'executing', text: i18nMessage('enabled')},
          {value: 'stopped', text: i18nMessage('disabled')},
        ]}
      />
    </div>
    <div style={{height: 5}}/>
    <div className={styles.policyContent}>
      <pre>{code}</pre>
    </div>
    <div style={{height: 3}}/>
    <div className={styles.fullscreen}>
      <FTextButton onClick={onPreview}>全屏查看</FTextButton>
    </div>
  </div>);
}

export default PolicyCard;
