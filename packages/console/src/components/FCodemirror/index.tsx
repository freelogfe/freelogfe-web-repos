import * as React from 'react';

import styles from './index.less';
import { Controlled as CodeMirror, IControlledCodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

interface FCodemirror extends Partial<IControlledCodeMirror> {
  value: string;
  onChange?: (value: string) => void;

  className?: string;
  // style?: CSSProperties;
  // onBeforeChange?: (editor, data, value) => void;
}

function FCodemirror({ value, onChange, className = '', ...props }: FCodemirror) {
  return (<CodeMirror
    {...props}
    className={[styles.CodeMirror, className].join(' ')}
    value={value}
    options={{
      lineNumbers: true,
      readOnly: false,
      indentWithTabs: false,
      // disabled: true,
    }}
    onBeforeChange={(editor, data, value) => {
      return onChange && onChange(value);
    }}
    onChange={(editor, data, value) => {
      // console.log('#######');
      // return onChange && onChange(value);
    }}
  />);
}

export default FCodemirror;
