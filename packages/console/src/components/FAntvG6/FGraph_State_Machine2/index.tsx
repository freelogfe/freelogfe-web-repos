import * as React from 'react';
import styles from './index.less';
import { FlowAnalysisGraph } from '@ant-design/graphs';
import './fRegisterNode';
import {
  F_STATE_MACHINE_NODE_TYPE,
  // FNode_State_Machine_Event_Values,
  FNode_State_Machine_State_Values, FNode_State_Machine_StateNoAuth_Values,
} from './fRegisterNode';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import G6 from '@antv/g6';

// import { ArrowConfig, Shape, ShapeCfg } from '@ant-design/graphs/es/interface';

interface FGraph_State_Machine_Props {
  fsmDescriptionInfo: PolicyFullInfo_Type['fsmDescriptionInfo'];
  width?: number;
  height?: number;
}

interface FGraph_State_Machine_States {
  dataSource_Nodes_State: Array<{
    id: string;
  } & ({
    nodeType: 'state';
    value: FNode_State_Machine_State_Values;
  } | {
    nodeType: 'stateTerminal';
    value: FNode_State_Machine_StateNoAuth_Values;
  } | {
    nodeType: 'stateNoAuth';
    value: FNode_State_Machine_StateNoAuth_Values;
  })>;
  // dataSource_Nodes_Event: {
  //   id: string;
  //   nodeType: 'event';
  //   value: FNode_State_Machine_Event_Values;
  // }[];
  dataSource_Edges: {
    source: string;
    target: string;
    label: string;
    type?: string;
  }[];
}

// const initStates: FGraph_State_Machine_States = {
//   dataSource_Nodes_State: [],
//   // dataSource_Nodes_Event: [],
//   dataSource_Edges: [],
// };

const timeUnit = {
  year: '年',
  month: '月',
  week: '周',
  day: '天',
  cycle: '周期',
};

function FGraph_State_Machine2({ fsmDescriptionInfo, width, height }: FGraph_State_Machine_Props) {

  const ref = React.useRef(null);
  // const [dataSource_Nodes_State, set_DataSource_Nodes_State] = React.useState<FGraph_State_Machine_States['dataSource_Nodes_State']>(initStates['dataSource_Nodes_State']);
  // const [dataSource_Edges, set_DataSource_Edges] = React.useState<FGraph_State_Machine_States['dataSource_Edges']>(initStates['dataSource_Edges']);

  React.useEffect(() => {
    // set_DataSource(data);
    handleData();
  }, [fsmDescriptionInfo]);

  function handleData() {
    const nodes_state: FGraph_State_Machine_States['dataSource_Nodes_State'] = [];
    // const nodes_event: FGraph_State_Machine_States['dataSource_Nodes_Event'] = [];
    const edges: FGraph_State_Machine_States['dataSource_Edges'] = [];
    for (const state of Object.entries(fsmDescriptionInfo)) {
      // console.log(state[0]);
      const stateID: string = state[0];
      const auths: string[] = [];
      if (state[1].isAuth) {
        auths.push('正式授权');
      }
      if (state[1].isTestAuth) {
        auths.push('测试授权');
      }
      if (auths.length === 0) {
        if (state[1].transitions.length === 0) {
          nodes_state.push({
            id: stateID,
            nodeType: 'stateTerminal',
            value: {
              stateName: state[0],
            },
          });
        } else {
          nodes_state.push({
            id: stateID,
            nodeType: 'stateNoAuth',
            value: {
              stateName: state[0],
            },
          });
        }

      } else {
        nodes_state.push({
          id: stateID,
          nodeType: 'state',
          value: {
            stateName: state[0],
            auths: auths,
          },
        });
      }

      for (const event of Object.entries(state[1].transitions)) {
        // const eventID: string = state[0] + ':' + event[0];
        let eventDescription: string = '';
        if (event[1].name === 'RelativeTimeEvent') {
          // { elapsed: number, timeUnit: 'month' }
          eventDescription = `${event[1].args.elapsed} ${timeUnit[event[1].args.timeUnit]}后`;
        } else if (event[1].name === 'TimeEvent') {
          eventDescription = `于 ${event[1].args.dateTime}`;
        } else if (event[1].name === 'TransactionEvent') {
          eventDescription = `支付 ${event[1].args.amount}枚 羽币`;
        }
        // nodes_event.push({
        //   id: eventID,
        //   nodeType: 'event',
        //   value: {
        //     eventDescription: eventDescription,
        //   },
        // });
        // edges.push({
        //   source: stateID,
        //   target: eventID,
        // });
        // edges.push({
        //   source: eventID,
        //   target: event[1].toState,
        // });
        edges.push({
          source: stateID,
          target: event[1].toState,
          label: eventDescription,
          type: stateID === event[1].toState ? 'loop' : undefined,
        });
      }
    }

    let graph: any = null;

    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || '',
        width: width,
        height: height,
        fitView: true,
        // fitViewPadding: [20, 40, 50, 20],
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR', // 可选，默认为图的中心
          // align: 'DL', // 可选
          preventOverlap: true,
          controlPoints: true,
          workerEnabled: true,
          nodesep: 20,
          ranksep: 100,
        },
        defaultNode: {
          type: F_STATE_MACHINE_NODE_TYPE,
          anchorPoints: [
            // [0, 0],
            // [0, 0.5],
            // [1, 0.5],
          ],
        },
        defaultEdge: {
          // sourceAnchor: 1,
          // targetAnchor: 0,
          type: 'cubic-horizontal',
          style: {
            endArrow: true,
          },
          stateStyles: {
            hover: {
              stroke: '#1890ff',
              lineWidth: 2,
            },
          }
        },
      });

      graph.read({
        nodes: nodes_state,
        edges,
      });
    } else {
      graph.changeData({
        nodes: nodes_state,
        edges,
      });
    }
    // console.log(nodes_state, 'nodes_state98023iolk');
    // console.log(nodes_event, 'nodes_event98023iolk');
    // console.log(edges, 'edges98023iolk');
    // set_DataSource_Nodes_State(nodes_state);
    // set_DataSource_Nodes_Event(nodes_event);
    // set_DataSource_Edges(edges);
  }

  return (<div
    style={{
      width: width,
      height: height,
    }}
    ref={ref}
  />);

  // return (<FlowAnalysisGraph
  //   autoFit={true}
  //   animate={true}
  //   data={{
  //     nodes: [
  //       ...dataSource_Nodes_State,
  //       // ...dataSource_Nodes_Event,
  //     ] as any,
  //     edges: [
  //       ...dataSource_Edges,
  //     ],
  //   }}
  //   width={width || undefined}
  //   height={height || undefined}
  //   nodeCfg={{
  //     anchorPoints: [
  //       // [0.5, 0],
  //       // [0.5, 1],
  //     ],
  //     type: F_STATE_MACHINE_NODE_TYPE,
  //     nodeStateStyles: {
  //       hover: {
  //         stroke: '#1890ff',
  //         lineWidth: 2,
  //       },
  //     },
  //   }}
  //   edgeCfg={{
  //     // type: 'cubic-horizontal',
  //     // type: 'polyline',
  //     startArrow(edge) {
  //       return {
  //         // type: (edge as any).source.includes(':') ? 'diamond' : 'rect',
  //         // type: 'diamond',
  //         // fill: 'red',
  //       };
  //     },
  //     endArrow(edge) {
  //       console.log(edge, 'edge2309oijlskdfjlsdkfj');
  //       return {
  //         // type: (edge as any).target.includes(':') ? 'diamond' : 'vee',
  //         // type: (edge as any).target.includes(':') ? 'diamond' : 'triangle',
  //         type: 'vee',
  //         // fill: 'green',
  //       };
  //     },
  //     // edgeStateStyles: {
  //     //   hover: {},
  //     // },
  //   }}
  //   layout={{
  //     // rankdir: 'TB',
  //     rankdir: 'LR',
  //     /** Number of pixels that separate nodes vertically in the layout. */
  //     nodesepFunc(node: any) {
  //       // return node.nodeType === 'event' ? 200 : 200;
  //       return 20;
  //     },
  //     /** Number of pixels that separate nodes horizontally in the layout. */
  //     ranksepFunc(node: any) {
  //       // return node.nodeType === 'event' ? 50 : 64;
  //       return 50;
  //     },
  //   }}
  //   // markerCfg={(cfg) => {
  //   //   return {
  //   //     position: 'bottom',
  //   //     show: data.edges.filter((item) => item.source === cfg.id)?.length,
  //   //   };
  //   // }}
  //   behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
  // />);
}

export default FGraph_State_Machine2;
