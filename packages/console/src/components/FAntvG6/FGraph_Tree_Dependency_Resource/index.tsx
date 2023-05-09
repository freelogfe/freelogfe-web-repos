import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import '../registerNode/fDependency';
import { F_DEPENDENCY_NODE_TYPE, FNode_Dependency_Resource_Values } from '../registerNode/fDependency';
import FLoadingTip from '@/components/FLoadingTip';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
import FResultTip from '@/components/FResultTip';
import FErrorBoundary from '@/components/FErrorBoundary';

interface FGraph_Tree_Dependency_Resource_Props {
  resourceID: string;
  version: string;
  width: number;
  height: number;
  fit?: boolean;

  onMount?({ hasData }: { hasData: boolean }): void;
}

interface NodeTree {
  id: string;
  nodeType: 'resource';
  value: FNode_Dependency_Resource_Values;
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
  resourceType: string[];
  version: string;
  dependencies: ServerDataNode[];
}

function FGraph_Tree_Dependency_Resource({
                                           resourceID,
                                           version,
                                           height,
                                           width,
                                           fit = false,
                                           onMount,
                                         }: FGraph_Tree_Dependency_Resource_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Relationship_States['dataSource']>(initStates['dataSource']);

  React.useEffect(() => {
    handleData();
  }, [resourceID, version]);

  async function handleData() {
    // set_DataSource(null);

    if (!resourceID || !version) {
      return;
    }

    const params2: Parameters<typeof FServiceAPI.Resource.dependencyTree>[0] = {
      resourceId: resourceID,
      version: version,
      isContainRootNode: true,
    };

    const { data: data_DependencyTree }: { data: ServerDataNode[] } = await FServiceAPI.Resource.dependencyTree(params2);

    const data_source = handleDataSource(data_DependencyTree)[0];
    onMount && onMount({ hasData: data_source.children.length > 0 });
    set_DataSource(data_source);
  }

  const Gra = React.useMemo(() => {
    return (<DecompositionTreeGraph
      style={{ backgroundColor: 'transparent' }}
      width={width}
      height={height}
      data={dataSource as any}
      fitCenter={!fit}
      autoFit={fit}
      nodeCfg={
        {
          type: F_DEPENDENCY_NODE_TYPE,
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
          return 64;
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
        // console.log(graph.getNodes(), 'GGGRRRRAAAFFFFFF');
        // graph.moveTo(20, 20);
        // graph.zoom(1);
        appendAutoShapeListener(graph as Graph);
      }}
    />);
  }, [dataSource]);

  // console.log(dataSource, 'dataSource依赖树932ioasdfjl');

  if (!dataSource) {
    return (<FLoadingTip height={height} />);
  }

  if (dataSource.children.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
        <FResultTip h1={'无依赖树'} />
      </div>);
  }

  return (<>
    {Gra}
  </>);
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

function handleDataSource(data: ServerDataNode[]): NodeTree[] {
  return data.map<NodeTree>((d) => {
    return {
      id: d.resourceId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'resource',
      value: {
        resourceID: d.resourceId,
        resourceName: d.resourceName,
        resourceType: d.resourceType,
        version: d.version,
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({
          resourceID: d.resourceId,
          // version: d.version,
        }),
      },
      children: handleDataSource(d.dependencies),
    };
  });
}
