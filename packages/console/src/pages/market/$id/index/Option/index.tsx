import * as React from "react";
import {FTitleText, FContentText} from "@/components/FText";
import styles from "./index.less";
import {Space} from "antd";
import {FInfo} from "@/components/FIcons";

function Option() {
  return (<div>
    <FTitleText text={'自定义选项'} type={'h3'}/>
    <div style={{height: 20}}/>
    <div className={styles.content}>
      <div>
        <Space size={10}>
          <FContentText text={'推荐语'}/>
          <FInfo/>
        </Space>
      </div>

    </div>
  </div>);
}

export default Option;
