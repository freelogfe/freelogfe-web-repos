import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/exhibitInfoPage";

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
    <FTitleText text={'相关视图'} type="h3"/>
    <div style={{height: 20}}/>
    <div className={styles.Viewport}>
      <div className={styles.ViewportNavs}>
        <a
          className={exhibitInfoPage.viewportGraphShow === 'relationship' ? styles.active : ''}
          onClick={() => {
            onChange({
              viewportGraphShow: 'relationship',
            });
          }}
        >展品关系树</a>
        <div style={{width: 20}}/>
        <a
          className={exhibitInfoPage.viewportGraphShow === 'authorization' ? styles.active : ''}
          onClick={() => {
            onChange({
              viewportGraphShow: 'authorization',
            });
          }}
        >授权链视图</a>
        <div style={{width: 20}}/>
      </div>
      {/*<FAntvG6DependencyGraph*/}
      {/*  nodes={marketResourcePage.dependencyGraphNodes}*/}
      {/*  edges={marketResourcePage.dependencyGraphEdges}*/}
      {/*/>*/}
      <div className={styles.diagram}/>
    </div>
  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Viewports);
