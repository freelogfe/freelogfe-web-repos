import * as React from 'react';

import styles from './index.less';
// import {UnControlled as CodeMirror} from "react-codemirror2";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

interface FCodemirror {
  value: string;
}

export default function ({value}: FCodemirror) {
  return (<CodeMirror
    value={value}
    options={{
      lineNumbers: true,
      readOnly: false,
      indentWithTabs: false,
      // disabled: true,
    }}
    onBeforeChange={(editor, data, value) => {
      // this.setState({value});
    }}
    onChange={(editor, data, value) => {
    }}
  />);
}
