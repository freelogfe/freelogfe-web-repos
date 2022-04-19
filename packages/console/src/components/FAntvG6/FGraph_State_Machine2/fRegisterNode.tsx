import React from 'react';
import { createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';

export interface FNode_State_Machine_State_Values {
  stateName: string;
  auths: string[];
}

interface FNode_State_Machine_State_Props {
  value: FNode_State_Machine_State_Values;
}

function FNode_State_Machine_State({ value }: FNode_State_Machine_State_Props) {
  // console.log(value, 'FNode_State_Machine_State980980239099999999&&&&&&&&&&&');
  const { stateName, auths } = value;
  return (<Group draggable={true}>
    <Rect
      draggable
      style={{
        fill: '#E5F6EF',
        stroke: '#8FD6B8',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
        // width: 160,
      }}
      onClick={() => {
        // console.log('#######98ioklj');
      }}
    >
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
      >状态 {textOverflowEllipsis(stateName, 15)}</Text>
      <Rect style={{ height: 10 }} />
      <Rect style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
        {
          auths.map((co) => {
            // console.log(co, 'cocococococococo');
            return (<Text
              key={co}
              style={{
                fill: '#8FD6B8',
                fontSize: 12,
                fontWeight: 600,
                margin: [0, 10, 0, 0],
              }}
            >{co}</Text>);
          })
        }
      </Rect>
    </Rect>
  </Group>);
}

export interface FNode_State_Machine_StateTerminal_Values {
  stateName: string;
}

interface FNode_State_Machine_StateTerminal_Props {
  value: FNode_State_Machine_StateTerminal_Values;
}

function FNode_State_Machine_StateTerminal({ value }: FNode_State_Machine_StateTerminal_Props) {
  // console.log(value, 'FNode_State_Machine_State980980239099999999&&&&&&&&&&&');
  const { stateName } = value;
  return (<Group draggable={true}>
    <Rect
      draggable
      style={{
        fill: '#FDEBEC',
        stroke: '#EE4040',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
        // width: 160,
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
      >状态 {textOverflowEllipsis(stateName, 15)}</Text>
      <Rect style={{ height: 10 }} />
      <Rect style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
        <Text
          style={{
            fill: '#EE4040',
            fontSize: 12,
            fontWeight: 600,
            margin: [0, 10, 0, 0],
          }}
        >停止接收事件</Text>
      </Rect>
    </Rect>
  </Group>);
}

export interface FNode_State_Machine_StateNoAuth_Values {
  stateName: string;
}

interface FNode_State_Machine_StateNoAuth_Props {
  value: FNode_State_Machine_StateNoAuth_Values;
}

function FNode_State_Machine_StateNoAuth({ value }: FNode_State_Machine_StateNoAuth_Props) {
  const { stateName } = value;
  return (<Group draggable={true}>
    <Rect
      draggable
      style={{
        fill: '#fff',
        stroke: '#EFEFEF',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
        // width: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
      }}
      onClick={() => {
        // console.log('#######98ioklj');
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
        }}
      >状态 {textOverflowEllipsis(stateName, 15)}</Text>
    </Rect>
  </Group>);
}

export type FNode_State_Machine_Event_Values = {
  eventDescription: string;
};

interface FNode_State_Machine_Event_Props {
  value: FNode_State_Machine_Event_Values;
}

function FNode_State_Machine_Event({ value }: FNode_State_Machine_Event_Props) {
  const { eventDescription } = value;
  return (<Group draggable={true}>
    <Rect
      draggable
      style={{
        // fill: '#fff',
        // stroke: '#EFEFEF',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
        // width: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => {
        // console.log('#######98ioklj');
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
        }}
      >{textOverflowEllipsis(eventDescription)}</Text>
    </Rect>
  </Group>);
}

// console.log('##@#$$@#$@#$@#$@#$@#$@#$@######');

function FNode_State_Machine({ cfg = {} }: any) {
  // console.log(cfg, 'FNode_State_Machine cfg 903oipj2klsdfjlskd');

  if (cfg.nodeType === 'state') {
    return (<FNode_State_Machine_State
      value={cfg.value}
    />);
  }

  if (cfg.nodeType === 'stateTerminal') {
    return (<FNode_State_Machine_StateTerminal
      value={cfg.value}
    />);
  }

  if (cfg.nodeType === 'stateNoAuth') {
    return (<FNode_State_Machine_StateNoAuth
      value={cfg.value}
    />);
  }

  if (cfg.nodeType === 'event') {
    return (<FNode_State_Machine_Event
      value={cfg.value}
    />);
  }

  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
}


export const F_STATE_MACHINE_NODE_TYPE: string = 'FNode_State_Machine';

G6.registerNode(F_STATE_MACHINE_NODE_TYPE, createNodeFromReact(FNode_State_Machine));

// console.log(G6, 'G60932ioldskfjsdlkfjl');
