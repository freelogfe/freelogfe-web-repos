import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FTitleText} from "@/components/FText";
import {Space} from "antd";
import FInput from "@/components/FInput";
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";
import {FTextBtn} from "@/components/FButton";
import FAdd from "@/components/FIcons/FAdd";
import FDropdownMenu from "@/components/FDropdownMenu";
import FInfiniteScroll from "@/components/FInfiniteScroll";
import {connect, Dispatch} from 'dva';
import {
  ConnectState,
  InformalNodeManagerPageModelState,
} from "@/models/connect";
import {

  OnChangeExhibitKeywordsAction,
  OnChangeExhibitStatusAction,
  OnChangeExhibitTypeAction,
  OnClickExhibitsAddBtnAction,
  OnClickExhibitsReplaceBtnAction,
  OnLoadMoreExhibitsAction,
  OnMountExhibitPageAction,
} from "@/models/informalNodeManagerPage";
import ExhibitTable from "./ExhibitTable";
import FLoadingTip from "@/components/FLoadingTip";
import {FDown} from "@/components/FIcons";
import * as AHooks from 'ahooks';
import FUtil1 from '@/utils';

interface ExhibitProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Exhibit({dispatch, informalNodeManagerPage}: ExhibitProps) {

  AHooks.useMount(() => {
    dispatch<OnMountExhibitPageAction>({
      type: 'informalNodeManagerPage/onMountExhibitPage',
    });
  });

  AHooks.useUnmount(() => {

  });

  if (informalNodeManagerPage.exhibit_ListState === 'loading') {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  return (<>
    {
      // informalNodeManagerPage.exhibitPageExhibitList.length === 0 && informalNodeManagerPage.exhibitPageSelectedType === '-1' && informalNodeManagerPage.exhibitPageSelectedStatus === '2' && informalNodeManagerPage.exhibitPageFilterKeywords === ''
      informalNodeManagerPage.exhibit_ListState === 'noData'
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          tipText={'当前测试节点没有添加展品'}
          btnText={'添加测试展品'}
          onClick={() => {
            dispatch<OnClickExhibitsAddBtnAction>({
              type: 'informalNodeManagerPage/onClickExhibitsAddBtn',
            });
          }}
        />)
        : (<FInfiniteScroll
          loadMore={() => {
            dispatch<OnLoadMoreExhibitsAction>({
              type: 'informalNodeManagerPage/onLoadMoreExhibits',
            });
          }}
          hasMore={true}
        >
          <div className={styles.header}>
            <FTitleText text={'展品管理'}/>
            <Space size={30}>

              <FTextBtn
                type="default"
                onClick={() => {
                  dispatch<OnClickExhibitsAddBtnAction>({
                    type: 'informalNodeManagerPage/onClickExhibitsAddBtn',
                  });
                }}>
                <Space size={5}>
                  <FAdd/>
                  {/*<FContentText text={}/>*/}
                  <span>{FUtil1.I18n.message('title_add_test_exhibit')}</span>
                </Space>
              </FTextBtn>

              <FTextBtn
                type="default"
                onClick={() => {
                  // onChange({replaceModalVisible: true});
                  dispatch<OnClickExhibitsReplaceBtnAction>({
                    type: 'informalNodeManagerPage/onClickExhibitsReplaceBtn',
                  });
                }}>
                <Space size={5}>
                  <FMappingRuleReplace/>
                  {/*<FContentText text={FUtil1.I18n.message('btn_replace_resource')}/>*/}
                  <span>{FUtil1.I18n.message('btn_replace_resource')}</span>
                </Space>
              </FTextBtn>

              <div>
                <span>类型：</span>
                <FDropdownMenu
                  options={informalNodeManagerPage.exhibit_TypeOptions}
                  onChange={(value) => {
                    dispatch<OnChangeExhibitTypeAction>({
                      type: 'informalNodeManagerPage/onChangeExhibitType',
                      payload: {
                        value: value,
                      },
                    });
                  }}
                >
            <span
              style={{cursor: 'pointer'}}>{informalNodeManagerPage.exhibit_TypeOptions.find((rto) => rto.value === informalNodeManagerPage.exhibit_SelectedType)?.text || ''}<FDown
              style={{marginLeft: 8}}/></span>
                </FDropdownMenu>
              </div>
              <div>
                <span>状态：</span>
                <FDropdownMenu
                  options={informalNodeManagerPage.exhibit_StatusOptions}
                  onChange={(value) => {
                    dispatch<OnChangeExhibitStatusAction>({
                      type: 'informalNodeManagerPage/onChangeExhibitStatus',
                      payload: {
                        value: value,
                      },
                    });
                  }}
                >
            <span style={{cursor: 'pointer'}}>{informalNodeManagerPage.exhibit_StatusOptions.find((rso) => {
              return rso.value === informalNodeManagerPage.exhibit_SelectedStatus.toString();
            })?.text}<FDown style={{marginLeft: 10}}/></span>
                </FDropdownMenu>
              </div>
              <div>
                <FInput
                  theme={'dark'}
                  value={informalNodeManagerPage.exhibit_FilterKeywords}
                  debounce={300}
                  onDebounceChange={async (value) => {
                    dispatch<OnChangeExhibitKeywordsAction>({
                      type: 'informalNodeManagerPage/onChangeExhibitKeywords',
                      payload: {
                        value: value,
                      },
                    });
                  }}
                />
              </div>
            </Space>
          </div>
          {
            informalNodeManagerPage.exhibit_ListState === 'noSearchResult'
              ? (<FNoDataTip
                height={'calc(100vh - 294px)'}
                tipText={'无筛选结果'}
              />)
              : (<div className={styles.body}>
                <div>
                  <ExhibitTable/>
                </div>
              </div>)
          }

        </FInfiniteScroll>)
    }


  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Exhibit);
