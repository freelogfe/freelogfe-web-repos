import { createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import img from '@/assets/warning.svg';
import G6 from '@antv/g6';
import React from 'react';

export interface FNode_Authorization_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string;
  version: string;
  url: string;
  isAuth: boolean;
}

const FNode_Authorization_Resource = ({ cfg = {} }) => {

  const {
    resourceID,
    resourceName,
    resourceType,
    version,
    url,
    isAuth,
  } = (cfg as any).value as FNode_Authorization_Resource_Values;
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
    console.log('#######98ioklj');
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
    console.log('#####2342394ui3jk');
  }}
>{textOverflowEllipsis(resourceName)}</Text>
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
    console.log('#####2342394ui3jk');
  }}
>查看合约</Text>
  </Rect>
  </Rect>
  </Group>);
};

G6.registerNode('FNode_Authorization_Resource', createNodeFromReact(FNode_Authorization_Resource));
