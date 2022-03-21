import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';

interface FGraph_Tree_Authorization_Resource_Props {
  resourceID: string;
  version: string;
  width: number;
  height: number;
}

function FGraph_Tree_Authorization_Resource({width, height, resourceID, version}: FGraph_Tree_Authorization_Resource_Props) {
  return (<DecompositionTreeGraph
    width={width}
    height={height}
    data={dataSource as any}
    nodeCfg={
      {
        type: 'FNode_Dependency_Resource',
        style: {},
        nodeStateStyles: {},
      }
    }
    layout={{
      type: 'indented',
      direction: 'LR',
      dropCap: false,
      indent: 500,
      getHeight: () => {
        return 64;
      },
      // getWidth: () => {
      //   return 200;
      // },
    }}
    // markerCfg={(cfg) => {
    //   const { children } = cfg as any;
    //   return {
    //     show: children?.length,
    //   };
    // }}
    behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
  />);
}

export default FGraph_Tree_Authorization_Resource;

// 依赖树
// const params2: Parameters<typeof FServiceAPI.Resource.dependencyTree>[0] = {
//   resourceId: resourceVersionEditorPage.resourceID,
//   version: resourceVersionEditorPage.version,
//   // $version: '0.0.1',
//   isContainRootNode: true,
// };
//
// const {data: data2} = yield call(FServiceAPI.Resource.dependencyTree, params2);
// const {nodes: dependencyGraphNodes, edges: dependencyGraphEdges} = handleDependencyGraphData(data2[0]);
//
// // 授权树
// const params3: Parameters<typeof FServiceAPI.Resource.authTree>[0] = {
//   resourceId: resourceVersionEditorPage.resourceID,
//   version: resourceVersionEditorPage.version,
// };
//
// const {data: data3} = yield call(FServiceAPI.Resource.authTree, params3);
// // console.log(data3, 'data39023jrafklsdjlaksdfjlkasdf');
// const {nodes: authorizationGraphNodes, edges: authorizationGraphEdges} = yield call(handleAuthorizationGraphData, data3, {
//   id: data.version,
//   resourceId: data.resourceId,
//   resourceName: data.resourceName,
//   resourceType: data.resourceType,
//   version: data.version,
//   versionId: data.versionId,
// });
//
// // 关系树
// const params4: Parameters<typeof FServiceAPI.Resource.relationTreeAuth>[0] = {
//   resourceId: resourceVersionEditorPage.resourceID,
//   version: resourceVersionEditorPage.version,
// };
//
// const {data: data4} = yield call(FServiceAPI.Resource.relationTreeAuth, params4);
