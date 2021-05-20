import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {Radio, Space} from "antd";
import {FContentText, FTitleText} from "@/components/FText";
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import {FTextBtn} from "@/components/FButton";
import {connect, Dispatch} from 'dva';
import {
  AddInformExhibitDrawerModelState,
  ConnectState,
  InformalNodeManagerPageModelState,
  ReplaceInformExhibitState, StorageHomePageModelState
} from "@/models/connect";
import {ChangeAction} from "@/models/replaceInformExhibitModal";
import {FetchReplacerListAction} from "@/models/replaceInformExhibitModal";
import {WholeMutable} from "@/models/shared";
import FSelect from "@/components/FSelect";
import {FetchAddExhibitListAction} from "@/models/addInformExhibitDrawer";

interface ReplacerProps {
  dispatch: Dispatch,
  replaceInformExhibit: ReplaceInformExhibitState;
  storageHomePage: StorageHomePageModelState;
}

function Replacer({dispatch, replaceInformExhibit, storageHomePage}: ReplacerProps) {

  React.useEffect(() => {
    // console.log('@#SDFGDFXVXCZVXZCVSfd');
    dispatch<FetchReplacerListAction>({
      type: 'replaceInformExhibit/fetchReplacerList',
    });
  }, []);


  async function onChange(value: Partial<ReplaceInformExhibitState>, loadData = false) {
    dispatch<ChangeAction>({
      type: 'replaceInformExhibit/change',
      payload: {
        ...value,
      },
    });
    if (loadData) {
      await dispatch<FetchReplacerListAction>({
        type: 'replaceInformExhibit/fetchReplacerList',
      });
    }
  }

  // async function onChange(value: Partial<AddInformExhibitDrawerModelState>, loadData: boolean = false) {
  //   await dispatch<ChangeAction>({
  //     type: 'addInformExhibitDrawer/change',
  //     payload: value,
  //   });
  //
  // }

  return (<>
    <div className={styles.replacerHeader}>
      <FSelect
        value={replaceInformExhibit.replacerOrigin}
        dataSource={[
          ...replaceInformExhibit.replacerOriginOptions as WholeMutable<ReplaceInformExhibitState['replacerOriginOptions']>,
          ...(storageHomePage.bucketList || []).map<AddInformExhibitDrawerModelState['addExhibitOptions'][number]>((b) => {
            return {
              value: b.bucketName,
              title: b.bucketName,
            };
          }),
        ]}
        onChange={(value) => {
          onChange({replacerOrigin: value}, true);
        }}
      />
    </div>
    <div style={{height: 15}}/>
    <div className={styles.replacerBody}>
      <div className={styles.replacerFilter}>
        <FInput
          theme="dark"
          wrapClassName={styles.replacerFilterInput}
          value={replaceInformExhibit.replacerKeywords}
          debounce={300}
          onDebounceChange={(value) => {
            // console.log(value, 'value!@#$');
            onChange({replacerKeywords: value}, true);
          }}
        />
      </div>
      <div style={{height: 15}}/>
      <Space size={10} direction="vertical" className={styles.replacerList}>
        {
          replaceInformExhibit.replacerResourceList.map((rl) => {
            return (<div key={rl.id} className={styles.replacerListItem}>
              <Radio
                checked={rl.name === replaceInformExhibit.checkedResourceName}
                onClick={() => {
                  onChange({checkedResourceName: rl.name})
                }}
              />
              <div className={styles.replacerListItemContent}>
                <div>
                  <div>
                    <FContentText text={rl.name} type="highlight"/>
                  </div>
                  <div style={{height: 2}}/>
                  <div>
                    <FContentText
                      text={`${rl.type} | ${rl.version || '暂无版本'} | ${rl.updateTime}`}
                      type="additional2"
                    />
                    {
                      rl.version && (<FVersionHandlerPopover
                        value={rl.version}
                        versionOptions={rl.versions}
                        onChange={() => {
                          // dispatch<ChangeAction>({
                          //   type: 'replaceInformExhibit/change'
                          // })
                        }}
                      >
                        <FTextBtn type="default" style={{fontSize: 12}}>选择版本</FTextBtn>
                      </FVersionHandlerPopover>)
                    }

                  </div>
                </div>

              </div>
            </div>);
          })
        }

      </Space>
    </div>
  </>);
}

export default connect(({replaceInformExhibit, storageHomePage}: ConnectState) => ({
  replaceInformExhibit,
  storageHomePage,
}))(Replacer);
