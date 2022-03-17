import React from 'react';
import { Circle, createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import G6 from '@antv/g6';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import img from '@/assets/warning.svg';

export interface FNode_Relationship_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string;
  version: string;
  url: string;
  isAuth: boolean;
}

const FNode_Relationship_Resource = ({ cfg = {} }) => {
  // console.log(img, 'img@#WEf09sdofjsdlkjljlkj');
  // console.log(cfg, 'cfg#######0900938024038409238');
  // const { description, meta = {}, label = 'label' } = cfg as any;
  const {
    resourceID,
    resourceName,
    resourceType,
    version,
    url,
    isAuth,
  } = (cfg as any).value as FNode_Relationship_Resource_Values;
  return (<Group>
    <Rect
      draggable
      style={{
        // width: 200,
        height: 90,
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
      <Text style={{
        fontSize: 14,
        fontWeight: 600,
        fill: '#222',
        padding: [3, 0],
      }}>{textOverflowEllipsis(resourceName)}</Text>
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
          // onClick={() => {
          //   console.log(url, '###@#34342342343#####');
          //   window.open(url);
          // }}
          onClick={(evt, node, shape, graph) => {
            // graph.updateItem(node, {
            //   collapsed: !collapsed,
            // });
            console.log(evt, node, shape, graph, 'evt, node, shape, graph2389iolkjfds');
          }}
        >查看</Text>
      </Rect>
    </Rect>
  </Group>);
};

G6.registerNode('FNode_Relationship_Resource', createNodeFromReact(FNode_Relationship_Resource));
