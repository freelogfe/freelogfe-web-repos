import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FDown} from "@/components/FIcons";
import FInput from "@/components/FInput";

interface HeaderProps {

}

function Header({}: HeaderProps) {
  return (<div className={styles.header}>
    <FTitleText type="h1" text={'展品管理'}/>
    <Space size={80}>
      <div>
        <span>类型：</span>
        <span>全部 <FDown/></span>
      </div>
      <div>
        <span>状态：</span>
        <span>全部 <FDown/></span>
      </div>
      <div>
        <FInput
          className={styles.input}
          theme="dark"
        />
      </div>
    </Space>
  </div>);
}

export default Header;
