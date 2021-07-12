import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import Replacer from "./Replacer";
import Replaced from "./Replaced";
import FModal from "@/components/FModal";
import {connect, Dispatch} from 'dva';
import {ChangeAction, OnReplaceModalConfirmAction, ReplaceInformExhibitState} from "@/models/replaceInformExhibitModal";
import {ConnectState} from "@/models/connect";
import FThickArrowRight from "@/components/FIcons/FThickArrowRight";
import * as AHooks from 'ahooks';

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

type IConfirmValue = {
  exhibitName: string;
  replaced: ICandidate;
  replacer: ICandidate;
  scopes: ICandidate[][];
}[];

interface FReplaceModalProps {
  nodeID: number;
  isTheme: boolean;
  visible?: boolean;

  onCancel?(): void;

  dispatch: Dispatch;
  replaceInformExhibit: ReplaceInformExhibitState;

  onConfirm?(value: IConfirmValue): void;
}

function FReplaceModal({visible, onCancel, onConfirm, dispatch, nodeID, isTheme, replaceInformExhibit}: FReplaceModalProps) {

  // AHooks.useMount(() => {
  //   // console.log('modal**************');
  //   console.log(nodeID, 'nodeIDnodeIDnodeID890upioj;ksadrf;sad');
  //   dispatch<ChangeAction>({
  //     type: 'replaceInformExhibit/change',
  //     payload: {
  //       nodeID: nodeID,
  //     },
  //   });
  // });

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'replaceInformExhibit/change',
      payload: {
        nodeID: nodeID,
      },
    });
  }, [nodeID]);

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'replaceInformExhibit/change',
      payload: {
        isTheme: isTheme,
      },
    });
  }, [isTheme]);

  return (<FModal
    title={null}
    width={947}
    visible={visible}
    closable={false}
    destroyOnClose
    onCancel={() => {
      onCancel && onCancel();
    }}
    okButtonProps={{
      disabled: !replaceInformExhibit.checkedResourceName || replaceInformExhibit.replacedCheckedKeys.length === 0,
    }}
    onOk={async () => {

      const results = await dispatch<OnReplaceModalConfirmAction>({
        type: 'replaceInformExhibit/onReplaceModalConfirm',
      });
      onConfirm && onConfirm(results);

    }}
  >
    <div className={styles.replaceHandler}>
      <div className={styles.replacer}>
        {/*<FTitleText type="h5" text={'选择替换资源'}/>*/}
        <FContentText type="highlight" text={'选择替换资源'}/>
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <Replacer/>
        </div>
      </div>
      <div className={styles.arrow}>
        <FThickArrowRight
          style={{fontSize: 36, fontWeight: 600, color: '#D8D8D8'}}
        />
      </div>
      <div className={styles.replaced}>
        <FContentText
          type="highlight"
          text={'选择被替换资源'}
        />
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <Replaced/>
        </div>
      </div>
    </div>
  </FModal>);
}

export default connect(({replaceInformExhibit}: ConnectState) => ({
  replaceInformExhibit,
}))(FReplaceModal);

function simplifiedRelationship(relation: string[]): string[] {
  // console.log(relation, 'relation!!!!!@@@@@');
  let arr: string[] = [...relation].sort((a: string, b: string) => a.length - b.length);

  for (let i = 0; i < arr.length; i++) {
    const current: string = arr[i];
    arr = arr.filter((a) => {
      return a === current || !a.startsWith(current);
    })
  }
  return arr;
}
