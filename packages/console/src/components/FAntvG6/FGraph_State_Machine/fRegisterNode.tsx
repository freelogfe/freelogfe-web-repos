import React from 'react';
import { createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';

export type FNode_State_Machine_State_Values = {
  stateName: string;
  colors: Array<'active' | 'testActive'>;
};

const statusInfo = {
  active: {
    color1: '#8FD6B8',
    color2: '#E5F6EF',
    text: '正式授权',
  },
  inActive: {
    color1: '#D4D4D4',
    color2: '#FFFFFF',
    text: '测试授权',
  },
  terminal: {
    color1: '#EE4040',
    color2: '#FDEBEC',
    text: '停止接收事件',
  },
};

interface FNode_State_Machine_State_Props {
  value: FNode_State_Machine_State_Values;
}

function FNode_State_Machine_State({ value }: FNode_State_Machine_State_Props) {
  const { stateName, colors } = value;
  const stateInfo: 'active' | 'inActive' | 'terminal' = colors.length > 0 ? 'active' : 'inActive';
  return (<Group draggable={true}>
    <Rect
      draggable
      style={{
        fill: statusInfo[stateInfo].color2,
        stroke: statusInfo[stateInfo].color1,
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
      }}
      onClick={() => {
        // console.log('#######98ioklj');
      }}
    >
      {/*<Rect style={{ width: 200, height: 64, fill: 'red', marginLeft: 10, marginTop: -74}} />*/}
      <Text
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
          padding: [3, 0],
        }}
        onClick={() => {
          // console.log('#####2342394ui3jk');
        }}
      >{textOverflowEllipsis(stateName)}</Text>
      <Rect style={{ height: 10 }} />
      <Rect style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
        {
          colors.map((co) => {
            return (<Text
              key={co}
              style={{
                fill: statusInfo[stateInfo].color1,
                fontSize: 12,
                fontWeight: 600,
              }}
              onClick={(evt, node, shape, graph) => {

              }}
            >{statusInfo[stateInfo].text}</Text>);
          })
        }

      </Rect>
    </Rect>
  </Group>);
}

function FNode_State_Machine({ cfg = {} }: any) {
  // console.log(cfg, 'cfg@@#09soidjlfsdfjsdlkfjsdlkfjl');
  // if (cfg.nodeType === 'resource') {
  //   return (<FNode_Dependency_Resource
  //     value={cfg.value}
  //   />);
  // }
  //
  if (cfg.nodeType === 'state') {
    return (<FNode_State_Machine_State
      value={cfg.value}
    />);
  }

  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
}


export const F_STATE_MACHINE_NODE_TYPE: string = 'FNode_State_Machine';

G6.registerNode(F_STATE_MACHINE_NODE_TYPE, createNodeFromReact(FNode_State_Machine));
