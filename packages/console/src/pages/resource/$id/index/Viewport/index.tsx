import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";
import {FAntvG6AuthorizationGraph, FAntvG6DependencyGraph, FViewportTabs} from "@/components/FAntvG6";
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/marketResourcePage";
import FDrawer from "@/components/FDrawer";
import {FTextButton} from "@/components/FButton";

interface ViewportProps {
  dispatch: Dispatch;

  marketResourcePage: MarketResourcePageModelState;
}

function Viewport({dispatch, marketResourcePage}: ViewportProps) {

  async function onChange(payload: Partial<MarketResourcePageModelState>) {
    await dispatch<ChangeAction>({
      type: 'marketResourcePage/change',
      payload
    });
  }

  return (<>
    <div style={{height: 30}}/>
    <div>
      <div className={styles.title}>
        <FTitleText text={'相关视图'} type={'h4'}/>
        <FTextButton
          onClick={() => {
            onChange({
              graphFullScreen: true,
            });
          }}
        >全屏查看</FTextButton>
      </div>
      <div style={{height: 20}}/>
      <FViewportTabs
        options={[
          {label: '依赖树', value: 'dependency'},
          {label: '授权链', value: 'authorization'},
        ]}
        value={marketResourcePage.viewportGraphShow}
        onChange={(value) => {
          onChange({viewportGraphShow: value as 'dependency'});
        }}
      >
        {
          marketResourcePage.graphFullScreen
            ? (<div style={{height: 500}}/>)
            : (<>
              {
                marketResourcePage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph
                  nodes={marketResourcePage.dependencyGraphNodes}
                  edges={marketResourcePage.dependencyGraphEdges}
                />)
              }

              {
                marketResourcePage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph
                  nodes={marketResourcePage.authorizationGraphNodes}
                  edges={marketResourcePage.authorizationGraphEdges}
                />)
              }
            </>)
        }

      </FViewportTabs>
    </div>
    <div style={{height: 20}}/>

    <FDrawer
      visible={marketResourcePage.graphFullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        onChange({graphFullScreen: false});
      }}
    >
      <FViewportTabs
        options={[
          {label: '依赖树', value: 'dependency'},
          {label: '授权链', value: 'authorization'},
        ]}
        value={marketResourcePage.viewportGraphShow}
        onChange={(value) => {
          onChange({viewportGraphShow: value as 'dependency'});
        }}
      >
        {
          marketResourcePage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph
            nodes={marketResourcePage.dependencyGraphNodes}
            edges={marketResourcePage.dependencyGraphEdges}
          />)
        }

        {
          marketResourcePage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph
            nodes={marketResourcePage.authorizationGraphNodes}
            edges={marketResourcePage.authorizationGraphEdges}
          />)
        }

      </FViewportTabs>
    </FDrawer>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Viewport);
