import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";
import FAntvG6 from "@/components/FAntvG6";

function Viewport() {
  return (<>
    <div style={{height: 30}}/>
    <div>
      <FTitleText text={'相关视图'} type={'h3'}/>
      <div style={{height: 20}}/>
      <div className={styles.content}>
        <FAntvG6 data={{
          // 点集
          nodes: [
            {
              id: 'node1', // String，该节点存在则必须，节点的唯一标识
              x: 100, // Number，可选，节点位置的 x 值
              y: 200, // Number，可选，节点位置的 y 值
            },
            {
              id: 'node2', // String，该节点存在则必须，节点的唯一标识
              x: 300, // Number，可选，节点位置的 x 值
              y: 200, // Number，可选，节点位置的 y 值
            },
          ],
          // 边集
          edges: [
            {
              source: 'node1', // String，必须，起始点 id
              target: 'node2', // String，必须，目标点 id
            },
          ],
        }}/>
      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default Viewport;
