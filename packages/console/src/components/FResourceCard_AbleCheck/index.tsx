import * as React from 'react';
import styles from './index.less';
import { Checkbox } from 'antd';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';

interface FResourceCard_AbleCheck_Props {
  checked: boolean;
  disabled?: boolean;
  cover: string;
  resourceType: string;
  latestVersion: string;
  policies: string[];

  onChange?(checked: boolean): void;
}

function FResourceCard_AbleCheck({
                                   checked,
                                   disabled = false,
                                   cover,
                                   resourceType,
                                   latestVersion,
                                   policies,
                                   onChange,
                                 }: FResourceCard_AbleCheck_Props) {
  return (
    <div
      className={[styles.ableCheckCard, checked ? styles.checked : '', disabled ? styles.disabled : ''].join(' ')}
      onClick={() => {
        if (disabled) {
          return;
        }
        onChange && onChange(!checked);
      }}
    >
      <div>
        <Checkbox
          checked={checked}
          disabled={disabled}
        />
      </div>
      <div style={{ height: 10 }} />
      <FCoverImage
        src={cover}
        width={280}
        style={{ display: 'block' }}
      />
      <div style={{ height: 10 }} />
      <div className={styles.ableCheckCardInfo}>
        <FComponentsLib.FContentText
          text={resourceType}
          type={'additional2'}
          style={{ maxWidth: 120 }}
          singleRow
        />

        <FComponentsLib.FContentText
          text={`最新版本 ${latestVersion}`}
          type={'additional2'}
          style={{ maxWidth: 120 }}
          singleRow
        />
      </div>
      <div style={{ height: 10 }} />
      <div className={styles.MetaFooter}>
        {
          policies.length > 0
            ? (<FComponentsLib.F_Contract_And_Policy_Labels
              data={policies.map((p) => {
                return {
                  text: p,
                  dot: '',
                };
              })}
              singleRow
            />)
            : (<FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />)
        }
      </div>
    </div>);
}

export default FResourceCard_AbleCheck;
