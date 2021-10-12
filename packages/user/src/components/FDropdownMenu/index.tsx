import * as React from 'react';

import styles from './index.less';
import FMenu, {FMenuProps} from '@/components/FMenu';
import {DownOutlined} from '@ant-design/icons';
import FDropdown from "@/components/FDropdown";

interface FDropdownMenuProps extends FMenuProps {
  children?: React.ReactNode;
  text?: React.ReactNode;
  onChange?: (value: string) => void;
}

function FDropdownMenu({options, children, text, onChange}: FDropdownMenuProps) {
  return (<FDropdown
    overlay={<FMenu
      onClick={onChange}
      options={options}/>}>
    {text ? (<div className={styles.text}>
      {text}
      <DownOutlined className={styles.DownOutlined}/>
    </div>) : children}
  </FDropdown>)
}

export default FDropdownMenu;
