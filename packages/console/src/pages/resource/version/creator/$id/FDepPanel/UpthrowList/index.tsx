import * as React from 'react';
import styles from './index.less';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import FBasicUpcastCard from "@/components/FBasicUpcastCard";
import {FUtil} from '@freelog/tools-lib';

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
  </>)
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(UntrodList);
