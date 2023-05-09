import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fAuthorization';
import {
  F_AUTHORIZATION_NODE_TYPE,
  FNode_Authorization_Contract_Values, FNode_Authorization_Exhibit_Values,
  FNode_Authorization_Resource_Values,
} from '../registerNode/fAuthorization';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
import FResultTip from '@/components/FResultTip';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
// import FErrorBoundary from '@/components/FErrorBoundary';
// import { presentableDetails } from '@freelog/tools-lib/dist/service-API/presentables';
import FRelationDrawer from '@/components/FAntvG6/FRelationDrawer';

type ServerDataNodes = {
  resourceId: string;
  resourceName: string;
  resourceType: string[];
  version: string;
  contracts: {
    contractId: string;
    policyId: string;
  }[];
  children: ServerDataNodes;
}[][];

type ServerDataContracts = {
  contractId: string;
  contractName: string;
  status: 0 | 1 | 2;
  authStatus: 1 | 2 | 3 | 128;
}[];

interface FGraph_Tree_Authorization_Exhibit_Props {
  exhibitID: string;
  version?: string;
  width: number;
  height: number;

  fit?: boolean;

  onMount?({ hasData }: { hasData: boolean }): void;
}

interface ExhibitNode {
  id: string;
  nodeType: 'exhibit';
  value: FNode_Authorization_Exhibit_Values;
  children: ContractNode[];
}

interface ResourceNode {
  id: string;
  nodeType: 'resource';
  value: FNode_Authorization_Resource_Values;
  children: ContractNode[];
}

interface ContractNode {
  id: string;
  nodeType: 'contract';
  value: FNode_Authorization_Contract_Values;
  children: ResourceNode[];
}

interface FGraph_Tree_Authorization_Exhibit_States {
  dataSource: ExhibitNode | null;
  contractID: string;
  bothSidesInfo: {
    licensor: {
      licensorID: string;
      licensorIdentityType: 'resource';
    };
    licensee: {
      licenseeID: string;
      licenseeIdentityType: 'resource' | 'exhibit';
    };
  } | null;
}

const initStates: FGraph_Tree_Authorization_Exhibit_States = {
  dataSource: null,
  contractID: '',
  bothSidesInfo: null,
};

function FGraph_Tree_Authorization_Exhibit({
                                             width,
                                             height,
                                             exhibitID,
                                             version = '',
                                             fit,
                                             onMount,
                                           }: FGraph_Tree_Authorization_Exhibit_Props) {
  const [dataSource, set_DataSource] = React.useState<FGraph_Tree_Authorization_Exhibit_States['dataSource']>(initStates['dataSource']);
  const [contractID, set_ContractID] = React.useState<FGraph_Tree_Authorization_Exhibit_States['contractID']>(initStates['contractID']);
  const [bothSidesInfo, set_BothSidesInfo] = React.useState<FGraph_Tree_Authorization_Exhibit_States['bothSidesInfo']>(initStates['bothSidesInfo']);

  React.useEffect(() => {
    handleData();
  }, [exhibitID, version]);

  async function handleData() {
    // console.log(resourceID, version, 'resourceID, version VVVSSSRRR0923oijsdlfk');
    // set_DataSource(null);

    if (!exhibitID) {
      return;
    }

    const parmas1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
      presentableId: exhibitID,
      projection: 'presentableId,presentableName,nodeId',
    };

    const { data: data_ExhibitDetails }: {
      data: {
        nodeId: number;
        presentableId: string;
        presentableName: string;
      };
    } = await FServiceAPI.Exhibit.presentableDetails(parmas1);

    const parmas2: Parameters<typeof FServiceAPI.Node.details>[0] = {
      nodeId: data_ExhibitDetails.nodeId,
      // projection: 'presentableId,presentableName,nodeId',
    };

    const { data: data_NodeDetails }: {
      data: {
        nodeId: number;
        nodeName: string;
      };
    } = await FServiceAPI.Node.details(parmas2);
    // console.log(version, 'version@#$23409io');
    const params2: Parameters<typeof FServiceAPI.Exhibit.authTree>[0] = {
      presentableId: exhibitID,
      version: version || undefined,
    };

    const { data: data_AuthorizationTree }: { data: ServerDataNodes } = await FServiceAPI.Exhibit.authTree(params2);
    // console.log(data_AuthorizationTree, 'data_AuthorizationTree093oiwjsdkfsdlfkjsdlfkj');
    // console.log(data_AuthorizationTree, 'data_AuthorizationTree@#@#42342342343');
    // console.log('handleDataSource handleDataSource handleDataSource');
    const allContractIDs: string[] = getAllContractIDs({ data: data_AuthorizationTree });
    let data_AllContracts: ServerDataContracts = [];
    if (allContractIDs.length > 0) {
      const params3: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
        contractIds: allContractIDs.join(','),
        projection: 'authStatus,contractId,contractName,status',
      };

      const { data }: { data: ServerDataContracts } = await FServiceAPI.Contract.batchContracts(params3);
      data_AllContracts = data;
    }

    const partyResult = handleDataSource({ data: data_AuthorizationTree, data_Contracts: data_AllContracts });

    const finalDataSource: FGraph_Tree_Authorization_Exhibit_States['dataSource'] = {
      id: data_ExhibitDetails.presentableId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'exhibit',
      // type: 'FNode_Authorization_Resource',
      value: {
        exhibitID: data_ExhibitDetails.presentableId,
        exhibitName: data_ExhibitDetails.presentableName,
        nodeID: data_NodeDetails.nodeId,
        nodeName: data_NodeDetails.nodeName,
      },
      children: partyResult,
      // children: [],
    };
    // console.log(finalDataSource, 'finalDataSource@#$90iolskdflsdjkl');
    onMount && onMount({ hasData: finalDataSource.children.length > 0 });
    set_DataSource(finalDataSource);
  }

  const Gra = React.useMemo(() => {
    return (<DecompositionTreeGraph
      fitCenter={!fit}
      autoFit={fit}
      style={{ backgroundColor: 'transparent' }}
      width={width}
      height={height}
      data={dataSource as any}
      nodeCfg={{
        type: F_AUTHORIZATION_NODE_TYPE,
      }}
      layout={{
        getHeight: (node: any) => {
          // console.log(node, 'DSFd09opfijlkNNNNNNOOODDEEEE98io');
          // return node.value.type === 'contract' ? (node.value.length || 1) * 64 : 64;
          // console.log(node.type, 'node.type####980ios');
          if (node.nodeType === 'resource') {
            return 64;
          }
          if (node.nodeType === 'exhibit') {
            return 110;
          }
          if (node.nodeType === 'contract') {
            return (node.value.length || 1) * 64;
          }
          return 64;
        },
        getWidth: () => {
          return 200;
        },
      }}
      behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
      onReady={(graph) => {
        appendAutoShapeListener(graph as Graph);
        graph.on('contract:view', ({ contractID }: any) => {
          // console.log(params, 'params23908isdflk');
          // console.log(contractID, 'contractID@#@##$@#$@#');
          set_ContractID(contractID);
        });

        graph.on('contract:resource2Node', (params: any) => {
          console.log(params, 'contract:resource2Node 3290wisokpdef');
          // console.log(contractID, 'contractID@#@##$@#$@#');
          // set_ContractID();
          set_BothSidesInfo({
            licensor: {
              licensorID: params.licensor.resourceID,
              licensorIdentityType: 'resource',
            },
            licensee: {
              licenseeID: params.licensee.exhibitID,
              licenseeIdentityType: 'exhibit',
            },
          });
        });
      }}
    />);
  }, [dataSource]);

  return (<>
    {
      !dataSource
        ? (<FLoadingTip height={height} />)
        : dataSource.children.length === 0
          ? (<div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
            <FResultTip h1={'无授权树'} />
          </div>)
          : Gra
    }

    <FContractDetailsDrawer
      contractID={contractID}
      onClose={() => {
        set_ContractID('');
      }}
      onChange_SomeContract={() => {
        handleData();
      }}
    />

    <FRelationDrawer
      bothSidesInfo={bothSidesInfo}
      onClose={() => {
        set_BothSidesInfo(null);
      }}
      onChange_Authorization={() => {
        handleData();
        set_BothSidesInfo(null);
      }}
    />
  </>);
}

export default FGraph_Tree_Authorization_Exhibit;

interface HandleDataSourceParams {
  data: ServerDataNodes;
  data_Contracts: ServerDataContracts;
}

type HandleDataSourceReturn = ContractNode[];

function handleDataSource({ data, data_Contracts }: HandleDataSourceParams): HandleDataSourceReturn {
  // console.log(data, 'data09ioqwj;lfksdjflk');
  return (data || []).map((d) => {

    return {
      id: FUtil.Tool.generateRandomCode(20),
      nodeType: 'contract',
      value: d[0].contracts.map((contract) => {
        const contractMap = data_Contracts.find((dc) => {
          return contract.contractId === dc.contractId;
        });
        return {
          contractID: contract.contractId,
          contractName: contractMap?.contractName || '',
          contractStatus: contractMap ? transformServerAPIContractState({
            status: contractMap.status,
            authStatus: contractMap.authStatus,
          }) : 'terminal',
        };
      }),
      children: d.map((d1) => {
        return {
          id: d1.resourceId + '-' + FUtil.Tool.generateRandomCode(),
          nodeType: 'resource',
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
      for (const c of s[0].contracts) {
        allContractIDs.push(c.contractId);
      }
      recursive(s[0].children);
    }
  }
}


interface TransformServerAPIContractStateParams {
  status: 0 | 1 | 2; // 合同综合状态: 0:正常 1:已终止(不接受任何事件,也不给授权,事实上无效的合约) 2:异常
  authStatus: 1 | 2 | 128 | number; // 合同授权状态 1:正式授权 2:测试授权 128:未获得授权
}

function transformServerAPIContractState({
                                           status,
                                           authStatus,
                                         }: TransformServerAPIContractStateParams): 'active' | 'testActive' | 'inactive' | 'terminal' | 'exception' {
  if (status === 0) {
    if (authStatus === 1 || authStatus === 3) {
      return 'active';
    }
    if (authStatus === 2) {
      return 'testActive';
    }
    if (authStatus === 128) {
      return 'inactive';
    }
  }

  if (status === 1) {
    return 'terminal';
  }
  return 'exception';
}
