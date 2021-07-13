import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {Radio, Space} from "antd";
import {FContentText} from "@/components/FText";
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import {FTextBtn} from "@/components/FButton";
import {connect, Dispatch} from 'dva';
import {
  ConnectState, InformalNodeManagerPageModelState,
  // ReplaceInformExhibitState,
} from "@/models/connect";
import {
  ChangeAction,
  OnReplacerMountAction,
  OnReplacerOriginChangeAction, OnReplacerUnmountAction, FetchReplacerListAction, OnReplacerKeywordsChangeAction
} from "@/models/informalNodeManagerPage";
// import {} from "@/models/replaceInformExhibitModal";
import FSelect from "@/components/FSelect";
import {FDown} from "@/components/FIcons";
import * as AHooks from 'ahooks';

interface ReplacerProps {
  dispatch: Dispatch,
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Replacer({dispatch, informalNodeManagerPage}: ReplacerProps) {

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
      type: 'informalNodeManagerPage/onReplacerMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnReplacerUnmountAction>({
      type: 'informalNodeManagerPage/onReplacerUnmount',
    });
  });


  async function onChange(value: Partial<InformalNodeManagerPageModelState>, loadData = false) {
    dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload: {
        ...value,
      },
    });
    if (loadData) {
      await dispatch<FetchReplacerListAction>({
        type: 'informalNodeManagerPage/fetchReplacerList',
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
        value={informalNodeManagerPage.replacerOrigin}
        dataSource={[
          ...informalNodeManagerPage.replacerResourceOptions,
          ...informalNodeManagerPage.replacerBucketOptions,
        ]}
        onChange={(value: string) => {
          // onChange({replacerOrigin: value}, true);
          dispatch<OnReplacerOriginChangeAction>({
            type: 'informalNodeManagerPage/onReplacerOriginChange',
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
          value={informalNodeManagerPage.replacerKeywords}
          debounce={300}
          onDebounceChange={(value) => {
            // console.log(value, 'value!@#$');
            // onChange({replacerKeywords: value}, true);
            dispatch<OnReplacerKeywordsChangeAction>({
              type: 'informalNodeManagerPage/onReplacerKeywordsChange',
              payload: {
                value: value,
              },
            });
          }}
        />
      </div>
      <div style={{height: 15}}/>
      <Space size={10} direction="vertical" className={styles.replacerList}>
        {
          informalNodeManagerPage.replacerResourceList.map((rl) => {
            return (<div key={rl.id} className={styles.replacerListItem}>
              <Radio
                checked={rl.name === informalNodeManagerPage.checkedResourceName}
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
                      rl.name === informalNodeManagerPage.checkedResourceName && rl.versions.length > 0 && (
                        <FVersionHandlerPopover
                          value={rl.version}
                          versionOptions={rl.versions}
                          allowEmpty
                          onChange={(version) => {
                            // console.log(version, '!!!!@2222222222');
                            onChange({
                              replacerResourceList: informalNodeManagerPage.replacerResourceList.map((rr) => {
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

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Replacer);
