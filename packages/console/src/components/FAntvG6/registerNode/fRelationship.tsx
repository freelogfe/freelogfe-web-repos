import { createNodeFromReact, Group, Image, Rect, Text } from '@antv/g6-react-node';
import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
import img_warning from '@/assets/warning.svg';
import img_execute from '@/assets/execute.svg';
import G6 from '@antv/g6';
import React from 'react';
import { FUtil } from '@freelog/tools-lib';

const FGroup: any = Group;
const FRect: any = Rect;
const FText: any = Text;

export interface FNode_Relationship_RootResource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string[];
  version: string;
  resourceDetails_Url: string;
}

interface FNode_Relationship_RootResource_Props {
  value: FNode_Relationship_RootResource_Values;
}

function FNode_Relationship_RootResource({ value }: FNode_Relationship_RootResource_Props) {
  const {
    resourceID,
    resourceName,
    resourceType,
    version,
    resourceDetails_Url,
  } = value;
  return (<FGroup>
    <FRect
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
      <FText
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
      >{textOverflowEllipsis(resourceName)}</FText>
      <FRect style={{ height: 10 }} />
      <FText style={{
        fontSize: 12,
        fontWeight: 400,
        fill: '#666',
        padding: [3, 0],
      }}>{FUtil.Format.resourceTypeKeyArrToResourceType(resourceType)} | {version}</FText>
    </FRect>
  </FGroup>);
}

export interface FNode_Relationship_Resource_Values {
  resourceID: string;
  resourceName: string;
  resourceType: string[];
  version: string;
  show_Warning: boolean;
  show_Execute: boolean;
  resourceDetails_Url: string;
  isUpThrow?: boolean;
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
    show_Warning,
    show_Execute,
    resourceDetails_Url,
    isUpThrow = false,
  } = value;
  return (<FGroup>
    <FRect
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
      <FText
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
      >{textOverflowEllipsis(resourceName, 18)}</FText>
      <FRect style={{ height: 10 }} />
      {
        version
          ? (<FText style={{
            fontSize: 12,
            fontWeight: 400,
            fill: '#666',
            padding: [3, 0],
          }}>{FUtil.Format.resourceTypeKeyArrToResourceType(resourceType)} | {version}</FText>)
          : ((<FText style={{
            fontSize: 12,
            fontWeight: 400,
            fill: '#666',
            padding: [3, 0],
          }}>{FUtil.Format.resourceTypeKeyArrToResourceType(resourceType)}</FText>))
      }

      {/*<Text style={{fontSize: 14, fill: '#E9A923', marginTop: 24, marginLeft: 10}}>${cfg.pending ? '未授权' : ''}${cfg.pending && cfg.exception ? ' ' : ''}${cfg.exception ? '授权异常' : ''}</Text>*/}
      <FRect style={{ height: 15 }} />
      <FRect style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
        {
          (show_Execute || show_Warning) && (<FRect
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            {
              show_Execute && (<Image style={{ width: 16, height: 16, img: img_execute, next: 'inline' }} />)
            }
            {
              show_Execute && show_Warning && (<Rect style={{ width: 5 }} />)
            }
            {
              show_Warning && (<Image style={{ width: 16, height: 16, img: img_warning, next: 'inline' }} />)
            }
          </FRect>)
        }

        {
          isUpThrow
            ? (<FText
              style={{
                fill: '#EE4040',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={(evt: any, node: any, shape: any, graph: any) => {
                // console.log(evt, '#####2342394ui3jk0988uoij32lk');
                graph.emit('resource:viewContract', {
                  // contractID: contract.contractID,
                  resourceID: resourceID,
                  // parentInfo: parentInfo,
                });
              }}
            >已上抛</FText>)
            : (<FText
              style={{
                fill: '#2E88FF',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={(evt: any, node: any, shape: any, graph: any) => {
                // console.log(evt, '#####2342394ui3jk0988uoij32lk');
                graph.emit('resource:viewContract', {
                  // contractID: contract.contractID,
                  resourceID: resourceID,
                  // parentInfo: parentInfo,
                });
              }}
            >查看合约</FText>)
        }


      </FRect>
    </FRect>
  </FGroup>);
}

export interface FNode_Relationship_Exhibit_Values {
  exhibitID: string;
  exhibitName: string;
  nodeID: number;
  nodeName: string;
}

interface FNode_Relationship_Exhibit_Props {
  value: FNode_Relationship_Exhibit_Values;
}

function FNode_Relationship_Exhibit({ value }: FNode_Relationship_Exhibit_Props) {
  const {
    exhibitID,
    exhibitName,
    nodeID,
    nodeName,
  } = value;
  return (<FGroup>
    <FRect
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
      <FText style={{
        fontSize: 12,
        fontWeight: 600,
        fill: '#7F8388',
        padding: [3, 0],
      }}>节点：</FText>
      <FRect style={{ height: 10 }} />
      <FText
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
          padding: [3, 0],
          cursor: 'pointer',
        }}
      >{textOverflowEllipsis(nodeName)}</FText>
      <FRect style={{ height: 15 }} />
      <FText style={{
        fontSize: 12,
        fontWeight: 600,
        fill: '#7F8388',
        padding: [3, 0],
      }}>展品：</FText>
      <FRect style={{ height: 10 }} />
      <FText
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: '#222',
          padding: [3, 0],
          cursor: 'pointer',
        }}
      >{textOverflowEllipsis(exhibitName)}</FText>
    </FRect>
  </FGroup>);
}

function FNode_Relationship({ cfg = {} }: any) {
  // console.log(cfg, 'cfg#$rwe0 9fuiojlsjd');
  if (cfg.nodeType === 'resource') {
    return (<FNode_Relationship_Resource
      value={cfg.value}
    />);
  }
  if (cfg.nodeType === 'rootResource') {
    return (<FNode_Relationship_RootResource
      value={cfg.value}
    />);
  }
  if (cfg.nodeType === 'exhibit') {
    return (<FNode_Relationship_Exhibit
      value={cfg.value}
    />);
  }

  return (<FGroup><FText style={{ fill: '#222' }}>Error</FText></FGroup>);
}

export const F_RELATIONSHIP_NODE_TYPE: string = 'FNode_Relationship';

G6.registerNode(F_RELATIONSHIP_NODE_TYPE, createNodeFromReact(FNode_Relationship));
