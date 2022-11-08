import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { Radio, Space } from 'antd';
import FVersionHandlerPopover from '@/components/FVersionHandlerPopover';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState, InformalNodeManagerPageModelState,
  // ReplaceInformExhibitState,
} from '@/models/connect';
import {
  ChangeAction,
  OnReplacerMountAction,
  OnReplacerOriginChangeAction,
  OnReplacerUnmountAction,
  FetchReplacerListAction,
  OnReplacerKeywordsChangeAction,
  OnReplacerListCheckedChangeAction, OnReplacerListVersionRangeChangeAction, OnReplacerBucketChangeAction,
} from '@/models/informalNodeManagerPage';
// import { FDown } from '@/components/FIcons';
import * as AHooks from 'ahooks';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';

interface ReplacerProps {
  dispatch: Dispatch,
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Replacer({ dispatch, informalNodeManagerPage }: ReplacerProps) {

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
          // origin: 'market',
        },
      });
    }
  }

  return (<>
    <div className={styles.replacerHeader}>
      {
        informalNodeManagerPage.replaceModal_Replacer_ResourceOptions.map((rr, ri) => {
          return (<React.Fragment key={rr.value}>
            {ri !== 0 && (<div style={{ width: 20 }} />)}
            <a
              className={informalNodeManagerPage.replaceModal_Replacer_Origin === rr.value ? styles.activated : ''}
              onClick={() => {
                dispatch<OnReplacerOriginChangeAction>({
                  type: 'informalNodeManagerPage/onReplacerOriginChange',
                  payload: {
                    value: rr.value,
                  },
                });
              }}
            >{rr.title}</a>
          </React.Fragment>);
        })
      }
    </div>

    {
      informalNodeManagerPage.replaceModal_Replacer_Origin === 'object' && (<>
        <div style={{ height: 15 }} />
        <div style={{ padding: '0 15px' }}>
          <FDropdownMenu
            options={informalNodeManagerPage.replaceModal_Replacer_BucketOptions}
            text={informalNodeManagerPage.replaceModal_Replacer_BucketOptions.find((b) => {
              return b.value === informalNodeManagerPage.replaceModal_Replacer_Bucket;
            })?.text || ''}
            onChange={(value) => {
              dispatch<OnReplacerBucketChangeAction>({
                type: 'informalNodeManagerPage/onReplacerBucketChange',
                payload: {
                  value: value,
                },
              });
            }}
          />
        </div>
      </>)
    }

    {/*<FSelect*/}
    {/*  value={informalNodeManagerPage.replaceModal_Replacer_Origin}*/}
    {/*  dataSource={[*/}
    {/*    ...informalNodeManagerPage.replaceModal_Replacer_ResourceOptions,*/}
    {/*    ...informalNodeManagerPage.replaceModal_Replacer_BucketOptions,*/}
    {/*  ]}*/}
    {/*  onChange={(value: string) => {*/}
    {/*    // onChange({replacerOrigin: value}, true);*/}
    {/*    dispatch<OnReplacerOriginChangeAction>({*/}
    {/*      type: 'informalNodeManagerPage/onReplacerOriginChange',*/}
    {/*      payload: {*/}
    {/*        value: value,*/}
    {/*      },*/}
    {/*    });*/}
    {/*  }}*/}
    {/*/>*/}
    <div style={{ height: 15 }} />

    <div className={styles.replacerBody}>
      <div className={styles.replacerFilter}>
        <FInput
          theme='dark'
          wrapClassName={styles.replacerFilterInput}
          value={informalNodeManagerPage.replaceModal_Replacer_Keywords}
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
      <div style={{ height: 15 }} />
      <Space size={10} direction='vertical' className={styles.replacerList}>
        {/*{console.log(informalNodeManagerPage.replaceModal_Replacer_ResourceList, 'replaceModal_Replacer_ResourceList0923jldsf')}*/}
        {
          informalNodeManagerPage.replaceModal_Replacer_ResourceList.map((rl) => {
            return (<div key={rl.id} className={styles.replacerListItem}>
              <Radio
                disabled={rl.disabled}
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
                    <FComponentsLib.FContentText
                      text={rl.name}
                      type='highlight'
                      style={{ width: 270 }}
                      singleRow
                    />
                  </div>
                  <div style={{ height: 2 }} />
                  <div>
                    {
                      rl.identity === 'resource'
                        ? (<FComponentsLib.FContentText
                          text={`${rl.type} | ${rl.latestVersion || '暂无版本'} | ${rl.updateTime}`}
                          type='additional2'
                        />)
                        : (<FComponentsLib.FContentText
                          text={`${rl.type || '未设置类型'} | ${rl.updateTime}`}
                          type='additional2'
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
                          <FComponentsLib.FTextBtn
                            type='default'
                            style={{ fontSize: 12 }}
                          >
                            {rl.versionRange || '最新版本'}
                            &nbsp;
                            <FComponentsLib.FIcons.FDown />
                          </FComponentsLib.FTextBtn>

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

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(Replacer);
