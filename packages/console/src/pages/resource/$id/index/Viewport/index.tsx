import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";

function Viewport() {
  return (<>
    <div style={{height: 30}}/>
    <div>
      <FTitleText text={'相关视图'} type={'h3'}/>
      <div style={{height: 20}}/>
      <div className={styles.content}>

      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default Viewport;
