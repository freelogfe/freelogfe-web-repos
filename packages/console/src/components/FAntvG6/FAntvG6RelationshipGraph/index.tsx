// import * as React from 'react';
// import styles from './index.less';
// import G6 from '@antv/g6';
// import { GraphData } from '@antv/g6/lib';
// import { textOverflowEllipsis } from '@/components/FAntvG6/tools';
// import FComponentsLib from '@freelog/components-lib';
//
// // // <text style={{fontSize: 14, fill: '#E9A923', marginTop: 24, marginLeft: 10}}>${cfg.pending ? '待执行' : ''}${cfg.pending && cfg.exception ? ' ' : ''}${cfg.exception ? '授权异常' : ''}</text>
// G6.registerNode('relationship-resource', {
//   jsx: (cfg: any) => {
//     const isRoot: boolean = cfg.id.split('-').length === 1;
//     // const authFailedLength: number = cfg.authFailedResources.length;
//     // pending: boolean;
//     // exception: boolean;
//     return `
//     <group>
//       <rect style={{
//           width: 'fit-content',
//           height: 84,
//           fill: '#fff',
//           stroke: '#EFEFEF',
//           radius: 10,
//         }}>
//           <text style={{fontSize: 14, fontWeight: 600, fill: '#222', marginTop: 14,marginLeft: 10,}}>${textOverflowEllipsis(cfg.resourceName)}&nbsp;</text>
//           <text style={{fontSize: 12, fontWeight: 400, fill: '#666', marginTop: 16,marginLeft: 10,}}>${cfg.resourceType}${cfg.version ? `｜${cfg.version}` : ''}&nbsp;</text>
//           <text style={{fontSize: 14, fill: '#E9A923', marginTop: 24, marginLeft: 10}}>${cfg.pending ? '未授权' : ''}${cfg.pending && cfg.exception ? ' ' : ''}${cfg.exception ? '授权异常' : ''}</text>
//       </rect>
//     </group>
// `;
//   },
// });
//
// G6.registerNode('relationship-exhibit', {
//   jsx: (cfg: any) => {
//
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
// export type IGraph_Relationship_Nodes = Array<{
//   id: string;
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
//   pending: boolean;
//   exception: boolean;
// } | {
//   id: string;
//   nodeName: string;
//   exhibitName: string;
// }>;
//
// export type IGraph_Relationship_Edges = {
//   source: string;
//   target: string;
// }[];
//
// interface FAntvG6RelationshipGraphProps extends GraphData {
//   nodes: IGraph_Relationship_Nodes;
//   edges: IGraph_Relationship_Edges;
//   width?: number;
//   height?: number;
// }
//
// function FAntvG6RelationshipGraph({ nodes, edges, width = 920, height = 500 }: FAntvG6RelationshipGraphProps) {
//
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
//           //   return 84;
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
//           type: 'relationship-resource',
//           // type: 'relationship-resource',
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
//         nodes: nodes.map((n, index) => {
//           return {
//             ...n,
//             type: (n as any).resourceId ? 'relationship-resource' : 'relationship-exhibit',
//           };
//         }),
//         edges,
//       });
//     } else {
//       graph.changeData({
//         nodes: nodes.map((n, index) => {
//           return {
//             ...n,
//             type: (n as any).resourceId ? 'relationship-resource' : 'relationship-exhibit',
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
//         text={'无关系树'}
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
// export default FAntvG6RelationshipGraph;
//
// interface RelationTree {
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   versions: string[];
//   versionRanges: string[],
//   downstreamIsAuth: boolean;
//   selfAndUpstreamIsAuth: boolean;
//   children: RelationTree[];
// }
//
// interface RelationGraphData {
//   nodes: {
//     id: string;
//     resourceId: string;
//     resourceName: string;
//     resourceType: string;
//     version: string;
//     pending: boolean;
//     exception: boolean;
//   }[];
//   edges: {
//     source: string;
//     target: string;
//   }[];
// }
//
// export function handleRelationGraphData(data: RelationTree): RelationGraphData {
//   // console.log(data, 'data293jqlwekfwef');
//
//   const nodes: RelationGraphData['nodes'] = [];
//   const edges: RelationGraphData['edges'] = [];
//   traversal(data);
//
//   return {
//     nodes: nodes,
//     edges: edges,
//   };
//
//   function traversal(tree: RelationTree, parentID: string = ''): any {
//     const id: string = parentID ? `${parentID}-${tree.resourceId}` : tree.resourceId;
//     const idLength: number = id.split('-').length;
//     nodes.push({
//       id,
//       resourceId: tree.resourceId,
//       resourceName: tree.resourceName,
//       resourceType: tree.resourceType || '',
//       version: idLength === 3 ? '' : idLength === 2 ? tree.versionRanges[0] : tree.versions[0],
//       pending: tree.downstreamIsAuth === false,
//       exception: tree.selfAndUpstreamIsAuth === false,
//     });
//
//     if (parentID) {
//       edges.push({
//         source: parentID,
//         target: id,
//       });
//     }
//
//     for (const dep of (tree.children || [])) {
//       traversal(dep, id);
//     }
//   }
//
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
// interface ResourceNode {
//   id: string;
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
//   pending: boolean;
//   exception: boolean;
// }
//
// type ExhibitRelationTree = {
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   downstreamIsAuth: boolean;
//   selfAndUpstreamIsAuth: boolean;
//   versions?: string[];
//   children: ExhibitRelationTree;
// }[];
//
// interface ExhibitRelationGraphData {
//   nodes: Array<ResourceNode | ExhibitNode>;
//   edges: {
//     source: string;
//     target: string;
//   }[];
// }
//
// export async function handleExhibitRelationGraphData(data: ExhibitRelationTree, root: {
//   nodeId: number;
//   nodeName: string;
//   exhibitId: string;
//   exhibitName: string;
// }): Promise<ExhibitRelationGraphData> {
//
//   const nodes: Array<ResourceNode | ExhibitNode> = [{
//     id: root.exhibitId,
//     ...root,
//   }];
//   const edges: ExhibitRelationGraphData['edges'] = [];
//   // console.log(data, 'data!@#$@!#$@!#$');
//   traversal(data, root.exhibitId);
//
//   return {
//     nodes,
//     edges,
//   };
//
//   function traversal(exhibitRelationTree: ExhibitRelationTree, parentID: string = '') {
//     for (const relation of exhibitRelationTree) {
//       const theID: string = `${parentID}_${relation.resourceId}`;
//       nodes.push({
//         id: theID,
//         resourceId: relation.resourceId,
//         resourceName: relation.resourceName,
//         resourceType: relation.resourceType,
//         version: relation.versions ? relation.versions[0] : '',
//         pending: relation.downstreamIsAuth === false,
//         exception: relation.downstreamIsAuth === false,
//       });
//       edges.push({
//         source: parentID,
//         target: theID,
//       });
//
//       traversal(relation.children, theID);
//     }
//   }
// }
