import * as React from 'react';
import styles from './index.less';
import {PopoverProps} from "antd/lib/popover";
import {Popover} from 'antd';

interface FPopoverProps extends PopoverProps {

}

function FPopover({...props}: FPopoverProps) {
  return (<Popover
    {...props}
  />);
}

export default FPopover;
