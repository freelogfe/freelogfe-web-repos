import * as React from 'react';
import styles from './index.less';
import { FlowAnalysisGraph } from '@ant-design/graphs';
import './fRegisterNode';
import { F_STATE_MACHINE_NODE_TYPE } from './fRegisterNode';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

interface FGraph_State_Machine_Props {

}

const data = {
  nodes: [
    {
      id: '0',
      nodeType: 'state',
      value: {
        stateName: 'initial',
        colors: ['active', 'testActive'],
      },
    },
    {
      id: '1',
      nodeType: 'state',
      value: {
        stateName: 'auth',
        colors: ['active', 'testActive'],
      },
    },
    {
      id: '2',
      nodeType: 'event',
      value: {
        eventDescription: '支付10块钱',
      },
    },
  ],
  edges: [
    {
      source: '0',
      target: '1',
    },
    {
      source: '1',
      target: '2',
    },
  ],
};

interface FGraph_State_Machine_Props {
  fsmDescriptionInfo: PolicyFullInfo_Type['fsmDescriptionInfo'];
}

interface FGraph_State_Machine_States {
  dataSource_Nodes_State: {
    id: string;
    nodeType: 'state';
    value: {
      stateName: string;
      colors: Array<'active' | 'testActive'>
    },
  }[];
  dataSource_Nodes_Event: {
    id: string;
    nodeType: 'event';
    value: {
      eventDescription: string;
    };
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

function FGraph_State_Machine({ fsmDescriptionInfo }: FGraph_State_Machine_Props) {

  const [dataSource_Nodes_State, set_DataSource_Nodes_State] = React.useState<FGraph_State_Machine_States['dataSource_Nodes_State']>(initStates['dataSource_Nodes_State']);
  const [dataSource_Nodes_Event, set_DataSource_Nodes_Event] = React.useState<FGraph_State_Machine_States['dataSource_Nodes_Event']>(initStates['dataSource_Nodes_Event']);
  const [dataSource_Edges, set_DataSource_Edges] = React.useState<FGraph_State_Machine_States['dataSource_Edges']>(initStates['dataSource_Edges']);

  React.useEffect(() => {
    // set_DataSource(data);
  }, [fsmDescriptionInfo]);

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
    width={1000}
    height={600}
    // layout={{
    //   rankdir: 'TB',
    //   ranksepFunc: () => 20,
    // }}
    nodeCfg={{
      // anchorPoints: [
      //   [0.5, 0],
      //   [0.5, 1],
      // ],
      type: F_STATE_MACHINE_NODE_TYPE,
    }}
    edgeCfg={{
      type: 'polyline',
      // endArrow: true,
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
