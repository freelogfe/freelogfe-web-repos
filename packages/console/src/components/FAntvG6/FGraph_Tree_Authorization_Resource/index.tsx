import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fAuthorization';
import {
  FNode_Authorization_Contract_Values,
  FNode_Authorization_Resource_Values,
} from '../registerNode/fAuthorization';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
// import { appenAutoShapeListener } from '@antv/g6-react-node';

type ServerDataNodes = {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  version: string;
  contracts: {
    contractId: string;
    policyId: string;
  }[];
  children: ServerDataNodes;
}[][];

type ServerDataContracts = {
  authStatus: 1 | 2 | 128 | number;
  contractId: string;
  contractName: string;
}[];

interface FGraph_Tree_Authorization_Resource_Props {
  resourceID: string;
  version: string;
  width: number;
  height: number;
}

interface ResourceNode {
  id: string;
  type: 'FNode_Authorization_Resource';
  value: FNode_Authorization_Resource_Values;
  children: ContractNode[];
}

interface ContractNode {
  id: string;
  type: 'FNode_Authorization_Contract'
  value: FNode_Authorization_Contract_Values;
  children: ResourceNode[];
}

interface FGraph_Tree_Authorization_Resource_States {
  dataSource: ResourceNode | null;
}

const initStates: FGraph_Tree_Authorization_Resource_States = {
  dataSource: null,
};

function FGraph_Tree_Authorization_Resource({
                                              width,
                                              height,
                                              resourceID,
                                              version,
                                            }: FGraph_Tree_Authorization_Resource_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Tree_Authorization_Resource_States['dataSource']>(initStates['dataSource']);

  React.useEffect(() => {
    handleData();
  }, [resourceID, version]);

  async function handleData() {
    // console.log(resourceID, version, 'resourceID, version VVVSSSRRR0923oijsdlfk');
    set_DataSource(null);
    const parmas1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: resourceID,
      projection: 'resourceId,resourceName,resourceType',
    };

    const { data: data_ResourceDetails }: {
      data: {
        resourceId: string;
        resourceName: string;
        resourceType: string;
      };
    } = await FServiceAPI.Resource.info(parmas1);

    const params2: Parameters<typeof FServiceAPI.Resource.authTree>[0] = {
      resourceId: resourceID,
      version: version,
    };

    const { data: data_AuthorizationTree }: { data: ServerDataNodes } = await FServiceAPI.Resource.authTree(params2);
    // console.log(data_AuthorizationTree, 'data_AuthorizationTree@#@#42342342343');
    // console.log('handleDataSource handleDataSource handleDataSource');
    const allContractIDs: string[] = getAllContractIDs({ data: data_AuthorizationTree });
    let data_AllContracts: ServerDataContracts = [];
    if (allContractIDs.length > 0) {
      const params3: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
        contractIds: allContractIDs.join(','),
        projection: 'authStatus,contractId,contractName',
      };

      const { data }: { data: ServerDataContracts } = await FServiceAPI.Contract.batchContracts(params3);
      data_AllContracts = data;
    }

    const partyResult = handleDataSource({ data: data_AuthorizationTree, data_Contracts: data_AllContracts });

    const finalDataSource: FGraph_Tree_Authorization_Resource_States['dataSource'] = {
      id: resourceID,
      type: 'FNode_Authorization_Resource',
      value: {
        resourceID: data_ResourceDetails.resourceId,
        resourceName: data_ResourceDetails.resourceName,
        resourceType: data_ResourceDetails.resourceType,
        version: version,
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({
          resourceID: data_ResourceDetails.resourceId,
          // version: d.version,
        }),
      },
      children: partyResult,
      // children: [],
    };

    // console.log(data_ResourceDetails, 'data_ResourceDetails@#$@#$@#$09');
    // console.log(partyResult, 'partyResult@#$@#$@#4209900o');
    // console.log(finalDataSource, 'finalDataSource333838383838888888888*****');
    set_DataSource(finalDataSource);
  }

  if (!dataSource) {
    return (<FLoadingTip height={height} />);
  }

  return (<DecompositionTreeGraph
    width={width}
    height={height}
    data={dataSource as any}
    // fitCenter={false}
    // autoFit={false}
    nodeCfg={
      {
        style: {},
        nodeStateStyles: {},
      }
    }
    layout={{
      // type: 'dagre',
      // rankdir: 'LR',
      // type: 'indented',
      direction: 'LR',
      dropCap: false,
      // indent: 500,
      getHeight: () => {
        return 64;
      },
      // fitViewPadding: [200, 200],
      getWidth: () => {
        return 200;
      },
    }}
    // markerCfg={(cfg) => {
    //   const { children } = cfg as any;
    //   return {
    //     show: children?.length,
    //   };
    // }}
    behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
    onReady={(graph) => {
      // console.log(graph, 'GGGRRRRAAAFFFFFF');
      graph.moveTo(20, 20, true);
      appendAutoShapeListener(graph as Graph);
    }}
  />);
}

export default FGraph_Tree_Authorization_Resource;

interface HandleDataSourceParams {
  data: ServerDataNodes;
  data_Contracts: ServerDataContracts;
}

type HandleDataSourceReturn = ContractNode[];

function handleDataSource({ data, data_Contracts }: HandleDataSourceParams): HandleDataSourceReturn {
  return (data || []).map((d) => {
    const firstContract = data_Contracts.find((dc) => {
      return d[0].contracts[0].contractId === dc.contractId;
    });

    return {
      id: firstContract?.contractId + '-' + FUtil.Tool.generateRandomCode(),
      type: 'FNode_Authorization_Contract',
      value: {
        contractID: firstContract?.contractId || '',
        contractName: firstContract?.contractName || '',
        isAuth: true,
        isMultiple: d.length > 0,
      },
      children: d.map((d1) => {
        return {
          id: d1.resourceId + '-' + FUtil.Tool.generateRandomCode(),
          type: 'FNode_Authorization_Resource',
          value: {
            resourceID: d1.resourceId,
            resourceName: d1.resourceName,
            resourceType: d1.resourceType,
            version: d1.version,
            resourceDetails_Url: FUtil.LinkTo.resourceDetails({
              resourceID: d1.resourceId,
              // version: d.version,
            }),
          },
          children: handleDataSource({
            data: d1.children,
            data_Contracts: data_Contracts,
          }),
        };
      }),
    };
  });
}

interface GetAllContractIDsParams {
  data: ServerDataNodes;
}

function getAllContractIDs({ data = [] }: GetAllContractIDsParams): string[] {
  const allContractIDs: string[] = [];

  recursive(data);

  return allContractIDs;

  function recursive(d: GetAllContractIDsParams['data']) {
    for (const s of d) {
      allContractIDs.push(s[0].contracts[0].contractId);
      recursive(s[0].children);
    }
  }
}

// interface AuthorizationGraphData {
//   nodes: Array<ResourceNode | ContractNode>;
//   // edges: {
//   //   source: string;
//   //   target: string;
//   // }[];
// }
//
// interface ResourceNode1 {
//   id: string;
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
// }
//
// type AuthorizationTree = {
//   contracts: {
//     contractId: string;
//   }[];
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
//   versionId: string;
//   children: AuthorizationTree;
// }[][];
//
// export async function handleAuthorizationGraphData(data: AuthorizationTree, root: ResourceNode1): Promise<AuthorizationGraphData> {
//
//   const contractNodes: {
//     id: string;
//     contractIds: string[];
//   }[] = [];
//
//   const resourceNodes: Array<ResourceNode1> = [{
//     ...root,
//     id: root.versionId,
//   }];
//
//   const edges: AuthorizationGraphData['edges'] = [];
//   // console.log(data, 'datadatadatadata12324');
//   traversal(data, resourceNodes[0].id);
//
//   const contractIds = contractNodes.map<string[]>((c) => c.contractIds).flat(1).join(',');
//
//   let data3: any[] = [];
//   if (contractIds) {
//     const { data: data2 } = await FServiceAPI.Contract.batchContracts({
//       contractIds: contractIds,
//     });
//     data3 = data2;
//   }
//
//   const nodes: AuthorizationGraphData['nodes'] = [
//     ...resourceNodes,
//     ...contractNodes.map<ContractNode>((cn, index, array) => {
//       return {
//         id: cn.id,
//         contracts: cn.contractIds.map((id) => {
//           return data3.find((a: any) => a.contractId === id);
//         }),
//       };
//     }),
//   ];
//
//   return {
//     nodes,
//     // edges,
//   };
//
//   function traversal(authorizationTree: AuthorizationTree, parentID: string = '') {
//
//     for (const auths of authorizationTree) {
//       const id1: string = `${parentID}_${auths[0].resourceId}`;
//       const contracts = auths[0].contracts;
//       contractNodes.push({
//         id: id1,
//         contractIds: contracts.map<string>((c) => c.contractId),
//       });
//       for (const auth of auths) {
//         const id2: string = `${id1}_${auth.versionId}`;
//         resourceNodes.push({
//           id: id2,
//           resourceId: auth.resourceId,
//           resourceName: auth.resourceName,
//           resourceType: auth.resourceType,
//           version: auth.version,
//         });
//         traversal(auth.children, id2);
//       }
//     }
//   }
// }
