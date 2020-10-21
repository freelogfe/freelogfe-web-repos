import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";

interface ViewportsProps {

}

function Viewports({}: ViewportsProps) {
  return (<div>
    <FTitleText text={'相关视图'} type="h3"/>
    <div style={{height: 20}}/>
    <div className={styles.Viewports}>

    </div>
  </div>);
}

export default Viewports;
