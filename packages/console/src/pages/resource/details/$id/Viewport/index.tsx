import * as React from 'react';
import { FContentText, FTitleText } from '@/components/FText';
import styles from './index.less';
import {
  // FAntvG6AuthorizationGraph,
  // FAntvG6DependencyGraph,
  // FAntvG6RelationshipGraph,
  FViewportTabs,
} from '@/components/FAntvG6';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceDetailPage';
import FDrawer from '@/components/FDrawer';
import { FTextBtn } from '@/components/FButton';
import FGraph_Tree_Dependency_Resource from '@/components/FAntvG6/FGraph_Tree_Dependency_Resource';
import FGraph_Tree_Authorization_Resource from '@/components/FAntvG6/FGraph_Tree_Authorization_Resource';

interface ViewportProps {
  dispatch: Dispatch;

  resourceDetailPage: ResourceDetailPageModelState;
}

function Viewport({ dispatch, resourceDetailPage }: ViewportProps) {

  async function onChange(payload: Partial<ResourceDetailPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'resourceDetailPage/change',
      payload,
    });
  }

  return (<>
    <div style={{ height: 30 }} />
    <div>
      <div className={styles.title}>
        <FTitleText
          text={'相关视图'}
          type='h3'
        />
        <FTextBtn
          onClick={() => {
            onChange({
              graph_FullScreen: true,
            });
          }}
          type='default'
        >全屏查看</FTextBtn>
      </div>
      <div style={{ height: 20 }} />
      <FViewportTabs
        options={[
          { label: '依赖树', value: 'dependency' },
          { label: '授权链', value: 'authorization' },
        ]}
        value={resourceDetailPage.graph_ViewportGraphShow}
        onChange={(value) => {
          onChange({ graph_ViewportGraphShow: value as 'dependency' });
        }}
      >
        {
          resourceDetailPage.graph_FullScreen
            ? (<div style={{ height: 500 }} />)
            : (<>
              {/*{*/}
              {/*  marketResourcePage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph*/}
              {/*    nodes={marketResourcePage.dependencyGraphNodes}*/}
              {/*    edges={marketResourcePage.dependencyGraphEdges}*/}
              {/*  />)*/}
              {/*}*/}
              {
                resourceDetailPage.graph_ViewportGraphShow === 'dependency' && (<FGraph_Tree_Dependency_Resource
                  resourceID={resourceDetailPage.resource_ID}
                  version={resourceDetailPage.resourceVersion_SelectedVersion}
                  width={920}
                  height={500}
                />)
              }

              {/*{*/}
              {/*  marketResourcePage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph*/}
              {/*    nodes={marketResourcePage.authorizationGraphNodes}*/}
              {/*    edges={marketResourcePage.authorizationGraphEdges}*/}
              {/*  />)*/}
              {/*}*/}

              {
                resourceDetailPage.graph_ViewportGraphShow === 'authorization' && (<FGraph_Tree_Authorization_Resource
                  resourceID={resourceDetailPage.resource_ID}
                  version={resourceDetailPage.resourceVersion_SelectedVersion}
                  width={920}
                  height={500}
                />)
              }
            </>)
        }

      </FViewportTabs>
    </div>
    <div style={{ height: 20 }} />

    <FDrawer
      visible={resourceDetailPage.graph_FullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        onChange({ graph_FullScreen: false });
      }}
    >
      <FViewportTabs
        options={[
          { label: '依赖树', value: 'dependency' },
          { label: '授权链', value: 'authorization' },
        ]}
        value={resourceDetailPage.graph_ViewportGraphShow}
        onChange={(value) => {
          onChange({
            graph_ViewportGraphShow: value as 'dependency',
          });
        }}
      >

        {/*{*/}
        {/*  marketResourcePage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph*/}
        {/*    nodes={marketResourcePage.dependencyGraphNodes}*/}
        {/*    edges={marketResourcePage.dependencyGraphEdges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}

        {
          resourceDetailPage.graph_ViewportGraphShow === 'dependency' &&  (<FGraph_Tree_Dependency_Resource
            resourceID={resourceDetailPage.resource_ID}
            version={resourceDetailPage.resourceVersion_SelectedVersion}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {/*{*/}
        {/*  marketResourcePage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph*/}
        {/*    nodes={marketResourcePage.authorizationGraphNodes}*/}
        {/*    edges={marketResourcePage.authorizationGraphEdges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}

        {
          resourceDetailPage.graph_ViewportGraphShow === 'authorization' && (<FGraph_Tree_Authorization_Resource
            resourceID={resourceDetailPage.resource_ID}
            version={resourceDetailPage.resourceVersion_SelectedVersion}
            width={window.innerWidth - 60}
            // width={'100%'}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

      </FViewportTabs>
    </FDrawer>
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({
  resourceDetailPage,
}))(Viewport);
