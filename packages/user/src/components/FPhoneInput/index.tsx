import * as React from 'react';
import styles from './index.less';
import { Input, Select } from 'antd';

interface FPhoneInputProps {
  width?: number | string;
  placeholder?: string;
  inputValue?: string;

  onChangeInput?(value: string): void;

  onBlurInput?(): void;
}

function FPhoneInput({ width = '100%', placeholder, inputValue, onChangeInput, onBlurInput }: FPhoneInputProps) {
  return (<Input.Group className={styles.FPhoneInput} style={{ width }}>
    <Select
      className={styles.select}
      value={'+86 '}
      dropdownMatchSelectWidth={false}
      disabled
      options={[
        {
          value: '+86',
          label: (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>中国</span>
            <div style={{ width: 10 }} />
            <span>+86</span>
          </div>),
        },
      ]}
    />
    <Input
      className={styles.input}
      value={inputValue}
      placeholder={placeholder}
      onChange={(e) => {
        onChangeInput && onChangeInput(e.target.value);
      }}
      onBlur={() => {
        onBlurInput && onBlurInput();
      }}
    />
  </Input.Group>);
}

export default FPhoneInput;
