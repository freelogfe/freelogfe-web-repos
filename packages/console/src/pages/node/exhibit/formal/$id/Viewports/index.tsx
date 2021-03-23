import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/exhibitInfoPage";
import {FViewportTabs} from "@/components/FAntvG6";

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
      {/*<FAntvG6DependencyGraph*/}
      {/*  nodes={marketResourcePage.dependencyGraphNodes}*/}
      {/*  edges={marketResourcePage.dependencyGraphEdges}*/}
      {/*/>*/}
      <div className={styles.diagram}/>
    </FViewportTabs>

  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Viewports);
