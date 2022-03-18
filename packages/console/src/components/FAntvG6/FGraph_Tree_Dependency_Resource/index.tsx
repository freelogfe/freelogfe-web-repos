import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { FNode_Relationship_Resource_Values } from '@/components/FAntvG6/registerNode';
import FLoadingTip from '@/components/FLoadingTip';
import { DecompositionTreeGraph } from '@ant-design/graphs';

interface FGraph_Tree_Dependency_Resource_Props {
  resourceID: string;
  version: string;
  width: number;
  height: number;
}


interface NodeTree {
  id: string;
  value: FNode_Relationship_Resource_Values;
  children: NodeTree[];
}

interface FGraph_Relationship_States {
  dataSource: NodeTree | null;
}

const initStates: FGraph_Relationship_States = {
  dataSource: null,
};

interface ServerDataNode {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  version: string;
  dependencies: ServerDataNode[];
}

function FGraph_Tree_Dependency_Resource({resourceID, version, height, width}: FGraph_Tree_Dependency_Resource_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Relationship_States['dataSource']>(initStates['dataSource']);

  React.useEffect(() => {
    handleData();
  }, [resourceID, version]);

  async function handleData(){
    const params2: Parameters<typeof FServiceAPI.Resource.dependencyTree>[0] = {
      resourceId: '',
      version: '',
      isContainRootNode: true,
    };

    const { data: data_DependencyTree }: { data: ServerDataNode[] } = await FServiceAPI.Resource.dependencyTree(params2);
    const authResult = getAllResourceIDAndVersions(data_DependencyTree[0]);

    const params3: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
      resourceIds: authResult.map((ar) => ar.resourceID).join(','),
      versions: authResult.map((ar) => ar.version).join(','),
    };

    const { data: data_BatchAuth }: {
      data: {
        isAuth: boolean;
        resourceId: string;
        resourceName: string;
        version: string;
      }[];
    } = await FServiceAPI.Resource.batchAuth(params3);

  }

  if (!dataSource) {
    return (<FLoadingTip height={height} />);
  }

  return (<DecompositionTreeGraph
    width={width}
    height={height}
    data={dataSource as any}
    nodeCfg={
      {
        type: 'FNode_Relationship_Resource',
        style: {},
        nodeStateStyles: {

        },
      }
    }
    layout={{
      type: 'indented',
      direction: 'LR',
      dropCap: false,
      indent: 500,
      getHeight: () => {
        return 90;
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

export default FGraph_Tree_Dependency_Resource;

function getAllResourceIDAndVersions(data: ServerDataNode): {
  resourceID: string;
  version: string;
}[] {

  const resources: {
    resourceID: string;
    version: string;
  }[] = [];
  traversal(data);

  function traversal(data: ServerDataNode): any {
    const { dependencies, ...resource } = data;
    resources.push({
      resourceID: resource.resourceId,
      version: resource.version,
    });

    for (const dep of dependencies) {
      traversal(dep);
    }
  }

  return resources;
}

function handleDataSource(data: ServerDataNode[], auth: {
  isAuth: boolean;
  resourceId: string;
  resourceName: string;
  version: string;
}[]): NodeTree[] {
  return data.map<NodeTree>((d) => {
    return {
      id: d.resourceId + '-' + FUtil.Tool.generateRandomCode(),
      value: {
        resourceID: d.resourceId,
        resourceName: d.resourceName,
        resourceType: d.resourceType,
        version: d.version,
        url: FUtil.LinkTo.resourceDetails({
          resourceID: d.resourceId,
          version: d.version,
        }),
        isAuth: auth.find((af) => {
          return af.resourceId === d.resourceId && af.version === d.version;
        })?.isAuth || true,
      },
      children: handleDataSource(d.dependencies, auth),
    };
  });
}



// // 依赖树
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
