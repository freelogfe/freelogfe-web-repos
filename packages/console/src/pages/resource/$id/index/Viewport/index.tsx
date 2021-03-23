import * as React from "react";
import {FTitleText} from "@/components/FText";
import styles from "./index.less";
import {FAntvG6DependencyGraph} from "@/components/FAntvG6";
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
      <div className={styles.content}>
        <div className={styles.navs}>
          <a
            className={marketResourcePage.dependencyGraphShow === 'dependency' ? styles.active : ''}
            onClick={() => {
              dispatch<ChangeAction>({
                type: 'marketResourcePage/change',
                payload: {
                  dependencyGraphShow: 'dependency',
                },
              });
            }}
          >依赖树</a>
          <div style={{width: 20}}/>
          <a
            className={marketResourcePage.dependencyGraphShow === 'authorization' ? styles.active : ''}
            onClick={() => {
              dispatch<ChangeAction>({
                type: 'marketResourcePage/change',
                payload: {
                  dependencyGraphShow: 'authorization',
                },
              });
            }}
          >授权链视图</a>
        </div>
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
