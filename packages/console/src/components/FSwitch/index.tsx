import * as React from 'react';
import styles from './index.less';
import {Switch} from "antd";
import {SwitchProps} from "antd/lib/switch";

interface FSwitchProps extends SwitchProps {

}

function FSwitch({...props}: FSwitchProps) {
  return (<Switch
    size="small"
    {...props}
  />);
}

export default FSwitch;
