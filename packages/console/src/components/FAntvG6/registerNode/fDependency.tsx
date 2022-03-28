import { createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';
import React from 'react';

export interface FNode_Dependency_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string;
  version: string;
  resourceDetails_Url: string;
}

const FNode_Dependency_Resource = ({ value }: { value: FNode_Dependency_Resource_Values }) => {
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
      }}>{resourceType} | {version}</Text>
    </Rect>
  </Group>);
};

const FNode_Dependency = ({ cfg = {} }: { cfg: any }) => {
  // console.log(cfg, 'cfg@@#09soidjlfsdfjsdlkfjsdlkfjl');
  if (cfg.nodeType === 'resource') {
    return (<FNode_Dependency_Resource
      value={cfg.value}
    />);
  }

  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
};

export const F_DEPENDENCY_NODE_TYPE: string = 'FNode_Dependency';

G6.registerNode(F_DEPENDENCY_NODE_TYPE, createNodeFromReact(FNode_Dependency));

