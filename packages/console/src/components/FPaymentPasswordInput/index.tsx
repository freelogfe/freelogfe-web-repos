import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { InputHTMLAttributes } from 'react';

interface FPaymentPasswordInputProps {
  value: string;

  onChange?(value: string): void;
}

function FPaymentPasswordInput({ value, onChange }: FPaymentPasswordInputProps) {

  const inputEl = React.useRef<any>(null);
  const [isFocus, setIsFocus] = React.useState<boolean>(false);

  return (<div className={styles.styles}>
    <input
      // type='password'
      minLength={6}
      maxLength={6}
      ref={inputEl}
      value={value}
      onChange={(e) => {
        onChange && onChange(e.target.value.replace(/[^\d]/g, ''));
      }}
      onFocus={() => {
        setIsFocus(true);
      }}
      onBlur={() => {
        setIsFocus(false);
      }}
    />
    <Space size={8} onClick={() => {
      // console.log('#####9832hrlkjfsd');
      inputEl.current.focus();
    }}>
      {
        Array(6).fill(null).map((_, inx) => {
          return (<div
            className={[styles.InputBox, isFocus && (value.length === inx || inx === 5 && value.length >= 6) ? styles.InputBoxActivated : ''].join(' ')}>
            {
              isFocus && value.length === inx && (<span>|</span>)
            }
            {
              value.length > inx && (<span>*</span>)
            }

          </div>);
        })
      }
    </Space>
  </div>);
}

export default FPaymentPasswordInput;
