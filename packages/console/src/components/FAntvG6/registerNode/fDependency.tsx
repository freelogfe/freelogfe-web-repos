import * as React from 'react';
import { createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';
import { FUtil } from '@freelog/tools-lib';

export interface FNode_Dependency_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string[];
  version: string;
  resourceDetails_Url: string;
}

interface FNode_Dependency_Resource_Props {
  value: FNode_Dependency_Resource_Values;
}

function FNode_Dependency_Resource({ value }: FNode_Dependency_Resource_Props) {
  const {
    resourceID,
    resourceName,
    resourceType,
    version,
    resourceDetails_Url,
  } = value;
  return (<Group>
    <Rect
      draggable
      style={{
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
      >{textOverflowEllipsis(resourceName)}</Text>
      <Rect style={{ height: 10 }} />
      <Text style={{
        fontSize: 12,
        fontWeight: 400,
        fill: '#666',
        padding: [3, 0],
      }}>{FUtil.Format.resourceTypeKeyArrToResourceType(resourceType)} | {version}</Text>
    </Rect>
  </Group>);
}

export interface FNode_Dependency_Exhibit_Values {
  exhibitID: string;
  exhibitName: string;
  nodeID: number;
  nodeName: string;
}

interface FNode_Dependency_Exhibit_Props {
  value: FNode_Dependency_Exhibit_Values;
}

function FNode_Dependency_Exhibit({ value }: FNode_Dependency_Exhibit_Props) {
  const {
    exhibitID,
    exhibitName,
    nodeID,
    nodeName,
  } = value;
  return (<Group>
    <Rect
      draggable
      style={{
        fill: '#fff',
        stroke: '#EFEFEF',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
      }}
      onClick={() => {

      }}
    >
      <Text style={{
        fontSize: 12,
        fontWeight: 600,
        fill: '#7F8388',
        padding: [3, 0],
      }}>节点：</Text>
      <Rect style={{ height: 10 }} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
          padding: [3, 0],
          cursor: 'pointer',
        }}
      >{textOverflowEllipsis(nodeName)}</Text>
      <Rect style={{ height: 15 }} />
      <Text style={{
        fontSize: 12,
        fontWeight: 600,
        fill: '#7F8388',
        padding: [3, 0],
      }}>展品：</Text>
      <Rect style={{ height: 10 }} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
          padding: [3, 0],
          cursor: 'pointer',
        }}
      >{textOverflowEllipsis(exhibitName)}</Text>
    </Rect>
  </Group>);
}

function FNode_Dependency({ cfg = {} }: any) {
  // console.log(cfg, 'cfg@@#09soidjlfsdfjsdlkfjsdlkfjl');
  if (cfg.nodeType === 'resource') {
    return (<FNode_Dependency_Resource
      value={cfg.value}
    />);
  }

  if (cfg.nodeType === 'exhibit') {
    return (<FNode_Dependency_Exhibit
      value={cfg.value}
    />);
  }

  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
}

export const F_DEPENDENCY_NODE_TYPE: string = 'FNode_Dependency';

G6.registerNode(F_DEPENDENCY_NODE_TYPE, createNodeFromReact(FNode_Dependency));

