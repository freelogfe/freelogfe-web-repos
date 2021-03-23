import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
import {GraphData} from "@antv/g6/lib/types";
// import ReactDOM from 'react-dom';

const g6ResourceTextXML = (cfg: any) => `
<group>
  <rect style={{
      width: 'fit-content',
      height: 64,
      fill: '#fff',
      stroke: '#EFEFEF',
      radius: 10,
    }}>
    <text style={{fontSize: 14, fontWeight: 600, fill:'#222', marginTop: 14,marginLeft: 10,}}>${cfg.name}&nbsp;</text>
    <text style={{fontSize: 12, fontWeight: 400, fill:'#666', marginTop: 16,marginLeft: 10,}}>${cfg.resourceType}｜${cfg.version}&nbsp;</text>
  </rect>
</group>`;

G6.registerNode('g6-resource', {
  jsx: g6ResourceTextXML,
});

interface FAntvG6DependencyGraphProps extends GraphData {
  nodes: {
    id: string; // String，该节点存在则必须，节点的唯一标识\
    name: string;
    resourceType: string;
    version: string;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
}

// const nodes = [
//   {
//     id: 'node1', // String，该节点存在则必须，节点的唯一标识\
//     name: 'node1',
//     resourceType: 'markdown',
//     version: '1.1.1',
//   },
//   {
//     id: 'node2',
//     name: 'node2',
//     resourceType: 'json',
//     version: '1.0.0',
//   },
//   {
//     id: 'node3',
//     name: 'node3',
//     resourceType: 'image',
//     version: '0.1.0',
//   },
//   {
//     id: 'node4',
//     name: 'node4',
//     resourceType: 'theme',
//     version: '1.0.1',
//   },
//   {
//     id: 'node5',
//     name: 'node5',
//     resourceType: 'txt',
//     version: '3.0.0',
//   },
//   {
//     id: 'node6',
//     name: 'node6',
//     resourceType: 'txt',
//     version: '3.0.0',
//   },
//   {
//     id: 'node7',
//     name: 'node7',
//     resourceType: 'txt',
//     version: '3.0.0',
//   },
// ];

// 边集
// const edges = [
//   {
//     source: 'node1', // String，必须，起始点 id
//     target: 'node2', // String，必须，目标点 id
//   },
//   {
//     source: 'node1', // String，必须，起始点 id
//     target: 'node3', // String，必须，目标点 id
//   },
//   {
//     source: 'node3', // String，必须，起始点 id
//     target: 'node4', // String，必须，目标点 id
//   },
//   {
//     source: 'node3', // String，必须，起始点 id
//     target: 'node5', // String，必须，目标点 id
//   },
//   {
//     source: 'node5', // String，必须，起始点 id
//     target: 'node6', // String，必须，目标点 id
//   },
//   {
//     source: 'node6', // String，必须，起始点 id
//     target: 'node7', // String，必须，目标点 id
//   },
// ];

let graph: any = null;

function FAntvG6DependencyGraph(data: FAntvG6DependencyGraphProps) {
  const ref = React.useRef(null);

  React.useEffect(() => {

    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || '',
        width: 920,
        height: 500,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        layout: {
          // type: 'mindmap',
          // type: 'compactBox',
          type: 'dagre',
          rankdir: 'LR', // 可选，默认为图的中心
          // nodesep: 20,
          // ranksep: 100,
          // align: 'DL', // 可选
          preventOverlap: true,
          controlPoints: true,
          // direction: 'H',
          // getHeight: () => {
          //   return 200;
          // },
          // getWidth: () => {
          //   return 64;
          // },
          // getVGap: () => {
          //   return 10;
          // },
          // getHGap: () => {
          //   return 100;
          // },
          // getSide: () => {
          //   return 'right';
          // },
        },
        defaultNode: {
          type: 'g6-resource',
          // width: 150,
          // height: 64,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          // labelCfg: {
          //   style: {
          //     // fill: '#000000A6',
          //     // fontSize: 10,
          //   },
          // },
          style: {
            // stroke: '#72CC4A',
            // width: 150,
            // height: 64,
          },
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#979797',
          },
          sourceAnchor: 1,
          targetAnchor: 0,
        },
        // renderer: 'svg',
      });
    }
    graph.data(data);
    graph.render();
  }, []);
  return (<div ref={ref}/>);
}

export default FAntvG6DependencyGraph;
