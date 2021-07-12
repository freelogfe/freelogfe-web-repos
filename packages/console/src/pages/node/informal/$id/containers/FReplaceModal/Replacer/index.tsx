import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {Radio, Space} from "antd";
import {FContentText} from "@/components/FText";
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import {FTextBtn} from "@/components/FButton";
import {connect, Dispatch} from 'dva';
import {
  ConnectState,
  ReplaceInformExhibitState,
  StorageHomePageModelState,
} from "@/models/connect";
import {
  ChangeAction,
  OnReplacerMountAction,
  OnReplacerOriginChangeAction, OnReplacerUnmountAction
} from "@/models/replaceInformExhibitModal";
import {FetchReplacerListAction} from "@/models/replaceInformExhibitModal";
import FSelect from "@/components/FSelect";
import {FDown} from "@/components/FIcons";
import * as AHooks from 'ahooks';

interface ReplacerProps {
  dispatch: Dispatch,
  replaceInformExhibit: ReplaceInformExhibitState;
  storageHomePage: StorageHomePageModelState;
}

function Replacer({dispatch, replaceInformExhibit, storageHomePage}: ReplacerProps) {

  // AHooks.useMount(() => {
  //   console.log('replacer**************');
  // });

  // React.useEffect(() => {
  //   // console.log('@#SDFGDFXVXCZVXZCVSfd');
  //   dispatch<FetchReplacerListAction>({
  //     type: 'replaceInformExhibit/fetchReplacerList',
  //   });
  // }, []);

  AHooks.useMount(() => {
    dispatch<OnReplacerMountAction>({
      type: 'replaceInformExhibit/onReplacerMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnReplacerUnmountAction>({
      type: 'replaceInformExhibit/onReplacerUnmount',
    });
  });


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
        payload: {
          restart: false,
          origin: '!market',
        },
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
          ...replaceInformExhibit.replacerResourceOptions,
          ...replaceInformExhibit.replacerBucketOptions,
        ]}
        onChange={(value: string) => {
          // onChange({replacerOrigin: value}, true);
          dispatch<OnReplacerOriginChangeAction>({
            type: 'replaceInformExhibit/onReplacerOriginChange',
            payload: {
              value: value,
            },
          });
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
                    <FContentText
                      text={rl.name}
                      type="highlight"
                      style={{width: 270}}
                      singleRow
                    />
                  </div>
                  <div style={{height: 2}}/>
                  <div>
                    {
                      rl.identity === 'resource'
                        ? (<FContentText
                          text={`${rl.type} | ${rl.latestVersion || '暂无版本'} | ${rl.updateTime}`}
                          type="additional2"
                        />)
                        : (<FContentText
                          text={`${rl.type || '未设置类型'} | ${rl.updateTime}`}
                          type="additional2"
                        />)
                    }

                    {
                      rl.name === replaceInformExhibit.checkedResourceName && rl.versions.length > 0 && (
                        <FVersionHandlerPopover
                          value={rl.version}
                          versionOptions={rl.versions}
                          allowEmpty
                          onChange={(version) => {
                            // console.log(version, '!!!!@2222222222');
                            onChange({
                              replacerResourceList: replaceInformExhibit.replacerResourceList.map((rr) => {
                                if (rr.id !== rl.id) {
                                  return rr;
                                }
                                return {
                                  ...rr,
                                  version,
                                };
                              }),
                            });
                          }}
                        >
                          <FTextBtn
                            type="default"
                            style={{fontSize: 12}}
                          >
                            {rl.version ? rl.version : '选择版本'}
                            &nbsp;
                            <FDown/>
                          </FTextBtn>

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
