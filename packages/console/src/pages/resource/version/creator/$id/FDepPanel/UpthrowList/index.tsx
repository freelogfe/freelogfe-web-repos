import * as React from 'react';
import styles from './index.less';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import FBasicUpcastCard from "@/components/FBasicUpcastCard";
import FUtil from "@/utils";

interface UpthrowListProps {
  creator: ResourceVersionCreatorPageModelState;
}

function UntrodList({creator: {dependencies}}: UpthrowListProps) {

  const labels = dependencies.filter((i) => i.upthrow);

  if (!labels || labels.length === 0) {
    return null;
  }

  return (<>
    <div style={{height: 20}}/>

    <FBasicUpcastCard
      dataSource={labels.map((l) => {
        return {
          resourceID: l.id,
          resourceName: l.title,
        };
      })}
      onClick={(resourceID) => {
        window.open(FUtil.LinkTo.resourceDetails({
          resourceID: resourceID,
        }));
      }}
    />
    {/*<div className={styles.depUpthrow}>*/}
    {/*  <div className={styles.tip}>*/}
    {/*    <FTitleText*/}
    {/*      text={FUtil.I18n.message('basic_upcast')}*/}
    {/*      type="h4"*/}
    {/*    />*/}
    {/*    <div style={{width: 5}}/>*/}
    {/*    <FInfo style={{color: '#C7C7C7'}}/>*/}
    {/*  </div>*/}
    {/*  <div className={styles.depUpthrowLabel}>*/}
    {/*    {*/}
    {/*      labels.map((j) => <label key={j}>{j}</label>)*/}
    {/*    }*/}
    {/*  </div>*/}
    {/*</div>*/}
  </>)
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(UntrodList);
