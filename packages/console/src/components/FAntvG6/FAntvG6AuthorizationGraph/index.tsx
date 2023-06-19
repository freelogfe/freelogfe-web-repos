// import * as React from 'react';
// import styles from './index.less';
// import G6 from '@antv/g6';
// import { GraphData } from '@antv/g6/lib';
// import { FServiceAPI } from '@freelog/tools-lib';
// import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
// import FComponentsLib from '@freelog/components-lib';
//
// interface ResourceNode {
//   id: string;
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
// }
//
// interface ExhibitNode {
//   id: string;
//   nodeId: number;
//   nodeName: string;
//   exhibitId: string;
//   exhibitName: string;
// }
//
// interface ContractNode {
//   id: string;
//   contracts: {
//     contractId: string;
//     contractName: string;
//     isAuth: boolean;
//     updateDate: string;
//   }[];
// }
//
// interface AuthorizationGraphData {
//   nodes: Array<ResourceNode | ExhibitNode | ContractNode>;
//   edges: {
//     source: string;
//     target: string;
//   }[];
// }
//
// G6.registerNode('authorization-resource', {
//   jsx: (cfg: any) => `
//   <group>
//     <rect style={{
//         width: 'fit-content',
//         height: 64,
//         fill: '#fff',
//         stroke: '#EFEFEF',
//         radius: 10,
//       }}>
//       <text style={{fontSize: 14, fontWeight: 600, fill: '#222', marginTop: 14, marginLeft: 10}}>${textOverflowEllipsis(cfg.resourceName)}&nbsp;</text>
//       <text style={{fontSize: 12, fontWeight: 400, fill: '#666', marginTop: 16, marginLeft: 10}}>${cfg.resourceType}｜${cfg.version}&nbsp;</text>
//     </rect>
//   </group>
// `,
// });
//
// G6.registerNode('authorization-exhibit', {
//
//   jsx: (cfg: any) => {
//     return `
//   <group>
//     <rect style={{
//         width: 'fit-content',
//         height: 84,
//         fill: '#fff',
//         stroke: '#EFEFEF',
//         radius: 10,
//       }}>
//         <text style={{fontSize: 12, fontWeight: 400, fill: '#7F8388', marginTop: 4, marginLeft: 10}}>节点：&nbsp;</text>
//         <text style={{fontSize: 14, fontWeight: 600, fill: '#222', marginTop: 8, marginLeft: 10}}>${textOverflowEllipsis(cfg.nodeName)}&nbsp;</text>
//
//         <text style={{fontSize: 12, fontWeight: 400, fill: '#7F8388', marginTop: 10, marginLeft: 10}}>展品：&nbsp;</text>
//         <text style={{fontSize: 14, fontWeight: 600, fill: '#222', marginTop: 14, marginLeft: 10}}>${textOverflowEllipsis(cfg.exhibitName)}&nbsp;</text>
//     </rect>
//   </group>
// `;
//   },
// });
//
// //       <text style={{fontSize: 12, fill: ${contract.isAuth ? '#42C28C' : '#E9A923'}, marginTop: 18, marginLeft: 10}}>${contract.isAuth ? '执行中' : '待执行'}&nbsp;</text>
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
//     const contract = contracts[0];
//
//     return `
//   <group>
//   ${(cfg as any).contracts.length > 1 ? `
//   <rect style={{
//       width: 200,
//       height: 64,
//       fill: '#F1F1F1',
//       stroke: '#D1D1D1',
//       radius: 10,
//       marginLeft: 10,
//     }}/>
//   ` : ''}
//
//     <rect style={{
//       width: 200,
//       height: 64,
//       fill: ${contract.isAuth ? '#E5F6EF' : '#FBF5EA'},
//       stroke: ${contract.isAuth ? '#8FD6B8' : '#E5C78A'},
//       radfius: 10,
//       marginTop: 10,
//     }}>
//       <text style={{fontSize: 14, fill: '#222', marginTop: 10, marginLeft: 10}}>${textOverflowEllipsis(contract.contractName)}&nbsp;</text>
//       <text style={{fontSize: 12, fill: ${contract.isAuth ? '#42C28C' : '#E9A923'}, marginTop: 18, marginLeft: 10}}>${contract.isAuth ? '已授权' : '未授权'}&nbsp;</text>
//     </rect>
//   </group>
// `;
//   },
// });
//
// export type IGraph_Authorization_Nodes = Array<{
//   id: string;
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
// } | {
//   id: string;
//   nodeId: number;
//   nodeName: string;
//   exhibitId: string;
//   exhibitName: string;
// } | {
//   id: string;
//   contracts: {
//     contractId: string;
//     contractName: string;
//     isAuth: boolean;
//     updateDate: string;
//   }[];
// }>;
//
// export type IGraph_Authorization_Edges = {
//   source: string;
//   target: string;
// }[];
//
// interface FAntvG6AuthorizationGraphProps extends GraphData {
//   nodes: IGraph_Authorization_Nodes;
//   edges: IGraph_Authorization_Edges;
//   width?: number;
//   height?: number;
// }
//
//
// function FAntvG6AuthorizationGraph({ nodes, edges, width = 920, height = 500 }: FAntvG6AuthorizationGraphProps) {
//   const ref = React.useRef(null);
//
//   React.useEffect(() => {
//
//     if (edges.length === 0) {
//       return;
//     }
//
//     let graph: any = null;
//
//     if (!graph) {
//       graph = new G6.Graph({
//         container: ref.current || '',
//         width: width,
//         height: height,
//         fitView: true,
//         // fitViewPadding: [20, 40, 50, 20],
//         modes: {
//           default: [
//             'drag-canvas',
//             'zoom-canvas',
//           ],
//         },
//         layout: {
//           // type: 'mindmap',
//           // type: 'compactBox',
//           type: 'dagre',
//           rankdir: 'LR', // 可选，默认为图的中心
//           // nodesep: 20,
//           // ranksep: 100,
//           // align: 'DL', // 可选
//           preventOverlap: true,
//           controlPoints: true,
//           workerEnabled: true,
//           nodesep: 20,
//           ranksep: 100,
//           // direction: 'H',
//           // getHeight: () => {
//           //   return 64;
//           // },
//           // getWidth: () => {
//           //   return 200;
//           // },
//           // getVGap: () => {
//           //   return 10;
//           // },
//           // getHGap: () => {
//           //   return 100;
//           // },
//           // getSide: () => {
//           //   return 'right';
//           // },
//         },
//         defaultNode: {
//           type: 'authorization-contract',
//           // width: 150,
//           // height: 64,
//           anchorPoints: [
//             [0, 0.5],
//             [1, 0.5],
//           ],
//           // labelCfg: {
//           //   style: {
//           //     // fill: '#000000A6',
//           //     // fontSize: 10,
//           //   },
//           // },
//           style: {
//             // stroke: '#72CC4A',
//             // width: 150,
//             // height: 64,
//           },
//         },
//         defaultEdge: {
//           type: 'cubic-horizontal',
//           style: {
//             stroke: '#979797',
//           },
//           sourceAnchor: 1,
//           targetAnchor: 0,
//         },
//         // renderer: 'svg',
//       });
//
//       graph.read({
//         nodes: nodes.map((n) => {
//           return {
//             ...n,
//             type: (n as any).resourceId
//               ? 'authorization-resource'
//               : (n as any).exhibitId
//                 ? 'authorization-exhibit'
//                 : 'authorization-contract',
//           };
//         }),
//         edges,
//       });
//     } else {
//       graph.changeData({
//         nodes: nodes.map((n) => {
//           return {
//             ...n,
//             type: (n as any).resourceId
//               ? 'authorization-resource'
//               : (n as any).exhibitId
//                 ? 'authorization-exhibit'
//                 : 'authorization-contract',
//           };
//         }),
//         edges,
//       });
//     }
//
//     return () => {
//       graph.destroy();
//       graph = null;
//     };
//
//   }, [nodes, edges]);
//
//   if (edges.length === 0) {
//     return (<div
//       className={styles.noEdges}
//       style={{
//         width: width,
//         height: height,
//       }}
//     >
//       <FComponentsLib.FTipText
//         type='first'
//         text={'无授权树'}
//       />
//     </div>);
//   }
//
//   return (<div
//     style={{
//       width: width,
//       height: height,
//     }}
//     ref={ref}
//   />);
// }
//
// export default FAntvG6AuthorizationGraph;
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
// export async function handleAuthorizationGraphData(data: AuthorizationTree, root: ResourceNode | ExhibitNode): Promise<AuthorizationGraphData> {
//
//   const contractNodes: {
//     id: string;
//     contractIds: string[];
//   }[] = [];
//
//   const resourceNodes: Array<ResourceNode | ExhibitNode> = [{
//     ...root,
//     id: (root as any).versionId || (root as any).exhibitId,
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
//     edges,
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
//       edges.push({
//         source: parentID,
//         target: id1,
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
//         edges.push({
//           source: id1,
//           target: id2,
//         });
//         traversal(auth.children, id2);
//       }
//     }
//   }
// }
