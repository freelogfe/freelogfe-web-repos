import * as React from 'react';
import styles from './index.less';
import { FlowAnalysisGraph } from '@ant-design/graphs';
import './fRegisterNode';
import { F_STATE_MACHINE_NODE_TYPE } from './fRegisterNode';

interface FGraph_State_Machine_Props {

}

const data = {
  nodes: [
    {
      id: '0',
      type: 'state',
      value: {
        stateName: 'initial',
        colors: ['active', 'testActive'],
      },
    },
    {
      id: '1',
      type: 'state',
      value: {
        stateName: 'auth',
        colors: ['active', 'testActive'],
      },
    },
    {
      id: '2',
      type: 'event',
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

function FGraph_State_Machine({}: FGraph_State_Machine_Props) {

  const [dataSource, set_DataSource] = React.useState();

  return (<FlowAnalysisGraph
    data={data as any}
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
