import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";
import {FAntvG6AuthorizationGraph, FAntvG6DependencyGraph, FViewportTabs} from "@/components/FAntvG6";
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";
import {Space} from "antd";
import {ChangeAction} from "@/models/marketResourcePage";

interface ViewportProps {
  dispatch: Dispatch;

  marketResourcePage: MarketResourcePageModelState;
}

function Viewport({dispatch, marketResourcePage}: ViewportProps) {
  return (<>
    <div style={{height: 30}}/>
    <div>
      <FTitleText text={'相关视图'} type={'h4'}/>
      <div style={{height: 20}}/>
      <FViewportTabs
        options={[
          {label: '依赖树', value: 'dependency'},
          {label: '授权链', value: 'authorization'},
        ]}
        value={marketResourcePage.viewportGraphShow}
        onChange={(value) => {
          dispatch<ChangeAction>({
            type: 'marketResourcePage/change',
            payload: {
              viewportGraphShow: value as 'dependency',
            },
          });
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
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Viewport);
