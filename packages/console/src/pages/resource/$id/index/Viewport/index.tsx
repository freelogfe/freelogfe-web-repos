import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";
import {FAntvG6DependencyGraph} from "@/components/FAntvG6";
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";

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
      <div className={styles.content}>
        <FAntvG6DependencyGraph
          nodes={marketResourcePage.dependencyGraphNodes}
          edges={marketResourcePage.dependencyGraphEdges}
        />
      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Viewport);
