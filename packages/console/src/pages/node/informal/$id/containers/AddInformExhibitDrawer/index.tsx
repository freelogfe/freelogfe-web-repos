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
import {AddInformExhibitDrawerModelState, ConnectState, StorageHomePageModelState} from "@/models/connect";
import {ChangeAction, FetchAddExhibitListAction} from "@/models/addInformExhibitDrawer";
import FUtil1 from "@/utils";

interface AddInformExhibitDrawerProps {
  visible?: boolean;
  isTheme?: boolean;
  disabledResourceNames?: string[];
  disabledObjectNames?: string[];

  onCancel?(): void;

  onConfirm?(value: { identity: 'resource' | 'object'; names: string[]; }): void;

  dispatch: Dispatch;
  addInformExhibitDrawer: AddInformExhibitDrawerModelState;
  storageHomePage: StorageHomePageModelState;
}

function AddInformExhibitDrawer({visible = false, isTheme = false, disabledResourceNames = [], disabledObjectNames = [], onCancel, onConfirm, dispatch, addInformExhibitDrawer, storageHomePage}: AddInformExhibitDrawerProps) {

  // React.useEffect(() => {
  //   init();
  // }, []);

  async function init() {
    await onChange({
      isTheme,
      disabledResourceNames,
      disabledObjectNames,
    });

    await dispatch<FetchAddExhibitListAction>({
      type: 'addInformExhibitDrawer/fetchAddExhibitList',
      payload: true,
    });
  }

  async function onChange(value: Partial<AddInformExhibitDrawerModelState>, loadData: boolean = false) {
    await dispatch<ChangeAction>({
      type: 'addInformExhibitDrawer/change',
      payload: value,
    });
    if (loadData) {
      // console.log('!@#$!@#$!@#$11111111');
      await dispatch<FetchAddExhibitListAction>({
        type: 'addInformExhibitDrawer/fetchAddExhibitList',
        payload: true,
      });
    }
  }

  function onClickConfirm() {
    let identity: 'resource' | 'object' = 'resource';
    if (!addInformExhibitDrawer.addExhibitSelectValue.startsWith('!')) {
      identity = 'object';
    }
    const value: { identity: 'resource' | 'object'; names: string[]; } = {
      identity,
      names: addInformExhibitDrawer.addExhibitCheckedList
        .filter((ex) => ex.checked)
        .map<string>((ex) => {
          return ex.name;
        }),
    };
    // onCancel && onCancel();
    onConfirm && onConfirm(value);
  }

  return (<FDrawer
    title={isTheme ? FUtil1.I18n.message('import_test_theme') : '添加测试展品'}
    // visible={informalNodeManagerPage.addExhibitDrawerVisible}
    visible={visible}
    topRight={<Space size={30}>
      <FTextBtn type="default" onClick={() => {
        onCancel && onCancel();
      }}>取消</FTextBtn>
      <FRectBtn
        onClick={() => {
          onClickConfirm();
        }}
        type="primary"
      >添加</FRectBtn>
    </Space>}
    onClose={() => {
      onCancel && onCancel();
      // onChange({addExhibitDrawerVisible: false});
    }}
    afterVisibleChange={(visible) => {
      if (visible) {
        init();
      } else {
        onChange({
          addExhibitSelectValue: '!market',
          addExhibitInputValue: '',
          addExhibitCheckedList: [],
          listLength: -1,
        });
      }

    }}
  >
    <div className={styles.filter}>
      <FSelect
        value={addInformExhibitDrawer.addExhibitSelectValue}
        dataSource={[
          ...addInformExhibitDrawer.addExhibitOptions as WholeMutable<AddInformExhibitDrawerModelState['addExhibitOptions']>,
          ...(storageHomePage.bucketList || []).map<AddInformExhibitDrawerModelState['addExhibitOptions'][number]>((b) => {
            return {
              value: b.bucketName,
              title: b.bucketName,
            };
          }),
        ]}
        onChange={(value: any) => {
          onChange({addExhibitSelectValue: value}, true);
        }}
      />
      <FInput
        value={addInformExhibitDrawer.addExhibitInputValue}
        debounce={300}
        onDebounceChange={(value) => {
          onChange({addExhibitInputValue: value}, true);
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
        addInformExhibitDrawer.addExhibitCheckedList
          .map((l, i, arr) => {
            return (<div key={l.id} className={styles.item}>
              <FCheckbox
                checked={l.checked}
                disabled={l.disabled}
                onChange={(e) => {
                  onChange({
                    addExhibitCheckedList: arr.map((a) => {
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
        addInformExhibitDrawer.listLength > addInformExhibitDrawer.addExhibitCheckedList.length
          ? (<FRectBtn
            onClick={() => {
              dispatch<FetchAddExhibitListAction>({
                type: 'addInformExhibitDrawer/fetchAddExhibitList',
                payload: false,
              });
            }}
            size="small"
          >加载更多</FRectBtn>)
          : (<FContentText type="additional1" text={'没有更多了~'}/>)
      }
    </div>
  </FDrawer>);
}

export default connect(({addInformExhibitDrawer, storageHomePage}: ConnectState) => ({
  addInformExhibitDrawer,
  storageHomePage,
}))(AddInformExhibitDrawer);
