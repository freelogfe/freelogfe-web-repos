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
import { ConnectState, MarketResourcePageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/marketResourcePage';
import FDrawer from '@/components/FDrawer';
import { FTextBtn } from '@/components/FButton';
import FGraph_Tree_Dependency_Resource from '@/components/FAntvG6/FGraph_Tree_Dependency_Resource';
import FGraph_Tree_Authorization_Resource from '@/components/FAntvG6/FGraph_Tree_Authorization_Resource';

interface ViewportProps {
  dispatch: Dispatch;

  marketResourcePage: MarketResourcePageModelState;
}

function Viewport({ dispatch, marketResourcePage }: ViewportProps) {

  async function onChange(payload: Partial<MarketResourcePageModelState>) {
    await dispatch<ChangeAction>({
      type: 'marketResourcePage/change',
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
              graphFullScreen: true,
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
        value={marketResourcePage.viewportGraphShow}
        onChange={(value) => {
          onChange({ viewportGraphShow: value as 'dependency' });
        }}
      >
        {
          marketResourcePage.graphFullScreen
            ? (<div style={{ height: 500 }} />)
            : (<>
              {/*{*/}
              {/*  marketResourcePage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph*/}
              {/*    nodes={marketResourcePage.dependencyGraphNodes}*/}
              {/*    edges={marketResourcePage.dependencyGraphEdges}*/}
              {/*  />)*/}
              {/*}*/}
              {
                marketResourcePage.viewportGraphShow === 'dependency' && (<FGraph_Tree_Dependency_Resource
                  resourceID={marketResourcePage.resourceId}
                  version={marketResourcePage.version}
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
                marketResourcePage.viewportGraphShow === 'authorization' && (<FGraph_Tree_Authorization_Resource
                  resourceID={marketResourcePage.resourceId}
                  version={marketResourcePage.version}
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
      visible={marketResourcePage.graphFullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        onChange({ graphFullScreen: false });
      }}
    >
      <FViewportTabs
        options={[
          { label: '依赖树', value: 'dependency' },
          { label: '授权链', value: 'authorization' },
        ]}
        value={marketResourcePage.viewportGraphShow}
        onChange={(value) => {
          onChange({
            viewportGraphShow: value as 'dependency',
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
          marketResourcePage.viewportGraphShow === 'dependency' &&  (<FGraph_Tree_Dependency_Resource
            resourceID={marketResourcePage.resourceId}
            version={marketResourcePage.version}
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
          marketResourcePage.viewportGraphShow === 'authorization' && (<FGraph_Tree_Authorization_Resource
            resourceID={marketResourcePage.resourceId}
            version={marketResourcePage.version}
            width={window.innerWidth - 60}
            // width={'100%'}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

      </FViewportTabs>
    </FDrawer>
  </>);
}

export default connect(({ marketResourcePage }: ConnectState) => ({
  marketResourcePage,
}))(Viewport);
