import * as React from 'react';
import {Space} from "antd";
import {FRectBtn, FTextBtn} from "@/components/FButton";
import styles from "@/pages/node/informal/$id/Exhibit/index.less";
import FSelect from "@/components/FSelect";
import FInput from "@/components/FInput";
import FCheckbox from "@/components/FCheckbox";
import {FContentText} from "@/components/FText";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";
import FDrawer from "@/components/FDrawer";
import {connect, Dispatch} from 'dva';
import {
  ConnectState,
  InformalNodeManagerPageModelState,
} from '@/models/connect';
import {
  OnAddExhibitDrawerAfterVisibleChangeAction,
  OnAddExhibitDrawerCancelChangeAction,
  OnAddExhibitDrawerConfirmChangeAction,
  OnAddExhibitDrawerKeywordsChangeAction,
  OnAddExhibitDrawerListCheckedChangeAction,
  OnAddExhibitDrawerListLoadMoreAction,
  OnAddExhibitDrawerOriginChangeAction,
} from '@/models/informalNodeManagerPage';
import FUtil1 from '@/utils';
import FTooltip from '@/components/FTooltip';

interface AddInformExhibitDrawerProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function AddInformExhibitDrawer({dispatch, informalNodeManagerPage}: AddInformExhibitDrawerProps) {

  const containerRef = React.useRef<any>(null);

  return (<FDrawer
    title={informalNodeManagerPage.showPage === 'theme' ? FUtil1.I18n.message('import_test_theme') : '添加测试展品'}
    visible={informalNodeManagerPage.addExhibitDrawerVisible}
    topRight={<Space size={30}>
      <FTextBtn type="default" onClick={() => {
        dispatch<OnAddExhibitDrawerCancelChangeAction>({
          type: 'informalNodeManagerPage/onAddExhibitDrawerCancelChange',
        });
      }}>取消</FTextBtn>
      <FRectBtn
        onClick={() => {
          dispatch<OnAddExhibitDrawerConfirmChangeAction>({
            type: 'informalNodeManagerPage/onAddExhibitDrawerConfirmChange',
          });
        }}
        type="primary"
      >添加</FRectBtn>
    </Space>}
    onClose={() => {
      // onCancel && onCancel();
      // onChange({
      //   addExhibitDrawerVisible: false,
      // });
      dispatch<OnAddExhibitDrawerCancelChangeAction>({
        type: 'informalNodeManagerPage/onAddExhibitDrawerCancelChange',
      });
    }}
    afterVisibleChange={(visible) => {
      dispatch<OnAddExhibitDrawerAfterVisibleChangeAction>({
        type: 'informalNodeManagerPage/onAddExhibitDrawerAfterVisibleChange',
        payload: {
          visible,
        }
      });
    }}
  >
    <div ref={containerRef} className={styles.container}>
      <div className={styles.filter}>
        <FSelect
          value={informalNodeManagerPage.addExhibitDrawerSelectValue}
          dataSource={[
            ...informalNodeManagerPage.addExhibitDrawerResourceOptions,
            ...informalNodeManagerPage.addExhibitDrawerBucketOptions,
          ]}
          onChange={(value: string) => {
            dispatch<OnAddExhibitDrawerOriginChangeAction>({
              type: 'informalNodeManagerPage/onAddExhibitDrawerOriginChange',
              payload: {
                value: value,
              },
            });
          }}
        />
        <FInput
          value={informalNodeManagerPage.addExhibitDrawerInputValue}
          debounce={300}
          onDebounceChange={(value) => {
            dispatch<OnAddExhibitDrawerKeywordsChangeAction>({
              type: 'informalNodeManagerPage/onAddExhibitDrawerKeywordsChange',
              payload: {
                value: value,
              },
            });
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
                <FTooltip
                  title={l.disabledReason}
                  getPopupContainer={() => containerRef.current}
                  trigger="hover"
                  visible={l.disabled ? undefined : false}
                >
                  <div>
                    <FCheckbox
                      checked={l.checked}
                      disabled={l.disabled}
                      onChange={(e) => {
                        dispatch<OnAddExhibitDrawerListCheckedChangeAction>({
                          type: 'informalNodeManagerPage/onAddExhibitDrawerListCheckedChange',
                          payload: {
                            id: l.id,
                            checked: e.target.checked,
                          },
                        });
                      }}
                    />
                  </div>
                </FTooltip>

                <div style={{width: 15}}/>
                <div className={styles.itemContent}>
                  <div className={styles.itemName}>
                    <FContentText
                      singleRow
                      text={l.name}
                    />
                    <div style={{width: 5}}/>
                    {!l.disabledReason && l.status && <FResourceStatusBadge status={l.status}/>}
                    {l.disabledReason && <label className={styles.itemNameLabel}>{l.disabledReason}</label>}
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
                dispatch<OnAddExhibitDrawerListLoadMoreAction>({
                  type: 'informalNodeManagerPage/onAddExhibitDrawerListLoadMore',
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

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(AddInformExhibitDrawer);
