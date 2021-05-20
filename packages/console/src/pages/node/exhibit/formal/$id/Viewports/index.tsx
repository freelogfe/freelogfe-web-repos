import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/exhibitInfoPage";
import {
  FAntvG6AuthorizationGraph,
  FAntvG6DependencyGraph,
  FAntvG6RelationshipGraph,
  FViewportTabs
} from "@/components/FAntvG6";
import FDrawer from "@/components/FDrawer";
import {FTextBtn} from "@/components/FButton";

interface ViewportsProps {
  dispatch: Dispatch;

  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Viewports({dispatch, exhibitInfoPage}: ViewportsProps) {

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload,
    });
  }

  return (<div>
    <div className={styles.title}>
      <FTitleText text={'相关视图'} type="h3"/>
      <FTextBtn
        type="default"
        onClick={() => {
          onChange({
            graphFullScreen: true,
          });
        }}
      >全屏查看</FTextBtn>
    </div>
    <div style={{height: 20}}/>
    <FViewportTabs
      options={[
        {value: 'relationship', label: '展品关系树'},
        {value: 'authorization', label: '授权链视图'},
      ]}
      value={exhibitInfoPage.viewportGraphShow}
      onChange={(value) => {
        onChange({viewportGraphShow: value as 'relationship'});
      }}
    >
      {
        exhibitInfoPage.graphFullScreen || exhibitInfoPage.viewportGraphShow === 'relationship'
          ? (<div style={{height: 500}}/>)
          : (<>
            {/*{*/}
            {/*  exhibitInfoPage.viewportGraphShow === 'relationship' && (<FAntvG6RelationshipGraph*/}
            {/*    nodes={exhibitInfoPage.relationGraphNodes}*/}
            {/*    edges={exhibitInfoPage.relationGraphEdges}*/}
            {/*    width={860}*/}
            {/*  />)*/}
            {/*}*/}

            {
              exhibitInfoPage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph
                nodes={exhibitInfoPage.authorizationGraphNodes}
                edges={exhibitInfoPage.authorizationGraphEdges}
                width={860}
              />)
            }

          </>)
      }
    </FViewportTabs>

    <FDrawer
      visible={exhibitInfoPage.graphFullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        onChange({
          graphFullScreen: false,
        });
      }}
    >

      <FViewportTabs
        options={[
          {label: '关系树', value: 'relationship'},
          {label: '授权链', value: 'authorization'},
        ]}
        value={exhibitInfoPage.viewportGraphShow}
        onChange={(value) => {
          onChange({
            viewportGraphShow: value as 'relationship',
          });
        }}
      >
        {/*{*/}
        {/*  exhibitInfoPage.viewportGraphShow === 'relationship' && (<FAntvG6RelationshipGraph*/}
        {/*    nodes={exhibitInfoPage.relationGraphNodes}*/}
        {/*    edges={exhibitInfoPage.relationGraphEdges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}

        {
          exhibitInfoPage.viewportGraphShow === 'relationship' && (<div
            style={{
              width: window.innerWidth - 60,
              height: window.innerHeight - 60 - 70 - 50
            }}
          />)
        }

        {
          exhibitInfoPage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph
            nodes={exhibitInfoPage.authorizationGraphNodes}
            edges={exhibitInfoPage.authorizationGraphEdges}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

      </FViewportTabs>
    </FDrawer>

  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Viewports);
