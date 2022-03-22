import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fRelationship';
import { FNode_Relationship_Resource_Values } from '../registerNode/fRelationship';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';

interface FGraph_Tree_Relationship_Resource_Props {
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
  versions: string[];
  versionRanges: string[];
  children: ServerDataNode[];
}

function FGraph_Tree_Relationship_Resource({
                                             resourceID,
                                             version,
                                             width,
                                             height,
                                           }: FGraph_Tree_Relationship_Resource_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Relationship_States['dataSource']>(initStates['dataSource']);

  React.useEffect(() => {
    handleData();
  }, [resourceID, version]);

  async function handleData() {
    set_DataSource(null);

    if (!resourceID || !version) {
      return;
    }

    const params2: Parameters<typeof FServiceAPI.Resource.relationTree>[0] = {
      resourceId: resourceID,
      version: version,
    };

    const { data: data_DependencyTree }: { data: ServerDataNode[] } = await FServiceAPI.Resource.relationTree(params2);
    // console.log(data_DependencyTree, 'data_DependencyTree#@##34234234');
    const authResult = getAllResourceIDAndVersions(data_DependencyTree[0]);

    const params3: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
      resourceIds: authResult.map((ar) => ar.resourceID).join(','),
      versionRanges: authResult.map((ar) => ar.version).join(','),
    };

    const { data: data_BatchAuth }: {
      data: {
        isAuth: boolean;
        resourceId: string;
        resourceName: string;
        version: string;
      }[];
    } = await FServiceAPI.Resource.batchAuth(params3);

    // console.log(data_BatchAuth, 'data_BatchAuth089io23klasdfasdfdata_BatchAuth');

    const dataSource: FGraph_Relationship_States['dataSource'] = handleDataSource(data_DependencyTree, data_BatchAuth)[0];
    // console.log(dataSource, 'dataSource890io23uhrjkflsdhfkj');

    set_DataSource(dataSource);
  }

  if (!dataSource) {
    return (<FLoadingTip height={height} />);
  }

  return (<DecompositionTreeGraph
    style={{backgroundColor: 'transparent'}}
    width={width}
    height={height}
    data={dataSource as any}
    // fitCenter={false}
    // autoFit={true}
    nodeCfg={
      {
        type: 'FNode_Relationship_Resource',
        style: {},
        nodeStateStyles: {},
      }
    }
    layout={{
      // type: 'indented',
      // direction: 'LR',
      // dropCap: false,
      // indent: 500,
      getHeight: () => {
        return 90;
      },
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
      // console.log(graph.getNodes(), 'GGGRRRRAAAFFFFFF');
      // graph.moveTo(20, 20, true);
      // graph.zoom(1);
      appendAutoShapeListener(graph as Graph);
    }}
  />);
}

export default FGraph_Tree_Relationship_Resource;


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
    const { children, ...resource } = data;
    resources.push({
      resourceID: resource.resourceId,
      version: resource.versionRanges.length > 0
        ? resource.versionRanges[0]
        : resource.versions[0],
    });

    for (const dep of children) {
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
        version: d.versionRanges.length > 0
          ? d.versionRanges[0]
          : d.versions[0],
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({
          resourceID: d.resourceId,
          // version: d.version,
        }),
        isAuth: auth.find((af) => {
          return af.resourceId === d.resourceId;
          // && af.version === d.version;
        })?.isAuth || true,
      },
      children: handleDataSource(d.children, auth),
    };
  });
}
