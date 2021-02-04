import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {Radio, Space} from "antd";
import {FContentText, FTitleText} from "@/components/FText";
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import {FTextButton} from "@/components/FButton";
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
    console.log('@#SDFGDFXVXCZVXZCVSfd');
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
          ...storageHomePage.bucketList.map<AddInformExhibitDrawerModelState['addExhibitOptions'][number]>((b) => {
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
      {/*<a*/}
      {/*  className={replaceInformExhibit.replacerOrigin === 'market' ? styles.activated : ''}*/}
      {/*  onClick={() => {*/}
      {/*    onChange({replacerActivatedTab: 'market'});*/}
      {/*  }}*/}
      {/*>资源市场</a>*/}
      {/*<div style={{width: 20}}/>*/}
      {/*<a*/}
      {/*  className={informalNodeManagerPage.replacerActivatedTab === 'resource' ? styles.activated : ''}*/}
      {/*  onClick={() => {*/}
      {/*    onChange({replacerActivatedTab: 'resource'});*/}
      {/*  }}*/}
      {/*>我的资源</a>*/}
      {/*<div style={{width: 20}}/>*/}
      {/*<a*/}
      {/*  className={informalNodeManagerPage.replacerActivatedTab === 'collection' ? styles.activated : ''}*/}
      {/*  onClick={() => {*/}
      {/*    onChange({replacerActivatedTab: 'collection'});*/}
      {/*  }}*/}
      {/*>我的收藏</a>*/}
    </div>
    <div style={{height: 15}}/>
    <div className={styles.replacerBody}>
      <div className={styles.replacerFilter}>
        <FInput
          theme="dark"
          wrapClassName={styles.replacerFilterInput}
          value={replaceInformExhibit.replacedKeywords}
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
                    <FTitleText text={rl.name} type="h5"/>
                  </div>
                  <div style={{height: 2}}/>
                  <div>
                    <FContentText
                      text={`${rl.type} | ${rl.version || '暂无版本'} | ${rl.updateTime}`}
                      type="additional2"
                    />
                    <FVersionHandlerPopover
                      value={rl.version}
                      versionOptions={rl.versions}>
                      <FTextButton style={{fontSize: 12}}>选择版本</FTextButton>
                    </FVersionHandlerPopover>
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
