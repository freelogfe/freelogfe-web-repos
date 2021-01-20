import * as React from 'react';
import styles from './index.less';
import {Checkbox} from 'antd';
import {CheckboxProps} from "antd/lib/checkbox";

interface FCheckboxProps extends CheckboxProps {

}

function FCheckbox({...props}: FCheckboxProps) {
  return (<Checkbox {...props}/>);
}

export default FCheckbox;
