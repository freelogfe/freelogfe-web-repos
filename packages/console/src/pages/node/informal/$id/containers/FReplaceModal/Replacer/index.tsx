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
  OnReplacerOriginChangeAction,
  OnReplacerUnmountAction,
  FetchReplacerListAction,
  OnReplacerKeywordsChangeAction,
  OnReplacerListCheckedChangeAction, OnReplacerListVersionRangeChangeAction
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
                // checked={rl.name === informalNodeManagerPage.replacerCheckedResourceName}
                checked={rl.checked}
                onClick={(e) => {
                  // onChange({replacerCheckedResourceName: rl.name})
                  dispatch<OnReplacerListCheckedChangeAction>({
                    type: 'informalNodeManagerPage/onReplacerListCheckedChange',
                    payload: {
                      id: rl.id,
                      // checked: true,
                    },
                  });
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
                      rl.checked && rl.versions.length > 0 && (
                        <FVersionHandlerPopover
                          value={rl.versionRange}
                          versionOptions={rl.versions}
                          allowEmpty
                          onChange={(version) => {
                            dispatch<OnReplacerListVersionRangeChangeAction>({
                              type: 'informalNodeManagerPage/onReplacerListVersionRangeChange',
                              payload: {
                                id: rl.id,
                                versionRange: version,
                              },
                            });
                          }}
                        >
                          <FTextBtn
                            type="default"
                            style={{fontSize: 12}}
                          >
                            {rl.versionRange || '最新版本'}
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
