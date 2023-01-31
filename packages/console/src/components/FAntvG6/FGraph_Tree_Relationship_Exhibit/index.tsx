import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fRelationship';
import {
  F_RELATIONSHIP_NODE_TYPE,
  FNode_Relationship_Exhibit_Values,
  FNode_Relationship_Resource_Values,
} from '../registerNode/fRelationship';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { appendAutoShapeListener } from '@/components/FAntvG6/tools';
import { Graph } from '@antv/g6';
import FResultTip from '@/components/FResultTip';
// import FErrorBoundary from '@/components/FErrorBoundary';
import FRelationDrawer from '@/components/FAntvG6/FRelationDrawer';

interface ServerDataNode {
  resourceId: string;
  resourceName: string;
  resourceType: string[];
  versions?: string[];
  versionRanges?: string[];
  downstreamAuthContractIds: string[];
  downstreamIsAuth: boolean;
  selfAndUpstreamIsAuth: boolean;
  children: ServerDataNode[];
}

interface FGraph_Tree_Relationship_Exhibit_Props {
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
  value: FNode_Relationship_Exhibit_Values;
  children: ResourceNodeTree[];
}

interface ResourceNodeTree {
  id: string;
  nodeType: 'resource';
  // value: FNode_Relationship_Resource_Values;
  value: FNode_Relationship_Resource_Values;
  children: ResourceNodeTree[];
}

interface FGraph_Relationship_States {
  dataSource: ExhibitNode | null;
  showRelationDrawerInfo: {
    licensor: {
      licensorID: string;
      licensorIdentityType: 'resource';
    };
    licensee: {
      licenseeID: string;
      licenseeIdentityType: 'resource' | 'exhibit';
    };
  } | null;
}

const initStates: FGraph_Relationship_States = {
  dataSource: null,
  showRelationDrawerInfo: null,
};

function FGraph_Tree_Relationship_Exhibit({
                                            exhibitID,
                                            version = '',
                                            width,
                                            height,
                                            fit,
                                            onMount,
                                          }: FGraph_Tree_Relationship_Exhibit_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Relationship_States['dataSource']>(initStates['dataSource']);
  const [showRelationDrawerInfo, set_ShowRelationDrawerInfo] = React.useState<FGraph_Relationship_States['showRelationDrawerInfo']>(initStates['showRelationDrawerInfo']);

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

    const params3: Parameters<typeof FServiceAPI.Exhibit.relationTree>[0] = {
      presentableId: exhibitID,
      version: version || undefined,
    };

    const { data: data_RelationTree }: { data: ServerDataNode[] } = await FServiceAPI.Exhibit.relationTree(params3);

    const dataSource: FGraph_Relationship_States['dataSource'] = {
      id: data_ExhibitDetails.presentableId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'exhibit',
      value: {
        exhibitID: data_ExhibitDetails.presentableId,
        exhibitName: data_ExhibitDetails.presentableName,
        nodeID: data_NodeDetails.nodeId,
        nodeName: data_NodeDetails.nodeName,
      },
      children: handleDataSource({
        data: data_RelationTree,
        parentInfo: {
          parentID: data_ExhibitDetails.presentableId,
          parentIdentity: 'exhibit',
        },
      }),
    };
    // console.log(dataSource, 'dataSource890io23uhrjkflsdhfkj');

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
          if (node.nodeType === 'resource') {
            return 90;
          }
          if (node.nodeType === 'exhibit') {
            return 110;
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
        graph.on('resource:viewContract', ({ resourceID }: any) => {
          // console.log(params, 'params23908isdflk');
          // console.log(resourceID, parentInfo, 'resourceID, parentInfo92394iuojsldk@#@##$@#$@#');
          // set_ContractID(contractID);
          set_ShowRelationDrawerInfo({
            licensor: {
              licensorID: resourceID,
              licensorIdentityType: 'resource',
            },
            licensee: {
              licenseeID: exhibitID,
              licenseeIdentityType: 'exhibit',
            },
          });
        });
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
      dataSource && dataSource.children.length > 0 && (<>
        {Gra}
      </>)
    }
    {/*{console.log(showRelationDrawerInfo, 'showRelationDrawerInfo98io3ewfsdl')}*/}
    <FRelationDrawer
      bothSidesInfo={showRelationDrawerInfo}
      onClose={() => {
        set_ShowRelationDrawerInfo(null);
      }}
      onChange_Authorization={() => {
        handleData();
      }}
    />

  </>);
}

export default FGraph_Tree_Relationship_Exhibit;

interface HandleDataSourceParams {
  data: ServerDataNode[];
  parentInfo: {
    parentID: string;
    parentIdentity: 'resource' | 'exhibit';
  };
}

function handleDataSource({ data, parentInfo }: HandleDataSourceParams): ResourceNodeTree[] {
  return data.map<ResourceNodeTree>((d) => {
    return {
      id: d.resourceId + '-' + FUtil.Tool.generateRandomCode(),
      nodeType: 'resource',
      value: {
        resourceID: d.resourceId,
        resourceName: d.resourceName,
        resourceType: d.resourceType,
        // version: d.versions?.length ? d.versions[0] : '',
        version: d.versionRanges?.length
          ? d.versionRanges[0]
          : d.versions?.length
            ? d.versions[0]
            : '',
        // downstreamAuthContractIds: d.downstreamAuthContractIds,
        show_Execute: !d.downstreamIsAuth,
        show_Warning: !d.selfAndUpstreamIsAuth,
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({ resourceID: d.resourceId }),
        parentInfo: parentInfo,
      },
      children: handleDataSource({
        data: d.children,
        parentInfo: {
          parentID: d.resourceId,
          parentIdentity: 'resource',
        },
      }),
    };
  });
}
