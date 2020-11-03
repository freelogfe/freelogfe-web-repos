import * as React from 'react';
import styles from './index.less';
import {Dropdown} from 'antd';
import {DropDownProps} from "antd/lib/dropdown";

interface FDropdownProps extends DropDownProps {
  children: React.ReactElement;
  // overlay:
}

function FDropdown({children, overlay, overlayClassName, ...props}: FDropdownProps) {
  return (<Dropdown
    {...props}
    overlay={overlay}
    overlayClassName={styles.dropdown + ' ' + overlayClassName}
  >{children}</Dropdown>);
}

export default FDropdown;
