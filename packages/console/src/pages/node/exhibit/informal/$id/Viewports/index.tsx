import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '@/components/FText';
import FUtil1 from '@/utils';
import { FTextBtn } from '@/components/FButton';
import {
  FAntvG6AuthorizationGraph,
  FAntvG6DependencyGraph,
  FAntvG6RelationshipGraph,
  FViewportTabs,
} from '@/components/FAntvG6';
import FDrawer from '@/components/FDrawer';
import {
  ChangeAction,
  InformExhibitInfoPageModelState, OnCancel_Graph_FullScreenDrawer_Action, OnChange_Graph_Tab_Action,
  OnClick_Graph_FullScreenBtn_Action,
} from '@/models/informExhibitInfoPage';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';

interface ViewportsProps {
  dispatch: Dispatch;

  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

const tabOptions = [
  { label: '展品关系树', value: 'relationship' },
  { label: '授权链视图', value: 'authorization' },
  { label: '依赖树', value: 'dependency' },
];

function Viewports({ dispatch, informExhibitInfoPage }: ViewportsProps) {

  // async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
  //   await dispatch<ChangeAction>({
  //     type: 'exhibitInfoPage/change',
  //     payload,
  //   });
  // }

  return (<div>
    <div className={styles.title}>
      <FTitleText text={FUtil1.I18n.message('title_exhibit_maps')} type='h3' />
      <FTextBtn
        type='default'
        onClick={() => {
          dispatch<OnClick_Graph_FullScreenBtn_Action>({
            type: 'informExhibitInfoPage/onClick_Graph_FullScreenBtn',
          });
        }}
      >全屏查看</FTextBtn>
    </div>
    <div style={{ height: 20 }} />
    <FViewportTabs
      // options={[
      //   { value: 'relationship', label: FUtil1.I18n.message('quick_decision_map') },
      //   { value: 'authorization', label: '授权链视图' },
      //   { value: 'dependency', label: '授权链视图' },
      // ]}
      options={tabOptions}
      value={informExhibitInfoPage.graph_Viewport_Show}
      onChange={(value: 'relationship') => {
        // onChange({ graph_Viewport_Show: value as 'relationship' });
        dispatch<OnChange_Graph_Tab_Action>({
          type: 'informExhibitInfoPage/onChange_Graph_Tab',
          payload: {
            value: value,
          },
        });
      }}
    >
      {
        informExhibitInfoPage.graph_FullScreen
          ? (<div style={{ height: 500 }} />)
          : (<>
            {
              informExhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FAntvG6RelationshipGraph
                nodes={informExhibitInfoPage.graph_Viewport_RelationGraph_Nodes}
                edges={informExhibitInfoPage.graph_Viewport_RelationGraph_Edges}
                width={860}
              />)
            }

            {
              informExhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FAntvG6AuthorizationGraph
                nodes={informExhibitInfoPage.graph_Viewport_AuthorizationGraph_Nodes}
                edges={informExhibitInfoPage.graph_Viewport_AuthorizationGraph_Edges}
                width={860}
              />)
            }

            {
              informExhibitInfoPage.graph_Viewport_Show === 'dependency' && (<FAntvG6DependencyGraph
                nodes={informExhibitInfoPage.graph_Viewport_DependencyGraph_Nodes}
                edges={informExhibitInfoPage.graph_Viewport_DependencyGraph_Edges}
                width={860}
              />)
            }

          </>)
      }
    </FViewportTabs>

    <FDrawer
      visible={informExhibitInfoPage.graph_FullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        dispatch<OnCancel_Graph_FullScreenDrawer_Action>({
          type: 'informExhibitInfoPage/onCancel_Graph_FullScreenDrawer',
        });
      }}
    >

      <FViewportTabs
        options={tabOptions}
        value={informExhibitInfoPage.graph_Viewport_Show}
        onChange={(value: 'relationship') => {
          dispatch<OnChange_Graph_Tab_Action>({
            type: 'informExhibitInfoPage/onChange_Graph_Tab',
            payload: {
              value: value,
            },
          });
        }}
      >
        {
          informExhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FAntvG6RelationshipGraph
            nodes={informExhibitInfoPage.graph_Viewport_RelationGraph_Nodes}
            edges={informExhibitInfoPage.graph_Viewport_RelationGraph_Edges}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {
          informExhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FAntvG6AuthorizationGraph
            nodes={informExhibitInfoPage.graph_Viewport_AuthorizationGraph_Nodes}
            edges={informExhibitInfoPage.graph_Viewport_AuthorizationGraph_Edges}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {
          informExhibitInfoPage.graph_Viewport_Show === 'dependency' && (<FAntvG6DependencyGraph
            nodes={informExhibitInfoPage.graph_Viewport_DependencyGraph_Nodes}
            edges={informExhibitInfoPage.graph_Viewport_DependencyGraph_Edges}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

      </FViewportTabs>
    </FDrawer>

  </div>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Viewports);
