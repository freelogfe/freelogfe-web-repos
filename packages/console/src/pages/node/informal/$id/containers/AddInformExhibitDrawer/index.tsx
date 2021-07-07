import * as React from 'react';
import {Space} from "antd";
import {FRectBtn, FTextBtn} from "@/components/FButton";
import styles from "@/pages/node/informal/$id/Exhibit/index.less";
import FSelect from "@/components/FSelect";
import {WholeMutable} from "@/models/shared";
import FInput from "@/components/FInput";
import FCheckbox from "@/components/FCheckbox";
import {FContentText} from "@/components/FText";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";
import FDrawer from "@/components/FDrawer";
import {connect, Dispatch} from 'dva';
import {
  // AddInformExhibitDrawerModelState,
  ConnectState,
  InformalNodeManagerPageModelState,
  StorageHomePageModelState
} from '@/models/connect';
import {
  ChangeAction,
  FetchAddExhibitDrawerListAction,
  FetchExhibitListAction,
  SaveDataRulesAction
} from '@/models/informalNodeManagerPage';
import FUtil1 from '@/utils';
import FTooltip from '@/components/FTooltip';
import {FUtil} from "@freelog/tools-lib";

interface AddInformExhibitDrawerProps {
  // nodeID: number;
  // visible?: boolean;
  // isTheme?: boolean;
  // disabledResourceNames?: string[];
  // disabledObjectNames?: string[];

  // onCancel?(): void;

  // onConfirm?(value: { identity: 'resource' | 'object'; names: string[]; }): void;

  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
  // storageHomePage: StorageHomePageModelState;

}

function AddInformExhibitDrawer({dispatch, informalNodeManagerPage}: AddInformExhibitDrawerProps) {

  const containerRef = React.useRef<any>(null);

  // async function init() {
  //
  //   await dispatch<FetchAddExhibitDrawerListAction>({
  //     type: 'informalNodeManagerPage/fetchAddExhibitDrawerList',
  //     payload: true,
  //   });
  // }

  async function onChange(value: Partial<InformalNodeManagerPageModelState>, loadData: boolean = false) {
    await dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload: value,
    });
    if (loadData) {
      // console.log('!@#$!@#$!@#$11111111');
      await dispatch<FetchAddExhibitDrawerListAction>({
        type: 'informalNodeManagerPage/fetchAddExhibitDrawerList',
        payload: true,
      });
    }
  }

  function onClickConfirm() {
    let identity: 'resource' | 'object' = 'resource';
    if (!informalNodeManagerPage.addExhibitDrawerSelectValue.startsWith('!')) {
      identity = 'object';
    }
    const value: { identity: 'resource' | 'object'; names: string[]; } = {
      identity,
      names: informalNodeManagerPage.addExhibitDrawerCheckedList
        .filter((ex) => ex.checked)
        .map<string>((ex) => {
          return ex.name;
        }),
    };
    // onConfirm && onConfirm(value);

    onChange({
      addExhibitDrawerVisible: false,
    });
    dispatch<SaveDataRulesAction>({
      type: 'informalNodeManagerPage/saveDataRules',
      payload: {
        type: 'append',
        data: value.names.map((n) => {
          return {
            operation: 'add',
            exhibitName: n.split('/')[1] + `_${FUtil.Tool.generateRandomCode()}`,
            candidate: {
              name: n,
              versionRange: 'latest',
              type: value.identity,
            },
          };
        }),
      },
    });
    dispatch<FetchExhibitListAction>({
      type: 'informalNodeManagerPage/fetchExhibitList',
      payload: {
        isRematch: false,
      },
    });
  }

  return (<FDrawer
    title={informalNodeManagerPage.showPage === 'theme' ? FUtil1.I18n.message('import_test_theme') : '添加测试展品'}
    // visible={informalNodeManagerPage.addExhibitDrawerVisible}
    visible={informalNodeManagerPage.addExhibitDrawerVisible}
    topRight={<Space size={30}>
      <FTextBtn type="default" onClick={() => {
        // onCancel && onCancel();
        onChange({
          addExhibitDrawerVisible: false,
        });
      }}>取消</FTextBtn>
      <FRectBtn
        onClick={() => {
          onClickConfirm();
        }}
        type="primary"
      >添加</FRectBtn>
    </Space>}
    onClose={() => {
      // onCancel && onCancel();
      onChange({
        addExhibitDrawerVisible: false,
      });
    }}
    afterVisibleChange={(visible) => {
      if (visible) {
        dispatch<FetchAddExhibitDrawerListAction>({
          type: 'informalNodeManagerPage/fetchAddExhibitDrawerList',
          payload: true,
        });
      } else {
        onChange({
          addExhibitDrawerSelectValue: '!market',
          addExhibitDrawerInputValue: '',
          addExhibitDrawerCheckedList: [],
          addExhibitDrawerCheckedListTotalNum: -1,
        });
      }
    }}
  >
    <div ref={containerRef} className={styles.container}>
      <div className={styles.filter}>
        <FSelect
          value={informalNodeManagerPage.addExhibitDrawerSelectValue}
          dataSource={[
            ...informalNodeManagerPage.addExhibitDrawerOptions as WholeMutable<InformalNodeManagerPageModelState['addExhibitDrawerOptions']>,
            // ...(storageHomePage.bucketList || []).map<AddInformExhibitDrawerModelState['addExhibitOptions'][number]>((b) => {
            //   return {
            //     value: b.bucketName,
            //     title: b.bucketName,
            //   };
            // }),
          ]}
          onChange={(value: any) => {
            onChange({addExhibitDrawerSelectValue: value}, true);
          }}
        />
        <FInput
          value={informalNodeManagerPage.addExhibitDrawerInputValue}
          debounce={300}
          onDebounceChange={(value) => {
            onChange({addExhibitDrawerInputValue: value}, true);
          }}
          onChange={(e) => {
            // onChange({addExhibitInputValue: e.target.value}, true);
          }}
          theme="dark"
        />
      </div>
      <div style={{height: 15}}/>
      <div className={styles.list}>
        {
          informalNodeManagerPage.addExhibitDrawerCheckedList
            .map((l, i, arr) => {
              return (<div key={l.id} className={styles.item}>
                {
                  !!l.disabledReason
                    ? (<FTooltip
                      title={l.disabledReason}
                      getPopupContainer={() => containerRef.current}
                      trigger="hover"
                    >
                      <div>
                        <FCheckbox
                          checked={l.checked}
                          disabled={l.disabled}
                          onChange={(e) => {
                            onChange({
                              addExhibitDrawerCheckedList: arr.map((a) => {
                                if (a.id !== l.id) {
                                  return a;
                                }
                                return {
                                  ...a,
                                  checked: e.target.checked,
                                };
                              }),
                            });
                          }}
                        />
                      </div>
                    </FTooltip>)
                    : (<FCheckbox
                      checked={l.checked}
                      disabled={l.disabled}
                      onChange={(e) => {
                        onChange({
                          addExhibitDrawerCheckedList: arr.map((a) => {
                            if (a.id !== l.id) {
                              return a;
                            }
                            return {
                              ...a,
                              checked: e.target.checked,
                            };
                          }),
                        });
                      }}
                    />)
                }

                <div style={{width: 15}}/>
                <div className={styles.itemContent}>
                  <div className={styles.itemName}>
                    <FContentText
                      singleRow
                      text={l.name}
                    />
                    <div style={{width: 5}}/>
                    {l.status && <FResourceStatusBadge status={l.status}/>}
                  </div>
                  <div style={{height: 2}}/>
                  <FContentText
                    text={(l.type ? `资源类型 ${l.type}` : '未设置类型') + ` | 更新时间 ${l.updateTime}`}
                    type="additional2"
                  />
                </div>
              </div>);
            })
        }

      </div>

      <div style={{height: 20}}/>
      <div className={styles.footer}>
        {
          informalNodeManagerPage.addExhibitDrawerCheckedListTotalNum > informalNodeManagerPage.addExhibitDrawerCheckedList.length
            ? (<FRectBtn
              onClick={() => {
                dispatch<FetchAddExhibitDrawerListAction>({
                  type: 'informalNodeManagerPage/fetchAddExhibitDrawerList',
                  payload: false,
                });
              }}
              size="small"
            >加载更多</FRectBtn>)
            : (<FContentText type="additional1" text={'没有更多了~'}/>)
        }
      </div>
    </div>
  </FDrawer>);
}

export default connect(({informalNodeManagerPage, storageHomePage}: ConnectState) => ({
  informalNodeManagerPage,
  storageHomePage,
}))(AddInformExhibitDrawer);
