import * as React from 'react';
import styles from './index.less';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import '../registerNode/fRelationship';
import { FNode_Relationship_Resource_Values } from '../registerNode/fRelationship';
import FLoadingTip from '@/components/FLoadingTip';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

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

function FGraph_Relationship({ resourceID, version, width, height }: FGraph_Relationship_Props) {

  const [dataSource, set_DataSource] = React.useState<FGraph_Relationship_States['dataSource']>(initStates['dataSource']);

  React.useEffect(() => {
    handleData();
  }, [resourceID, version]);

  async function handleData() {
    set_DataSource(null);

    const params2: Parameters<typeof FServiceAPI.Resource.dependencyTree>[0] = {
      resourceId: resourceID,
      version: version,
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

    console.log(data_BatchAuth, 'data_BatchAuth089io23klasdfasdfdata_BatchAuth');

    const dataSource: FGraph_Relationship_States['dataSource'] = handleDataSource(data_DependencyTree, data_BatchAuth)[0];
    // console.log(dataSource, 'dataSource890io23uhrjkflsdhfkj');

    set_DataSource(dataSource);
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
          // 各状态下的样式，平铺的配置项仅在 keyShape 上生效。需要在其他 shape 样式上响应状态变化则写法不同，参见上文提到的 配置状态样式 链接
          // hover: {
          //   fillOpacity: 0.1,
          //   lineWidth: 10,
          //   fill: 'red',
          //   stroke: 'red',
          // },
        },
      }
    }
    layout={{
      type: 'indented',
      direction: 'LR',
      dropCap: false,
      indent: 400,
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

export default FGraph_Relationship;


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
        resourceDetails_Url: FUtil.LinkTo.resourceDetails({
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
