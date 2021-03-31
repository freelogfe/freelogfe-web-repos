import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6';
import {GraphData} from "@antv/g6/lib/types";
import {FApiServer} from "@/services";

G6.registerNode('authorization-resource', {
  jsx: (cfg) => `
  <group>
    <rect style={{
        width: 'fit-content',
        height: 64,
        fill: '#fff',
        stroke: '#EFEFEF',
        radius: 10,
      }}>
      <text style={{fontSize: 14, fontWeight: 600, fill: '#222', marginTop: 14, marginLeft: 10}}>${cfg.resourceName}&nbsp;</text>
      <text style={{fontSize: 12, fontWeight: 400, fill: '#666', marginTop: 16, marginLeft: 10}}>${cfg.resourceType}｜${cfg.version}&nbsp;</text>
    </rect>
  </group>
`,
});

G6.registerNode('authorization-contract', {
  jsx: (cfg) => {

    const contracts = [...(cfg as any).contracts].sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()).sort((a, b) => {
      if (a.isAuth && !b.isAuth) {
        return -1;
      }
      if (!a.isAuth && b.isAuth) {
        return 1;
      }
      return 0;
    });

    const contract = contracts[0];

    return `
  <group>
  ${(cfg as any).contracts.length > 1 ? `
  <rect style={{
      width: 200,
      height: 64,
      fill: '#F1F1F1',
      stroke: '#D1D1D1',
      radius: 10,
      marginLeft: 10,
    }}/>
  ` : ''}

    <rect style={{
      width: 200,
      height: 64,
      fill: ${contract.isAuth ? '#E5F6EF' : '#FBF5EA'},
      stroke: ${contract.isAuth ? '#8FD6B8' : '#E5C78A'},
      radius: 10,
      marginTop: 10,
    }}>
      <text style={{fontSize: 14, fill: '#222', marginTop: 10, marginLeft: 10}}>${contract.contractName}&nbsp;</text>
      <text style={{fontSize: 12, fill: ${contract.isAuth ? '#42C28C' : '#E9A923'}, marginTop: 18, marginLeft: 10}}>${contract.isAuth ? '执行中' : '待执行'}&nbsp;</text>
    </rect>
  </group>
`;
  },
});

// G6.registerNode('authorization-contract', {
//   jsx: (cfg) => {
//
//     const contracts = [...(cfg as any).contracts].sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()).sort((a, b) => {
//       if (a.isAuth && !b.isAuth) {
//         return -1;
//       }
//       if (!a.isAuth && b.isAuth) {
//         return 1;
//       }
//       return 0;
//     });
//
//     // const contract = contracts[0];
//
//     return `
//   <group style={{backgroundColor: 'red'}}>
//
//   ${contracts.map((contract) => {
//       return `
//     <rect style={{
//       width: 200,
//       height: 64,
//       fill: ${contract.isAuth ? '#E5F6EF' : '#FBF5EA'},
//       stroke: ${contract.isAuth ? '#8FD6B8' : '#E5C78A'},
//       radius: 10,
//       marginTop: 10,
//     }}>
//       <text style={{fontSize: 14, fill: '#222', marginTop: 10, marginLeft: 10}}>${contract.contractName}&nbsp;</text>
//       <text style={{fontSize: 12, fill: ${contract.isAuth ? '#42C28C' : '#E9A923'}, marginTop: 18, marginLeft: 10}}>${contract.isAuth ? '执行中' : '待执行'}&nbsp;</text>
//     </rect>
//     `
//     })}
//
//   </group>
// `;
//   },
// });

interface FAntvG6AuthorizationGraphProps extends GraphData {
  nodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  } | {
    id: string;
    contracts: {
      contractId: string;
      contractName: string;
      isAuth: boolean;
      updateDate: string;
    }[];
  }>;
  edges: {
    source: string;
    target: string;
  }[];
  width?: number;
  height?: number;
}

let graph: any = null;

function FAntvG6AuthorizationGraph({nodes, edges, width = 920, height = 500}: FAntvG6AuthorizationGraphProps) {
  const ref = React.useRef(null);

  React.useEffect(() => {

    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || '',
        width: width,
        height: height,
        fitView: true,
        // fitViewPadding: [20, 40, 50, 20],
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        layout: {
          // type: 'mindmap',
          // type: 'compactBox',
          type: 'dagre',
          rankdir: 'LR', // 可选，默认为图的中心
          // nodesep: 20,
          // ranksep: 100,
          // align: 'DL', // 可选
          preventOverlap: true,
          controlPoints: true,
          workerEnabled: true,
          nodesep: 20,
          ranksep: 100,
          // direction: 'H',
          // getHeight: () => {
          //   return 64;
          // },
          // getWidth: () => {
          //   return 200;
          // },
          // getVGap: () => {
          //   return 10;
          // },
          // getHGap: () => {
          //   return 100;
          // },
          // getSide: () => {
          //   return 'right';
          // },
        },
        defaultNode: {
          type: 'authorization-contract',
          // width: 150,
          // height: 64,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          // labelCfg: {
          //   style: {
          //     // fill: '#000000A6',
          //     // fontSize: 10,
          //   },
          // },
          style: {
            // stroke: '#72CC4A',
            // width: 150,
            // height: 64,
          },
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#979797',
          },
          sourceAnchor: 1,
          targetAnchor: 0,
        },
        // renderer: 'svg',
      });

      graph.read({
        nodes: nodes.map((n) => {
          return {
            ...n,
            type: (n as any).resourceId ? 'authorization-resource' : 'authorization-contract',
          };
        }),
        edges,
      });
    } else {
      graph.changeData({
        nodes: nodes.map((n) => {
          return {
            ...n,
            type: (n as any).resourceId ? 'authorization-resource' : 'authorization-contract',
          };
        }),
        edges,
      });
    }


    return () => {
      graph.destroy();
      graph = null;
    };

  }, [nodes, edges]);

  return (<div
    style={{
      width: width,
      height: height
    }}
    ref={ref}
  />);
}

export default FAntvG6AuthorizationGraph;

type AuthorizationTree = {
  contracts: {
    contractId: string;
  }[];
  resourceId: string;
  resourceName: string;
  resourceType: string;
  version: string;
  versionId: string;
  children: AuthorizationTree;
}[][];

interface ResourceNode {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  version: string;
}

interface ExhibitNode {
  id: string;
  nodeId: number;
  nodeName: string;
  exhibitId: string;
  exhibitName: string;
}

interface ContractNode {
  id: string;
  contracts: {
    contractId: string;
    contractName: string;
    isAuth: boolean;
    updateDate: string;
  }[];
}

interface AuthorizationGraphData {
  nodes: Array<ResourceNode | ExhibitNode | ContractNode>;
  edges: {
    source: string;
    target: string;
  }[];
}

export async function handleAuthorizationGraphData(data: AuthorizationTree, root: {
  resourceId: string;
  resourceName: string;
  resourceType: string
  version: string;
  versionId: string;
}): Promise<AuthorizationGraphData> {

  const contractNodes: {
    id: string;
    contractIds: string[];
  }[] = [];

  const resourceNodes: ResourceNode[] = [{
    id: root.versionId,
    resourceId: root.resourceId,
    resourceName: root.resourceName,
    resourceType: root.resourceType,
    version: root.version,
  }];

  const edges: AuthorizationGraphData['edges'] = [];
  traversal(data, root.versionId);

  const contractIds = contractNodes.map<string[]>((c) => c.contractIds).flat(1).join(',');

  let data3: any[] = [];
  if (contractIds) {
    const {data} = await FApiServer.Contract.batchContracts({
      contractIds: contractIds,
    });
    data3 = data;
  }

  const nodes: AuthorizationGraphData['nodes'] = [
    ...resourceNodes,
    ...contractNodes.map<ContractNode>((cn, index, array) => {
      return {
        id: cn.id,
        contracts: cn.contractIds.map((id) => {
          return data3.find((a: any) => a.contractId === id);
        }),
      };
    }),
  ];

  return {
    nodes,
    edges,
  };

  function traversal(authorizationTree: AuthorizationTree, parentID: string = '') {

    for (const auths of authorizationTree) {
      const id1: string = `${parentID}_${auths[0].resourceId}`;
      const contracts = auths[0].contracts;
      contractNodes.push({
        id: id1,
        contractIds: contracts.map<string>((c) => c.contractId),
      });
      edges.push({
        source: parentID,
        target: id1,
      });
      for (const auth of auths) {
        const id2: string = `${id1}_${auth.versionId}`;
        resourceNodes.push({
          id: id2,
          resourceId: auth.resourceId,
          resourceName: auth.resourceName,
          resourceType: auth.resourceType,
          version: auth.version,
        });
        edges.push({
          source: id1,
          target: id2,
        });
        traversal(auth.children, id2);
      }
    }
  }
}
