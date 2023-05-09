import * as React from 'react';

import styles from './index.less';
import FMenu, { FMenuProps } from '../FMenu';
// import {Dropdown} from 'antd';
import { DownOutlined } from '@ant-design/icons';
// import FDropdown from "../FDropdown";
import FComponentsLib from '@freelog/components-lib';

interface FDropdownMenuProps extends FMenuProps {
  children?: React.ReactNode;
  text?: React.ReactNode;
  onChange?: (value: string) => void;
}

function FDropdownMenu({ options, children, text, onChange }: FDropdownMenuProps) {
  return (<FComponentsLib.FDropdown
    overlay={<FMenu
      onClick={onChange}
      options={options} />}>
    {text ? (<div className={styles.text}>
      {text}
      {/*<DownOutlined className={styles.DownOutlined} />*/}
      <FComponentsLib.FIcons.FDown className={styles.DownOutlined} style={{ fontSize: 12 }} />
    </div>) : children}
  </FComponentsLib.FDropdown>);
}

export default FDropdownMenu;
