import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/exhibitInfoPage';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FViewportCards_Exhibit from '@/components/FAntvG6/FViewportCards_Exhibit';

interface ViewportsProps {
  dispatch: Dispatch;

  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Viewports({ dispatch, exhibitInfoPage }: ViewportsProps) {

  // async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
  //   await dispatch<ChangeAction>({
  //     type: 'exhibitInfoPage/change',
  //     payload,
  //   });
  // }

  if (!exhibitInfoPage.graphShow) {
    return null;
  }

  return (<FViewportCards_Exhibit
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
  />);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Viewports);
