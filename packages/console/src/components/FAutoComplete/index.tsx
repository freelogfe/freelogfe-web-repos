import * as React from 'react';
import styles from './index.less';
import {AutoComplete} from 'antd';
import {AutoCompleteProps} from "antd/lib/auto-complete";

interface FAutoCompleteProps extends AutoCompleteProps {
  errorText?: string;
  autoRef?: any;
}

function FAutoComplete({autoRef, errorText, ...props}: FAutoCompleteProps) {
  return (<div className={styles.wrap}>
    <AutoComplete
      ref={(ee: any) => autoRef && autoRef(ee)}
      {...props}
      // className={!!errorText ? styles.AutoCompleteError : ''}
    />
    {
      errorText && (<div className={styles.errorText}>{errorText}</div>)
    }
  </div>);
}

export default FAutoComplete;
