import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
// import ReactDOM from 'react-dom';

const g6ResourceTextXML = (cfg: any) => `<rect style={{
    width: 150,
    height: 64,
    fill: '#fff',
    stroke: '#EFEFEF',
    radius: 10
  }}>
  <text>${cfg.name}</text>
</rect>`;

G6.registerNode('g6-resource', {
  jsx: g6ResourceTextXML,
});

interface FAntvG6Props {
  data: any;
}

const nodes = [
  {
    id: 'node1', // String，该节点存在则必须，节点的唯一标识\
    name: 'node1',
  },
  {
    id: 'node2',
    name: 'node2',
  },
  {
    id: 'node3',
    name: 'node3',
  },
  {
    id: 'node4',
    name: 'node4',
  },
  {
    id: 'node5',
    name: 'node5',
  },
];

// 边集
const edges = [
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
];

function FAntvG6({}: FAntvG6Props) {
  const ref = React.useRef(null);
  let graph: any = null;

  React.useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || '',
        width: 920,
        height: 500,
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
        },
      });
    }
    graph.data({
      nodes,
      edges,
    });
    graph.render();
  }, []);
  return (<div ref={ref}/>);
}

export default FAntvG6;
