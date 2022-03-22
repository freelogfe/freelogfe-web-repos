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
import FResultTip from '@/components/FResultTip';
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

    set_DataSource(finalDataSource);
  }

  if (!dataSource) {
    return (<FLoadingTip height={height} />);
  }

  if (dataSource.children.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
        <FResultTip h1={'无授权树'} />
      </div>);
  }


  return (<DecompositionTreeGraph
    style={{ backgroundColor: 'transparent' }}
    width={width}
    height={height}
    data={dataSource as any}
    // fitCenter={false}
    // autoFit={true}
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
      // direction: 'LR',
      // dropCap: false,
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
      // console.log(graph.getNodes(), 'GGGRRRRAAAFFFFFF');
      // console.log(graph, 'GGGRRRRAAAFFFFFF');
      // graph.moveTo(20, 20, true);
      // console.log(graph.getHeight());
      // graph.zoom(1);
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
    // const firstContract = data_Contracts.find((dc) => {
    //   return d[0].contracts[0].contractId === dc.contractId;
    // });

    return {
      // id: firstContract?.contractId + '-' + FUtil.Tool.generateRandomCode(20),
      id: FUtil.Tool.generateRandomCode(20),
      type: 'FNode_Authorization_Contract',
      // value: {
      //   contractID: firstContract?.contractId || '',
      //   contractName: firstContract?.contractName || '',
      //   isAuth: true,
      //   isMultiple: d.length > 0,
      // },
      value: d[0].contracts.map((contract) => {
        const contractMap = data_Contracts.find((dc) => {
          return contract.contractId === dc.contractId;
        });
        return {
          contractID: contract.contractId,
          contractName: contractMap?.contractName || '',
          isAuth: contractMap?.authStatus === 1 || contractMap?.authStatus === 2,
        };
      }),
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
      for (const c of s[0].contracts) {
        allContractIDs.push(c.contractId);
      }
      recursive(s[0].children);
    }
  }
}
