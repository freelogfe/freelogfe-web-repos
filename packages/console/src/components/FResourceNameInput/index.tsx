import * as React from 'react';
import styles from './index.less';
import { Input, InputRef } from 'antd';

interface FResourceNameInputProps {
  value: string;
}

function FResourceNameInput({value}: FResourceNameInputProps) {

  const inputRef = React.useRef<InputRef>(null);

  return (<div
    className={styles.container}
    onClick={() => {
      inputRef.current?.focus();
    }}
  >
    <label>freelog&nbsp;/&nbsp;</label>
    <Input ref={inputRef} className={styles.input} value={value} />
  </div>);
}

export default FResourceNameInput;
