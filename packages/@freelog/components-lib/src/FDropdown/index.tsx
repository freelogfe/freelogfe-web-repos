import * as React from 'react';
import styles from './index.less';
import {Dropdown} from 'antd';
import {DropDownProps} from "antd/lib/dropdown";

interface FDropdownProps extends DropDownProps {
    children: React.ReactNode;
}

function FDropdown({children, overlay, overlayClassName, ...props}: FDropdownProps) {
    return (<Dropdown
        {...props}
        overlay={overlay}
        overlayClassName={styles.dropdown + ' ' + overlayClassName}
    >
        <div className={styles.children}>{children}</div>
    </Dropdown>);
}

export default FDropdown;
