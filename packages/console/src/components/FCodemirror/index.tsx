import * as React from 'react';

import styles from './index.less';
// import {UnControlled as CodeMirror} from "react-codemirror2";
import {Controlled as CodeMirror, IControlledCodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

interface FCodemirror extends Partial<IControlledCodeMirror>{
  value: string;
  onChange?: (value: string) => void;
  // onBeforeChange?: (editor, data, value) => void;
}

function FCodemirror({value, onChange}: FCodemirror) {
  return (<CodeMirror
    className={styles.CodeMirror}
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
