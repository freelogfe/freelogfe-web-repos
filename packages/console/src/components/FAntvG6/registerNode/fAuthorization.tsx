import { createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';
import React from 'react';
import img_Execute from '@/assets/execute.svg';
import img_Gear from '@/assets/gear.svg';
import img_Forbid from '@/assets/forbid.svg';
import img from '@/assets/warning.svg';
import { FUtil } from '@freelog/tools-lib';

export interface FNode_Authorization_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string;
  version: string;
  resourceDetails_Url: string;
}

const FNode_Authorization_Resource = ({ value }: { value: FNode_Authorization_Resource_Values }) => {
  // console.log(cfg, 'cfgcfgcfgcfg0932iojsdlkfsjdlklllllllCCCCC');
  // const {
  //   resourceID,
  //   resourceName,
  //   resourceType,
  //   version,
  //   resourceDetails_Url,
  // } = (cfg as any).value as FNode_Authorization_Resource_Values;
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

// G6.registerNode('FNode_Authorization_Resource', createNodeFromReact(FNode_Authorization_Resource));

export type FNode_Authorization_Contract_Values = {
  contractID: string;
  contractName: string;
  contractStatus: 'active' | 'testActive' | 'inactive' | 'terminal' | 'exception';
}[];

const statusInfo = {
  active: {
    color1: '#8FD6B8',
    color2: '#E5F6EF',
    text: '已授权',
    img: img_Gear,
  },
  testActive: {
    color1: '#8FD6B8',
    color2: '#E5F6EF',
    text: '已授权',
    img: img_Gear,
  },
  inactive: {
    color1: '#E5C78A',
    color2: '#FBF5EA',
    text: '未授权',
    img: img_Execute,
  },
  terminal: {
    color1: '#D5D5D5',
    color2: '#E5E7EB',
    text: '已终止',
    img: img_Forbid,
  },
  exception: {
    color1: '#D5D5D5',
    color2: '#E5E7EB',
    text: '异常',
    img: img_Forbid,
  },
};

const FNode_Authorization_Contract = ({ value }: { value: FNode_Authorization_Contract_Values }) => {
  // console.log(cfg, 'cfg@#$2309iojsdfls;dkflklklkljFFNode_Authorization_Contract');
  // const contracts = (cfg as any).value as FNode_Authorization_Contract_Values;
  const contracts = value;
  // console.log(cfg, 'contracts@##3433333333');

  if (contracts.length === 0) {
    return (<Group draggable={true}>
      <Rect draggable style={{
        // width: 200,
        // height: 64,
        fill: '#E5E7EB',
        stroke: '#D5D5D5',
        radius: 10,
        padding: [10, 20],
        cursor: 'move',
      }}>
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
        >暂无有效合约</Text>
        <Rect style={{ height: 10 }} />
        <Text
          style={{
            fill: '#2E88FF',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            margin: [3, 0, 0],
          }}
          onClick={(evt, node, shape, graph) => {
            // graph.emit('contract:view', {
            //   contractID: contract.contractID,
            // });
            window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.contract());
          }}
        >查看已终止的合约</Text>
      </Rect>
    </Group>);
  }
  return (<Group draggable={true}>

    {
      contracts.map((contract) => {
        return (<Rect
          key={contract.contractID}
          draggable
          style={{
            fill: statusInfo[contract.contractStatus].color2,
            stroke: statusInfo[contract.contractStatus].color1,
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
          >{textOverflowEllipsis(contract.contractName)}</Text>
          <Rect style={{ height: 10 }} />
          <Rect style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
            <Image
              style={{
                width: 16,
                height: 16,
                img: statusInfo[contract.contractStatus].img,
                next: 'inline',
              }}
            />
            <Text style={{
              fill: statusInfo[contract.contractStatus].color1,
              fontSize: 12,
              fontWeight: 600,
              margin: [3, 20, 0, 5],
              next: 'inline',
            }}>{statusInfo[contract.contractStatus].text}</Text>

            <Text
              style={{
                fill: '#2E88FF',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                margin: [3, 0, 0],
              }}
              onClick={(evt, node, shape, graph) => {
                graph.emit('contract:view', {
                  contractID: contract.contractID,
                });
              }}
            >查看</Text>
          </Rect>
        </Rect>);
      })
    }


  </Group>);
};


// G6.registerNode('FNode_Authorization_Contract', createNodeFromReact(FNode_Authorization_Contract));

const FNode_Authorization = ({ cfg = {} }: { cfg: any }) => {
  // console.log(value, 'value@#38s9dio');
  if (cfg.nodeType === 'contract') {
    return (<FNode_Authorization_Contract
      value={cfg.value}
    />);
  }
  if (cfg.nodeType === 'resource') {
    return (<FNode_Authorization_Resource
      value={cfg.value}
    />);
  }
  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
};

export const F_AUTHORIZATION_NODE_TYPE: string = 'FNode_Authorization';

G6.registerNode(F_AUTHORIZATION_NODE_TYPE, createNodeFromReact(FNode_Authorization));
