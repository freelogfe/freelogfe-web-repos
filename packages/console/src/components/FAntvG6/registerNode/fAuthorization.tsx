import { createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import G6 from '@antv/g6';
import React from 'react';
import img_Execute from '@/assets/execute.svg';
import img_Gear from '@/assets/gear.svg';
import img_Forbid from '@/assets/forbid.svg';
// import img from '@/assets/warning.svg';
import { FUtil } from '@freelog/tools-lib';

export interface FNode_Authorization_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string[];
  version: string;
  resourceDetails_Url: string;
}

interface FNode_Authorization_Resource_Props {
  value: FNode_Authorization_Resource_Values;
}

function FNode_Authorization_Resource({ value }: FNode_Authorization_Resource_Props) {
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

export interface FNode_Authorization_Exhibit_Values {
  exhibitID: string;
  exhibitName: string;
  nodeID: number;
  nodeName: string;
}

interface FNode_Authorization_Exhibit_Props {
  value: FNode_Authorization_Exhibit_Values;
}

function FNode_Authorization_Exhibit({ value }: FNode_Authorization_Exhibit_Props) {
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

interface FNode_Authorization_Contract_Props {
  value: FNode_Authorization_Contract_Values;
  showReAuthIfNoAuth?: boolean;
}

function FNode_Authorization_Contract({
                                        value: contracts,
                                        showReAuthIfNoAuth = true,
                                      }: FNode_Authorization_Contract_Props) {
  // console.log(cfg, 'cfg@#$2309iojsdfls;dkflklklkljFFNode_Authorization_Contract');
  // const contracts = value;
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
        {
          showReAuthIfNoAuth && (<Text
            style={{
              fill: '#2E88FF',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              margin: [3, 0, 0],
            }}
            onClick={(evt, node, shape, graph) => {
              const licensee = {
                licenseeID: node?._cfg?.parent._cfg.model?.value?.resourceID,
                licenseeName: node?._cfg?.parent._cfg?.model?.value?.resourceName,
              };
              if (node?._cfg?.parent._cfg.model?.nodeType === 'resource') {
                graph.emit('contract:resource2Resource', {
                  licensor: (node?._cfg?.model?.children as any[])[0].value,
                  licensee: node?._cfg?.parent._cfg.model?.value,
                });
              }

              if (node?._cfg?.parent._cfg.model?.nodeType === 'exhibit') {
                graph.emit('contract:resource2Node', {
                  licensor: (node?._cfg?.model?.children as any[])[0].value,
                  licensee: node?._cfg?.parent._cfg.model?.value,
                });
              }
            }}
          >重新获取授权</Text>)
        }

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
}

function FNode_Authorization({ cfg = {} }: any) {

  if (cfg.nodeType === 'resource') {
    return (<FNode_Authorization_Resource
      value={cfg.value}
    />);
  }
  if (cfg.nodeType === 'exhibit') {
    return (<FNode_Authorization_Exhibit
      value={cfg.value}
    />);
  }
  if (cfg.nodeType === 'contract') {
    // console.log(cfg, 'value@#38s9dio');
    return (<FNode_Authorization_Contract
      value={cfg.value}
      showReAuthIfNoAuth={cfg.depth <= 1}
      // onClick={() => {
      //   console.log('FFFFFFFF09iojsklj');
      // }}
    />);
  }
  return (<Group><Text style={{ fill: '#222' }}>Error</Text></Group>);
}

export const F_AUTHORIZATION_NODE_TYPE: string = 'FNode_Authorization';

G6.registerNode(F_AUTHORIZATION_NODE_TYPE, createNodeFromReact(FNode_Authorization));
