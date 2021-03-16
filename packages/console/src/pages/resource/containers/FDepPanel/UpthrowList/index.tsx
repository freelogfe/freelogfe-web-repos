import * as React from 'react';

import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {i18nMessage} from "@/utils/i18n";
import {FInfo} from "@/components/FIcons";

interface UpthrowListProps {
  // dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

function UpthrowList({creator: {dependencies}}: UpthrowListProps) {

  const labels = Array.from(new Set(dependencies.filter((i) => i.upthrow).map((j) => j.title)));

  if (!labels || labels.length === 0) {
    return null;
  }

  return (<>
    <div style={{height: 30}}/>
    <div className={styles.depUpthrow}>
      <div className={styles.tip}>
        <FTitleText
          text={i18nMessage('basic_upcast')}
          type="form"
        />
        <div style={{width: 5}}/>
        <FInfo style={{color: '#C7C7C7'}}/>
      </div>
      <div className={styles.depUpthrowLabel}>
        {
          labels.map((j) => <label key={j}>{j}</label>)
        }
      </div>
    </div>
  </>)
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(UpthrowList);
