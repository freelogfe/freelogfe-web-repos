import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/exhibitInfoPage';
import {
  FViewportTabs,
} from '@/components/FAntvG6';
import FDrawer from '@/components/FDrawer';
import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';
import FGraph_Tree_Relationship_Exhibit from '@/components/FAntvG6/FGraph_Tree_Relationship_Exhibit';
import FGraph_Tree_Dependency_Exhibit from '@/components/FAntvG6/FGraph_Tree_Dependency_Exhibit';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FViewportCards_Exhibit from '@/components/FAntvG6/FViewportCards_Exhibit';

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

  if (!exhibitInfoPage.graphShow) {
    return null;
  }

  return (<div>
    <div className={styles.title}>
      <FComponentsLib.FTitleText text={FI18n.i18nNext.t('title_exhibit_maps')} type='h3' />
      {/*<FComponentsLib.FTextBtn*/}
      {/*  type='default'*/}
      {/*  onClick={() => {*/}
      {/*    onChange({*/}
      {/*      graph_FullScreen: true,*/}
      {/*    });*/}
      {/*  }}*/}
      {/*>全屏查看</FComponentsLib.FTextBtn>*/}
    </div>
    <div style={{ height: 20 }} />

    <FViewportCards_Exhibit
      exhibitID={exhibitInfoPage.exhibit_ID}
      version={exhibitInfoPage.side_Version}
      graphShow={['relationship', 'authorization', 'dependency']}
      onMount={({ hasData }) => {
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            graphShow: hasData,
          },
        });
      }}
    />
    {/*<FViewportTabs*/}
    {/*  options={[*/}
    {/*    { value: 'relationship', label: FI18n.i18nNext.t('quick_decision_map') },*/}
    {/*    { value: 'authorization', label: '授权链视图' },*/}
    {/*    { value: 'dependency', label: '依赖树' },*/}
    {/*  ]}*/}
    {/*  value={exhibitInfoPage.graph_Viewport_Show}*/}
    {/*  onChange={(value) => {*/}
    {/*    onChange({ graph_Viewport_Show: value as 'relationship' });*/}
    {/*  }}*/}
    {/*>*/}
    {/*  {*/}
    {/*    exhibitInfoPage.graph_FullScreen*/}
    {/*      ? (<div style={{ height: 500 }} />)*/}
    {/*      : (<>*/}

    {/*        {*/}
    {/*          exhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FGraph_Tree_Relationship_Exhibit*/}
    {/*            exhibitID={exhibitInfoPage.exhibit_ID}*/}
    {/*            version={exhibitInfoPage.side_Version}*/}
    {/*            width={860}*/}
    {/*            height={500}*/}
    {/*          />)*/}
    {/*        }*/}

    {/*        {*/}
    {/*          exhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FGraph_Tree_Authorization_Exhibit*/}
    {/*            exhibitID={exhibitInfoPage.exhibit_ID}*/}
    {/*            version={exhibitInfoPage.side_Version}*/}
    {/*            width={860}*/}
    {/*            height={500}*/}
    {/*          />)*/}
    {/*        }*/}

    {/*        {*/}
    {/*          exhibitInfoPage.graph_Viewport_Show === 'dependency' && (<FGraph_Tree_Dependency_Exhibit*/}
    {/*            exhibitID={exhibitInfoPage.exhibit_ID}*/}
    {/*            version={exhibitInfoPage.side_Version}*/}
    {/*            width={860}*/}
    {/*            height={500}*/}
    {/*          />)*/}
    {/*        }*/}

    {/*      </>)*/}
    {/*  }*/}
    {/*</FViewportTabs>*/}

    {/*<FDrawer*/}
    {/*  open={exhibitInfoPage.graph_FullScreen}*/}
    {/*  title={'相关视图'}*/}
    {/*  destroyOnClose*/}
    {/*  width={'100%'}*/}
    {/*  onClose={() => {*/}
    {/*    onChange({*/}
    {/*      graph_FullScreen: false,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*>*/}

    {/*  <FViewportTabs*/}
    {/*    options={[*/}
    {/*      { value: 'relationship', label: FI18n.i18nNext.t('quick_decision_map') },*/}
    {/*      { value: 'authorization', label: '授权链视图' },*/}
    {/*      { value: 'dependency', label: '依赖树' },*/}
    {/*    ]}*/}
    {/*    value={exhibitInfoPage.graph_Viewport_Show}*/}
    {/*    onChange={(value) => {*/}
    {/*      onChange({*/}
    {/*        graph_Viewport_Show: value as 'relationship',*/}
    {/*      });*/}
    {/*    }}*/}
    {/*  >*/}

    {/*    {*/}
    {/*      exhibitInfoPage.graph_Viewport_Show === 'relationship' && (<FGraph_Tree_Relationship_Exhibit*/}
    {/*        exhibitID={exhibitInfoPage.exhibit_ID}*/}
    {/*        version={exhibitInfoPage.side_Version}*/}
    {/*        width={window.innerWidth - 60}*/}
    {/*        height={window.innerHeight - 60 - 70 - 50}*/}
    {/*      />)*/}
    {/*    }*/}

    {/*    {*/}
    {/*      exhibitInfoPage.graph_Viewport_Show === 'authorization' && (<FGraph_Tree_Authorization_Exhibit*/}
    {/*        exhibitID={exhibitInfoPage.exhibit_ID}*/}
    {/*        version={exhibitInfoPage.side_Version}*/}
    {/*        width={window.innerWidth - 60}*/}
    {/*        height={window.innerHeight - 60 - 70 - 50}*/}
    {/*      />)*/}
    {/*    }*/}

    {/*    {*/}
    {/*      exhibitInfoPage.graph_Viewport_Show === 'dependency' && (<FGraph_Tree_Dependency_Exhibit*/}
    {/*        exhibitID={exhibitInfoPage.exhibit_ID}*/}
    {/*        version={exhibitInfoPage.side_Version}*/}
    {/*        width={window.innerWidth - 60}*/}
    {/*        height={window.innerHeight - 60 - 70 - 50}*/}
    {/*      />)*/}
    {/*    }*/}

    {/*  </FViewportTabs>*/}
    {/*</FDrawer>*/}

  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Viewports);
