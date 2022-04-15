import * as React from 'react';
import styles from './index.less';
import { FlowAnalysisGraph } from '@ant-design/graphs';
import './fRegisterNode';
import {
  F_STATE_MACHINE_NODE_TYPE,
  FNode_State_Machine_Event_Values,
  FNode_State_Machine_State_Values, FNode_State_Machine_StateNoAuth_Values,
} from './fRegisterNode';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { ArrowConfig, Shape, ShapeCfg } from '@ant-design/graphs/es/interface';

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
    nodeType: 'stateNoAuth';
    value: FNode_State_Machine_StateNoAuth_Values;
  })>;
  dataSource_Nodes_Event: {
    id: string;
    nodeType: 'event';
    value: FNode_State_Machine_Event_Values;
  }[];
  dataSource_Edges: {
    source: string;
    target: string;
  }[];
}

const initStates: FGraph_State_Machine_States = {
  dataSource_Nodes_State: [],
  dataSource_Nodes_Event: [],
  dataSource_Edges: [],
};

const timeUnit = {
  year: '年',
  month: '月',
  week: '周',
  day: '天',
  cycle: '周期',
};

function FGraph_State_Machine({ fsmDescriptionInfo, width, height }: FGraph_State_Machine_Props) {
  // console.log(fsmDescriptionInfo, 'fsmDescriptionInfo9832iosdlkfjl');
  const [dataSource_Nodes_State, set_DataSource_Nodes_State] = React.useState<FGraph_State_Machine_States['dataSource_Nodes_State']>(initStates['dataSource_Nodes_State']);
  const [dataSource_Nodes_Event, set_DataSource_Nodes_Event] = React.useState<FGraph_State_Machine_States['dataSource_Nodes_Event']>(initStates['dataSource_Nodes_Event']);
  const [dataSource_Edges, set_DataSource_Edges] = React.useState<FGraph_State_Machine_States['dataSource_Edges']>(initStates['dataSource_Edges']);

  React.useEffect(() => {
    // set_DataSource(data);
    handleData();
  }, [fsmDescriptionInfo]);

  function handleData() {
    const nodes_state: FGraph_State_Machine_States['dataSource_Nodes_State'] = [];
    const nodes_event: FGraph_State_Machine_States['dataSource_Nodes_Event'] = [];
    const edges: FGraph_State_Machine_States['dataSource_Edges'] = [];
    for (const state of Object.entries(fsmDescriptionInfo)) {
      // console.log(state[0]);
      const stateID: string = state[0];
      const colors: Array<'active' | 'testActive'> = [];
      if (state[1].isAuth) {
        colors.push('active');
      }
      if (state[1].isTestAuth) {
        colors.push('testActive');
      }
      if (colors.length === 0) {
        nodes_state.push({
          id: stateID,
          nodeType: 'stateNoAuth',
          value: {
            stateName: '状态 ' + state[0],
          },
        });
      } else {
        nodes_state.push({
          id: stateID,
          nodeType: 'state',
          value: {
            stateName: '状态 ' + state[0],
            colors: colors,
          },
        });
      }

      for (const event of Object.entries(state[1].transitions)) {
        const eventID: string = state[0] + ':' + event[0];
        let eventDescription: string = '';
        if (event[1].name === 'RelativeTimeEvent') {
          // { elapsed: number, timeUnit: 'month' }
          eventDescription = `${event[1].args.elapsed} ${timeUnit[event[1].args.timeUnit]}后`;
        } else if (event[1].name === 'TimeEvent') {
          eventDescription = `于 ${event[1].args.dateTime}`;
        } else if (event[1].name === 'TransactionEvent') {
          eventDescription = `支付 ${event[1].args.amount}枚 羽币`;
        }
        nodes_event.push({
          id: eventID,
          nodeType: 'event',
          value: {
            eventDescription: eventDescription,
          },
        });
        edges.push({
          source: stateID,
          target: eventID,
        });
        edges.push({
          source: eventID,
          target: event[1].toState,
        });
      }
    }
    // console.log(nodes_state, 'nodes_state98023iolk');
    // console.log(nodes_event, 'nodes_event98023iolk');
    // console.log(edges, 'edges98023iolk');
    set_DataSource_Nodes_State(nodes_state);
    set_DataSource_Nodes_Event(nodes_event);
    set_DataSource_Edges(edges);
  }

  return (<FlowAnalysisGraph
    data={{
      nodes: [
        ...dataSource_Nodes_State,
        ...dataSource_Nodes_Event,
      ] as any,
      edges: [
        ...dataSource_Edges,
      ],
    }}
    width={width || undefined}
    height={height || undefined}
    nodeCfg={{
      anchorPoints: [
        [0.5, 0],
        [0.5, 1],
      ],
      type: F_STATE_MACHINE_NODE_TYPE,
    }}
    edgeCfg={{
      type: 'cubic-vertical',
      // endArrow: true,
      // endArrow: {
      //   show: true,
      // },
      endArrow: (edge: Shape | ShapeCfg | undefined) => {
        // console.log(edge, 'edge2309oijlskdfjlsdkfj');
        return {
          // show: !(edge as any).target.includes(':'),
          show: false,
        };
      },
      edgeStateStyles: {
        hover: {},
      },
    }}
    layout={{
      rankdir: 'TB',
      ranksepFunc: () => 50,
      getHeight: (node: any) => {
        // console.log(node, 'DSFd09opfijlkNNNNNNOOODDEEEE98io');
        // return node.nodeType === 'event' ? 40 : 64;
        return node.nodeType === 'event' ? 50 : 64;
      },
      getWidth: () => {
        return 200;
      },
    }}
    // markerCfg={(cfg) => {
    //   return {
    //     position: 'bottom',
    //     show: data.edges.filter((item) => item.source === cfg.id)?.length,
    //   };
    // }}
    behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
  />);
}

export default FGraph_State_Machine;
