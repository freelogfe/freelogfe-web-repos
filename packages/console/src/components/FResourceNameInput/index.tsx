import * as React from 'react';
import styles from './index.less';
import { Input, InputRef } from 'antd';

interface FResourceNameInputProps {
  userName: string;
  value: string;

  onChange?(value: string): void;
}

function FResourceNameInput({ userName, value, onChange }: FResourceNameInputProps) {

  const inputRef = React.useRef<InputRef>(null);

  return (<div
    className={styles.container}
    onClick={() => {
      inputRef.current?.focus();
    }}
  >
    <label>{userName}&nbsp;/&nbsp;</label>
    <Input
      ref={inputRef}
      className={styles.input}
      value={value}
      onChange={(e) => {
        onChange && onChange(e.target.value);
      }}
    />
  </div>);
}

export default FResourceNameInput;
