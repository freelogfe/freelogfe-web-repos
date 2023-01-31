import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fAuthorization';
import {
  F_AUTHORIZATION_NODE_TYPE,
  FNode_Authorization_Contract_Values,
  FNode_Authorization_Resource_Values,
} from '../registerNode/fAuthorization';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
import FResultTip from '@/components/FResultTip';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import FRelationDrawer from '@/components/FAntvG6/FRelationDrawer';
// import FErrorBoundary from '@/components/FErrorBoundary';

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

interface FGraph_Tree_Authorization_Resource_Props {
  resourceID: string;
  version: string;
  width: number;
  height: number;
  fit?: boolean;

  onMount?({ hasData }: { hasData: boolean }): void;
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

interface FGraph_Tree_Authorization_Resource_States {
  dataSource: ResourceNode | null;
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

const initStates: FGraph_Tree_Authorization_Resource_States = {
  dataSource: null,
  contractID: '',
  bothSidesInfo: null,
};

function FGraph_Tree_Authorization_Resource({
                                              width,
                                              height,
                                              resourceID,
                                              version,
                                              fit = false,
                                              onMount,
                                            }: FGraph_Tree_Authorization_Resource_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Tree_Authorization_Resource_States['dataSource']>(initStates['dataSource']);
  const [contractID, set_ContractID] = React.useState<FGraph_Tree_Authorization_Resource_States['contractID']>(initStates['contractID']);
  const [bothSidesInfo, set_BothSidesInfo] = React.useState<FGraph_Tree_Authorization_Resource_States['bothSidesInfo']>(initStates['bothSidesInfo']);

  React.useEffect(() => {
    handleData();
  }, [resourceID, version]);

  async function handleData() {
    // console.log(resourceID, version, 'resourceID, version VVVSSSRRR0923oijsdlfk');
    // set_DataSource(null);

    if (!resourceID || !version) {
      return;
    }

    const parmas1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: resourceID,
      projection: 'resourceId,resourceName,resourceType',
    };

    const { data: data_ResourceDetails }: {
      data: {
        resourceId: string;
        resourceName: string;
        resourceType: string[];
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
        projection: 'authStatus,contractId,contractName,status',
      };

      const { data }: { data: ServerDataContracts } = await FServiceAPI.Contract.batchContracts(params3);
      data_AllContracts = data;
    }

    const partyResult = handleDataSource({ data: data_AuthorizationTree, data_Contracts: data_AllContracts });

    const finalDataSource: FGraph_Tree_Authorization_Resource_States['dataSource'] = {
      id: resourceID + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'resource',
      // type: 'FNode_Authorization_Resource',
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
    // console.log(finalDataSource, 'finalDataSource93sdlkfjsdlfkj');
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
        // @ts-ignore
        getHeight: (node: any): number => {
          // console.log(node, 'DSFd09opfijlkNNNNNNOOODDEEEE98io');
          return node.nodeType === 'contract' ? (node.value.length || 1) * 64 : 64;
        },
        getWidth: () => {
          return 200;
        },
      }}
      behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
      onReady={(graph) => {
        appendAutoShapeListener(graph as Graph);
        graph.on('contract:view', (params: any) => {
          // console.log(params, 'params23908isdflk');
          // console.log(contractID, 'contractID@#@##$@#$@#');
          set_ContractID(params.contractID);
        });

        graph.on('contract:resource2Resource', (params: any) => {
          // console.log(params, 'contract:bothSides 3290wisokpdef');
          // console.log(contractID, 'contractID@#@##$@#$@#');
          // set_ContractID(params);
          set_BothSidesInfo({
            licensor: {
              licensorID: params.licensor.resourceID,
              licensorIdentityType: 'resource',
            },
            licensee: {
              licenseeID: params.licensee.resourceID,
              licenseeIdentityType: 'resource',
            },
          });
        });
      }}
    />);
  }, [dataSource]);

  return (<>

    {!dataSource && (<FLoadingTip height={height} />)}

    {
      dataSource && dataSource.children.length === 0 && (<div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
        <FResultTip h1={'无授权树'} />
      </div>)
    }

    {
      dataSource && dataSource.children.length > 0 && (<>
        {Gra}
      </>)
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
      }}
    />

  </>);
}

export default FGraph_Tree_Authorization_Resource;

interface HandleDataSourceParams {
  data: ServerDataNodes;
  data_Contracts: ServerDataContracts;
}

type HandleDataSourceReturn = ContractNode[];

function handleDataSource({ data, data_Contracts }: HandleDataSourceParams): HandleDataSourceReturn {
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
