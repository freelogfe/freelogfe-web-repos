import { createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';
import React from 'react';
import img_Execute from '@/assets/execute.svg';
import img_Gear from '@/assets/gear.svg';

export interface FNode_Authorization_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string;
  version: string;
  resourceDetails_Url: string;
}

const FNode_Authorization_Resource = ({ cfg = {} }) => {
  // console.log(cfg, 'cfgcfgcfgcfg0932iojsdlkfsjdlklllllllCCCCC');
  const {
    resourceID,
    resourceName,
    resourceType,
    version,
    resourceDetails_Url,
  } = (cfg as any).value as FNode_Authorization_Resource_Values;
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

G6.registerNode('FNode_Authorization_Resource', createNodeFromReact(FNode_Authorization_Resource));

export type FNode_Authorization_Contract_Values = {
  contractID: string;
  contractName: string;
  isAuth: boolean;
}[];

const FNode_Authorization_Contract = ({ cfg = {} }) => {
  // console.log(cfg, 'cfg@#$2309iojsdfls;dkflklklkljFFNode_Authorization_Contract');
  const contracts = (cfg as any).value as FNode_Authorization_Contract_Values;
  return (<Group>

    {
      contracts.map((contract) => {
        return (<Rect
          key={contract.contractID}
          draggable
          style={{
            fill: contract.isAuth ? '#E5F6EF' : '#FBF5EA',
            stroke: contract.isAuth ? '#8FD6B8' : '#E5C78A',
            radius: 10,
            padding: [10, 20],
            cursor: 'move',
          }}
          onClick={() => {
            console.log('#######98ioklj');
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
              console.log('#####2342394ui3jk');
            }}
          >{textOverflowEllipsis(contract.contractName)}</Text>
          <Rect style={{ height: 10 }} />
          {
            contract.isAuth
              ? (<Rect style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    img: img_Gear,
                    next: 'inline',
                  }} />
                <Text style={{
                  fill: '#42C28C',
                  fontSize: 12,
                  fontWeight: 600,
                  margin: [3, 20, 0, 5],
                  next: 'inline',
                }}>已授权</Text>

                <Text
                  style={{
                    fill: '#2E88FF',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    margin: [3, 0, 0],
                  }}
                  onClick={() => {
                    console.log('#####2342394ui3jk查看');
                  }}
                >查看</Text>
              </Rect>)
              : (<Rect style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    img: img_Execute,
                    next: 'inline',
                  }} />
                <Text style={{
                  fill: '#E9A923',
                  fontSize: 12,
                  fontWeight: 600,
                  margin: [3, 20, 0, 5],
                  next: 'inline',
                }}>待执行</Text>

                <Text
                  style={{
                    fill: '#2E88FF',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    margin: [3, 0, 0],
                  }}
                  onClick={() => {
                    console.log('#####2342394ui3jk查看');
                  }}
                >查看</Text>
              </Rect>)
          }
        </Rect>)
      })
    }


  </Group>);
};

G6.registerNode('FNode_Authorization_Contract', createNodeFromReact(FNode_Authorization_Contract));
