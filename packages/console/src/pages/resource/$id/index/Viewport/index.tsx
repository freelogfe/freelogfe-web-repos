import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";
import {FAntvG6DependencyGraph} from "@/components/FAntvG6";

function Viewport() {
  return (<>
    <div style={{height: 30}}/>
    <div>
      <FTitleText text={'相关视图'} type={'h4'}/>
      <div style={{height: 20}}/>
      <div className={styles.content}>
        <FAntvG6DependencyGraph
          nodes={[
            {
              id: 'node1', // String，该节点存在则必须，节点的唯一标识\
              name: 'node1',
              resourceType: 'markdown',
              version: '1.1.1',
            },
            {
              id: 'node2',
              name: 'node2',
              resourceType: 'json',
              version: '1.0.0',
            },
            {
              id: 'node3',
              name: 'node3',
              resourceType: 'image',
              version: '0.1.0',
            },
            {
              id: 'node4',
              name: 'node4',
              resourceType: 'theme',
              version: '1.0.1',
            },
            {
              id: 'node5',
              name: 'node5',
              resourceType: 'txt',
              version: '3.0.0',
            },
            {
              id: 'node6',
              name: 'node6',
              resourceType: 'txt',
              version: '3.0.0',
            },
            {
              id: 'node7',
              name: 'node7',
              resourceType: 'txt',
              version: '3.0.0',
            },
          ]}
          edges={[
            {
              source: 'node1', // String，必须，起始点 id
              target: 'node2', // String，必须，目标点 id
            },
            {
              source: 'node1', // String，必须，起始点 id
              target: 'node3', // String，必须，目标点 id
            },
            {
              source: 'node3', // String，必须，起始点 id
              target: 'node4', // String，必须，目标点 id
            },
            {
              source: 'node3', // String，必须，起始点 id
              target: 'node5', // String，必须，目标点 id
            },
            {
              source: 'node5', // String，必须，起始点 id
              target: 'node6', // String，必须，目标点 id
            },
            {
              source: 'node6', // String，必须，起始点 id
              target: 'node7', // String，必须，目标点 id
            },
          ]}
        />
      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default Viewport;
