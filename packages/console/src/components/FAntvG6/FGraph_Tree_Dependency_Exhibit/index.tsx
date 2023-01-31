import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import '../registerNode/fDependency';
import {
  F_DEPENDENCY_NODE_TYPE,
  FNode_Dependency_Exhibit_Values,
  FNode_Dependency_Resource_Values,
} from '../registerNode/fDependency';
import FLoadingTip from '@/components/FLoadingTip';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
import FResultTip from '@/components/FResultTip';
import FErrorBoundary from '@/components/FErrorBoundary';

// import { FNode_Relationship_Exhibit_Values } from '@/components/FAntvG6/registerNode/fRelationship';

interface FGraph_Tree_Dependency_Resource_Props {
  exhibitID: string;
  version?: string;
  width: number;
  height: number;
  fit?: boolean;

  onMount?({ hasData }: { hasData: boolean }): void;
}

interface ExhibitNode {
  id: string;
  nodeType: 'exhibit';
  // value: FNode_Relationship_Resource_Values;
  value: FNode_Dependency_Exhibit_Values;
  children: ResourceNodeTree[];
}

interface ResourceNodeTree {
  id: string;
  nodeType: 'resource';
  value: FNode_Dependency_Resource_Values;
  children: ResourceNodeTree[];
}

interface FGraph_Dependency_States {
  dataSource: ExhibitNode | null;
}

const initStates: FGraph_Dependency_States = {
  dataSource: null,
};

interface ServerDataNode {
  resourceId: string;
  resourceName: string;
  resourceType: string[];
  version: string;
  dependencies: ServerDataNode[];
}

function FGraph_Tree_Dependency_Exhibit({
                                          exhibitID,
                                          version = '',
                                          height,
                                          width,
                                          fit,
                                          onMount,
                                        }: FGraph_Tree_Dependency_Resource_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Dependency_States['dataSource']>(initStates['dataSource']);

  React.useEffect(() => {
    handleData();
  }, [exhibitID, version]);

  async function handleData() {
    // set_DataSource(null);

    if (!exhibitID) {
      return;
    }

    const parmas1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
      presentableId: exhibitID,
      projection: 'presentableId,presentableName,nodeId',
    };

    const { data: data_ExhibitDetails }: {
      data: {
        nodeId: number;
        presentableId: string;
        presentableName: string;
      };
    } = await FServiceAPI.Exhibit.presentableDetails(parmas1);

    const parmas2: Parameters<typeof FServiceAPI.Node.details>[0] = {
      nodeId: data_ExhibitDetails.nodeId,
      // projection: 'presentableId,presentableName,nodeId',
    };

    const { data: data_NodeDetails }: {
      data: {
        nodeId: number;
        nodeName: string;
      };
    } = await FServiceAPI.Node.details(parmas2);

    const params3: Parameters<typeof FServiceAPI.Exhibit.dependencyTree>[0] = {
      presentableId: exhibitID,
      version: version || undefined,
      isContainRootNode: true,
    };

    const { data: data_DependencyTree }: { data: ServerDataNode[] } = await FServiceAPI.Exhibit.dependencyTree(params3);

    const dataSource: FGraph_Dependency_States['dataSource'] = {
      id: data_ExhibitDetails.presentableId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'exhibit',
      value: {
        exhibitID: data_ExhibitDetails.presentableId,
        exhibitName: data_ExhibitDetails.presentableName,
        nodeID: data_NodeDetails.nodeId,
        nodeName: data_NodeDetails.nodeName,
      },
      children: handleDataSource({ data: data_DependencyTree }),
    };
    onMount && onMount({ hasData: dataSource.children.length > 0 });
    set_DataSource(dataSource);
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
        getHeight: (node: any) => {
          if (node.nodeType === 'resource') {
            return 64;
          }
          if (node.nodeType === 'exhibit') {
            return 110;
          }
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

export default FGraph_Tree_Dependency_Exhibit;

interface HandleDataSourceParams {
  data: ServerDataNode[];
}

function handleDataSource({ data }: HandleDataSourceParams): ResourceNodeTree[] {
  return data.map<ResourceNodeTree>((d) => {
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
      children: handleDataSource({ data: d.dependencies }),
    };
  });
}
