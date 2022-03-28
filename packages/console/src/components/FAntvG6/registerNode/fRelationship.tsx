import { createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import img from '@/assets/warning.svg';
import G6 from '@antv/g6';
import React from 'react';
import any = jasmine.any;

export interface FNode_Relationship_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string;
  version: string;
  isAuth: boolean;
  resourceDetails_Url: string;
}

interface FNode_Relationship_Resource_Props {
  value: FNode_Relationship_Resource_Values;
}

function FNode_Relationship_Resource({ value }: FNode_Relationship_Resource_Props) {

  const {
    resourceID,
    resourceName,
    resourceType,
    version,
    isAuth,
    resourceDetails_Url,
  } = value;
  return (<Group>
    <Rect
      draggable
      style={{
        // width: 200,
        // height: 90,
        fill: '#fff',
        stroke: '#EFEFEF',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
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
          cursor: 'pointer',
        }}
        onClick={() => {
          // console.log('#####2342394ui3jk');
          window.open(resourceDetails_Url);
        }}
      >{textOverflowEllipsis(resourceName, 18)}</Text>
      <Rect style={{ height: 10 }} />
      <Text style={{
        fontSize: 12,
        fontWeight: 400,
        fill: '#666',
        padding: [3, 0],
      }}>{resourceType} | {version}</Text>
      {/*<Text style={{fontSize: 14, fill: '#E9A923', marginTop: 24, marginLeft: 10}}>${cfg.pending ? '未授权' : ''}${cfg.pending && cfg.exception ? ' ' : ''}${cfg.exception ? '授权异常' : ''}</Text>*/}
      <Rect style={{ height: 15 }} />
      <Rect style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
        {
          !isAuth && (<Image style={{ width: 16, height: 16, img: img, next: 'inline' }} />)
        }

        <Text
          style={{
            fill: '#2E88FF',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => {
            // console.log('#####2342394ui3jk');
          }}
        >查看合约</Text>
      </Rect>
    </Rect>
  </Group>);
}

function FNode_Relationship({ cfg = {} }: any) {
  if (cfg.nodeType === 'resource') {
    return (<FNode_Relationship_Resource
      value={cfg.value}
    />);
  }

  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
}

export const F_RELATIONSHIP_NODE_TYPE: string = 'FNode_Relationship';

G6.registerNode(F_RELATIONSHIP_NODE_TYPE, createNodeFromReact(FNode_Relationship));
