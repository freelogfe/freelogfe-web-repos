import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import Replacer from "./Replacer";
import Replaced from "./Replaced";
import FModal from "@/components/FModal";
import {SwapRightOutlined} from '@ant-design/icons';
import {connect, Dispatch} from 'dva';
import {ChangeAction, ReplaceInformExhibitState} from "@/models/replaceInformExhibitModal";
import {ConnectState} from "@/models/connect";

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
  visible?: boolean;

  onCancel?(): void;

  dispatch: Dispatch;
  replaceInformExhibit: ReplaceInformExhibitState;

  onConfirm?(value: IConfirmValue): void;
}

function FReplaceModal({visible, onCancel, onConfirm, dispatch, nodeID, replaceInformExhibit}: FReplaceModalProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'replaceInformExhibit/change',
      payload: {
        nodeID: nodeID,
      }
    })
  }, [nodeID]);

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
      disabled: !replaceInformExhibit.checkedResourceName || replaceInformExhibit.checkedKeys.length === 0,
    }}
    onOk={() => {
      const simplifiedResults: string[][] = simplifiedRelationship(replaceInformExhibit.checkedKeys as string[]).map<string[]>((r) => {
        return r.split('-');
      });
      console.log(simplifiedResults, 're90j23DSF@#AFSd0-_simplifiedResults');
      const resultObj: { [key: string]: ICandidate[][] } = {};
      for (const simplifiedResult of simplifiedResults) {
        resultObj[simplifiedResult[0]] = [];
      }
      for (const simplifiedResult of simplifiedResults) {
        const [key, ...arr] = simplifiedResult;
        // console.log(key, arr, '@#DASasiodfj_(UJLKjl;');
        if (arr.length === 0) {
          continue;
        }
        // console.log(arr, 'arr@#$R%DSFZ)_Jkl;sdafds');
        resultObj[key].push(arr.map((o: string) => {
          if (o.startsWith('$')) {
            return {
              name: o.replace('$', ''),
              type: 'resource',
              versionRange: 'latest',
            }
          } else {
            return {
              name: o.replace('#', ''),
              type: 'object',
              versionRange: 'latest',
            }
          }
        }));
      }
      // console.log(resultObj, 'resultObj@#AFDSFASD)(_&UOIJ:');
      const replacerData = replaceInformExhibit.replacerResourceList.find((rr) => {
        return rr.name === replaceInformExhibit.checkedResourceName;
      });
      // console.log(replacerData, 'replacerData234edf@#$SDF)(JLK');
      const results: IConfirmValue = [];
      for (const [exhibitName, scopes] of Object.entries(resultObj)) {
        results.push({
          exhibitName: exhibitName,
          replaced: {
            name: replaceInformExhibit.replacedSelectDependency?.name || '',
            versionRange: replaceInformExhibit.replacedVersion || 'latest',
            type: replaceInformExhibit.replacedSelectDependency?.type || 'object',
          },
          replacer: {
            name: replacerData?.name || '',
            versionRange: replacerData?.version || 'latest',
            type: replacerData?.identity || 'object',
          },
          scopes: scopes,
        });
      }
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

        <SwapRightOutlined
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
  console.log(relation, 'relation!!!!!@@@@@');
  let arr: string[] = [...relation].sort((a: string, b: string) => a.length - b.length);

  for (let i = 0; i < arr.length; i++) {
    const current: string = arr[i];
    arr = arr.filter((a) => {
      return a === current || !a.startsWith(current);
    })
  }
  return arr;
}
