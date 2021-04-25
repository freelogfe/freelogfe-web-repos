import * as React from 'react';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import FExpandable from "./FExpandable";

interface DescriptionProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Description({dispatch, marketResourcePage}: DescriptionProps) {

  if (!marketResourcePage.description || marketResourcePage.description === '<p></p>') {
    return null;
  }

  return (<>
    <div style={{height: 30}}/>
    <div className={styles.styles}>
      <FExpandable>
        {marketResourcePage.description && (<div
          // ref={refContainer}
          // style={{height: marketResourcePage.showAllDescription ? 'fit-content' : 300}}
          dangerouslySetInnerHTML={{__html: marketResourcePage.description}}
          className={styles.container}
        />)}
      </FExpandable>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Description);
