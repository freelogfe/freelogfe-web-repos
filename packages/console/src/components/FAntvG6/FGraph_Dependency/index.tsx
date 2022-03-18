import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { FNode_Relationship_Resource_Values } from '@/components/FAntvG6/registerNode';

interface FGraph_Dependency_Props {

}

interface FGraph_Relationship_Props {
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

function FGraph_Dependency({}: FGraph_Dependency_Props) {

  async function handle(){
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

  return (<div>__Template</div>);
}

export default FGraph_Dependency;

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
