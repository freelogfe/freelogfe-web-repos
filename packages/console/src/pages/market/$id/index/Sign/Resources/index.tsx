import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState} from "@/models/connect";

interface ResourcesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Resources({dispatch, marketResourcePage}: ResourcesProps) {
  return (<>
    <div className={styles.signLeftNav}>选择主资源授权策略</div>
    {
      marketResourcePage.signResources.filter((r, i) => i === 0)
        .map((r) => (<a
          key={r.id}
          className={styles.signResource + ' ' + styles.activatedSignResource}
        >
          <FTitleText
            type="h5"
            text={r.name}
            singleRow
          />
          <div style={{height: 5}}/>
          <FContentText
            type="additional2"
            text={r.type}
          />
          <div style={{height: 5}}/>
          <div className={styles.policeTags}>
            {
              r.policies?.filter((p) => p.checked)
                .map((p) => (<label key={p.id}>{p.name}</label>))
            }
          </div>
        </a>))
    }

    {
      marketResourcePage.signResources.length > 1 && (<div className={styles.signLeftNav}>选择基础上抛授权策略</div>)
    }

    {
      marketResourcePage.signResources.filter((r, i) => i !== 0)
        .map((r) => (<a className={styles.signResource} key={r.id}>
          <FTitleText
            type="h5"
            text={r.name}
            singleRow
          />
          <div style={{height: 5}}/>
          <FContentText
            type="additional2"
            text={r.type}
          />
          <div style={{height: 5}}/>
          <div className={styles.policeTags}>
            {
              r.policies?.filter((p) => p.checked)
                .map((p) => (<label key={p.id}>{p.name}</label>))
            }
          </div>
        </a>))
    }
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Resources);
