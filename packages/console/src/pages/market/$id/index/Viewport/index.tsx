import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";

function Viewport() {
  return(<div>
    <FTitleText text={'相关视图'} type={'h3'}/>
    <div style={{height: 20}}/>
    <div className={styles.content}>

    </div>
  </div>);
}

export default Viewport;
