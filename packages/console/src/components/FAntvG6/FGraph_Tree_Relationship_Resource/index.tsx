import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fRelationship';
import {
  F_RELATIONSHIP_NODE_TYPE,
  FNode_Relationship_Exhibit_Values,
  FNode_Relationship_Resource_Values, FNode_Relationship_RootResource_Values,
} from '../registerNode/fRelationship';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
import FResultTip from '@/components/FResultTip';
import FErrorBoundary from '@/components/FErrorBoundary';
import { relationTreeAuth } from '@freelog/tools-lib/dist/service-API/resources';

interface FGraph_Tree_Relationship_Resource_Props {
  resourceID: string;
  version: string;
  width: number;
  height: number;
}

interface RootResourceNode {
  id: string;
  nodeType: 'rootResource';
  // value: FNode_Relationship_Resource_Values;
  value: FNode_Relationship_RootResource_Values;
  children: ResourceNode[];
}

interface ResourceNode {
  id: string;
  nodeType: 'resource';
  value: FNode_Relationship_Resource_Values;
  children: ResourceNode[];
}

interface FGraph_Relationship_States {
  dataSource: RootResourceNode | null;
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
  // versions?: string[];
  downstreamAuthContractIds: string[];
  downstreamIsAuth?: boolean;
  selfAndUpstreamIsAuth?: boolean;
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
    // set_DataSource(null);

    if (!resourceID || !version) {
      return;
    }

    const params2: Parameters<typeof FServiceAPI.Resource.relationTreeAuth>[0] = {
      resourceId: resourceID,
      version: version,
    };

    const { data: data_DependencyTree }: { data: ServerDataNode[] } = await FServiceAPI.Resource.relationTreeAuth(params2);
    // console.log(data_DependencyTree, 'data_DependencyTree32sdfsd');

    const dataSource: FGraph_Relationship_States['dataSource'] = {
      id: data_DependencyTree[0].resourceId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'rootResource',
      // value: FNode_Relationship_Resource_Values;
      value: {
        resourceID: data_DependencyTree[0].resourceId,
        resourceName: data_DependencyTree[0].resourceName,
        resourceType: data_DependencyTree[0].resourceType,
        version: data_DependencyTree[0].versionRanges?.length
          ? data_DependencyTree[0].versionRanges[0]
          : data_DependencyTree[0].versions?.length
            ? data_DependencyTree[0].versions[0]
            : '',
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({
          resourceID: data_DependencyTree[0].resourceId,
          // version: d.version,
        }),
      },
      children: handleDataSource({
        data: data_DependencyTree[0].children,
        parentResourceID: data_DependencyTree[0].resourceId,
      }),
    };
    // console.log(dataSource, 'dataSource890io23uhrjkflsdhfkj');

    set_DataSource(dataSource);
  }

  const Gra = React.useMemo(() => {
    return (<DecompositionTreeGraph
      style={{ backgroundColor: 'transparent' }}
      width={width}
      height={height}
      data={dataSource as any}
      // fitCenter={false}
      // autoFit={true}
      nodeCfg={
        {
          type: F_RELATIONSHIP_NODE_TYPE,
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
          if (node.nodeType === 'rootResource') {
            return 58;
          }
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
  }, [dataSource]);

  return (<>
    {
      !dataSource && (<FLoadingTip height={height} />)
    }

    {
      dataSource && dataSource.children.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: width, height: height }}>
          <FResultTip h1={'无关系树'} />
        </div>)
    }

    {
      dataSource && dataSource.children.length > 0 && <FErrorBoundary>{Gra}</FErrorBoundary>
    }

  </>);
}

export default FGraph_Tree_Relationship_Resource;


// function getAllResourceIDAndVersions(data: ServerDataNode): {
//   resourceID: string;
//   version: string;
// }[] {
//
//   const resources: {
//     resourceID: string;
//     version: string;
//   }[] = [];
//   traversal(data);
//
//   function traversal(data: ServerDataNode): any {
//     const { children, ...resource } = data;
//     resources.push({
//       resourceID: resource.resourceId,
//       version: resource.versionRanges.length > 0
//         ? resource.versionRanges[0]
//         : resource.versions[0],
//     });
//
//     for (const dep of children) {
//       traversal(dep);
//     }
//   }
//
//   return resources;
// }

interface HandleDataSourceParams {
  data: ServerDataNode[];
  parentResourceID: string;
}

function handleDataSource({ data, parentResourceID }: HandleDataSourceParams): ResourceNode[] {
  return data.map((d) => {
    return {
      id: d.resourceId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'resource',
      value: {
        resourceID: d.resourceId,
        resourceName: d.resourceName,
        resourceType: d.resourceType,
        version: d.versionRanges?.length
          ? d.versionRanges[0]
          : d.versions?.length
            ? d.versions[0]
            : '',
        // downstreamAuthContractIds: d.downstreamAuthContractIds,
        show_Execute: d.downstreamIsAuth === false,
        show_Warning: d.selfAndUpstreamIsAuth === false,
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({
          resourceID: d.resourceId,
          // version: d.version,
        }),
      },
      children: handleDataSource({
        data: d.children,
        parentResourceID: d.resourceId,
      }),
    };
  });
}
