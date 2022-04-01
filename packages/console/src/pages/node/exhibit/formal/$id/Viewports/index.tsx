import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/exhibitInfoPage';
import {
  // FAntvG6RelationshipGraph,
  FViewportTabs,
} from '@/components/FAntvG6';
import FDrawer from '@/components/FDrawer';
import { FTextBtn } from '@/components/FButton';
import FUtil1 from '@/utils';
import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';
import FGraph_Tree_Relationship_Exhibit from '@/components/FAntvG6/FGraph_Tree_Relationship_Exhibit';
import FGraph_Tree_Dependency_Exhibit from '@/components/FAntvG6/FGraph_Tree_Dependency_Exhibit';

interface ViewportsProps {
  dispatch: Dispatch;

  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Viewports({ dispatch, exhibitInfoPage }: ViewportsProps) {

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload,
    });
  }

// graph_FullScreen: false,
  //   graph_Viewport_Show: 'relationship',
  //   graph_Viewport_RelationGraph_Nodes: [],
  //   graph_Viewport_RelationGraph_Edges: [],
  //   graph_Viewport_AuthorizationGraph_Nodes: [],
  //   graph_Viewport_AuthorizationGraph_Edges: [],
  return (<div>
    <div className={styles.title}>
      <FTitleText text={FUtil1.I18n.message('title_exhibit_maps')} type='h3' />
      <FTextBtn
        type='default'
        onClick={() => {
          onChange({
            graph_FullScreen: true,
          });
        }}
      >全屏查看</FTextBtn>
    </div>
    <div style={{ height: 20 }} />
    <FViewportTabs
      options={[
        { value: 'relationship', label: FUtil1.I18n.message('quick_decision_map') },
        { value: 'authorization', label: '授权链视图' },
        { value: 'dependency', label: '依赖树' },
      ]}
      value={exhibitInfoPage.graph_Viewport_Show}
      onChange={(value) => {
        onChange({ graph_Viewport_Show: value as 'relationship' });
      }}
    >
      {
        exhibitInfoPage.graph_FullScreen
          ? (<div style={{ height: 500 }} />)
          : (<>
            {/*{*/}
            {/*  exhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FAntvG6RelationshipGraph*/}
            {/*    nodes={exhibitInfoPage.graph_Viewport_RelationGraph_Nodes}*/}
            {/*    edges={exhibitInfoPage.graph_Viewport_RelationGraph_Edges}*/}
            {/*    width={860}*/}
            {/*  />)*/}
            {/*}*/}

            {
              exhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FGraph_Tree_Relationship_Exhibit
                exhibitID={exhibitInfoPage.exhibit_ID}
                version={exhibitInfoPage.side_Version}
                width={860}
                height={500}
              />)
            }


            {/*{*/}
            {/*  exhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FAntvG6AuthorizationGraph*/}
            {/*    nodes={exhibitInfoPage.graph_Viewport_AuthorizationGraph_Nodes}*/}
            {/*    edges={exhibitInfoPage.graph_Viewport_AuthorizationGraph_Edges}*/}
            {/*    width={860}*/}
            {/*  />)*/}
            {/*}*/}

            {
              exhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FGraph_Tree_Authorization_Exhibit
                exhibitID={exhibitInfoPage.exhibit_ID}
                version={exhibitInfoPage.side_Version}
                width={860}
                height={500}
              />)
            }

            {
              exhibitInfoPage.graph_Viewport_Show === 'dependency' && (<FGraph_Tree_Dependency_Exhibit
                exhibitID={exhibitInfoPage.exhibit_ID}
                version={exhibitInfoPage.side_Version}
                width={860}
                height={500}
              />)
            }

          </>)
      }
    </FViewportTabs>

    <FDrawer
      visible={exhibitInfoPage.graph_FullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        onChange({
          graph_FullScreen: false,
        });
      }}
    >

      <FViewportTabs
        options={[
          { value: 'relationship', label: FUtil1.I18n.message('quick_decision_map') },
          { value: 'authorization', label: '授权链视图' },
          { value: 'dependency', label: '依赖树' },
        ]}
        value={exhibitInfoPage.graph_Viewport_Show}
        onChange={(value) => {
          onChange({
            graph_Viewport_Show: value as 'relationship',
          });
        }}
      >
        {/*{*/}
        {/*  exhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FAntvG6RelationshipGraph*/}
        {/*    nodes={exhibitInfoPage.graph_Viewport_RelationGraph_Nodes}*/}
        {/*    edges={exhibitInfoPage.graph_Viewport_RelationGraph_Edges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}

        {
          exhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FGraph_Tree_Relationship_Exhibit
            exhibitID={exhibitInfoPage.exhibit_ID}
            version={exhibitInfoPage.side_Version}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {/*{*/}
        {/*  exhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FAntvG6AuthorizationGraph*/}
        {/*    nodes={exhibitInfoPage.graph_Viewport_AuthorizationGraph_Nodes}*/}
        {/*    edges={exhibitInfoPage.graph_Viewport_AuthorizationGraph_Edges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}
        {/*{console.log(exhibitInfoPage.side_Version, 'exhibitInfoPage.side_Version2390iojsdklf')}*/}
        {
          exhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FGraph_Tree_Authorization_Exhibit
            exhibitID={exhibitInfoPage.exhibit_ID}
            version={exhibitInfoPage.side_Version}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {
          exhibitInfoPage.graph_Viewport_Show === 'dependency' && (<FGraph_Tree_Dependency_Exhibit
            exhibitID={exhibitInfoPage.exhibit_ID}
            version={exhibitInfoPage.side_Version}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

      </FViewportTabs>
    </FDrawer>

  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Viewports);
