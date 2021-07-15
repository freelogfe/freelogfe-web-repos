import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import FInput from "@/components/FInput";
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";
import {FTextBtn} from "@/components/FButton";
import FAdd from "@/components/FIcons/FAdd";
import FDropdownMenu from "@/components/FDropdownMenu";
import FInfiniteScroll from "@/components/FInfiniteScroll";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState, StorageHomePageModelState} from "@/models/connect";
import {
  ChangeAction,
  FetchExhibitListAction, OnMountExhibitPageAction,
} from "@/models/informalNodeManagerPage";
import ExhibitTable from "@/pages/node/informal/$id/Exhibit/ExhibitTable";
import FLoadingTip from "@/components/FLoadingTip";
import {FDown} from "@/components/FIcons";
import * as AHooks from 'ahooks';
import FUtil1 from '@/utils';

interface ExhibitProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
  storageHomePage: StorageHomePageModelState;
}

function Exhibit({dispatch, informalNodeManagerPage, storageHomePage}: ExhibitProps) {

  AHooks.useMount(() => {
    dispatch<OnMountExhibitPageAction>({
      type: 'informalNodeManagerPage/onMountExhibitPage',
    });
  });

  AHooks.useUnmount(() => {

  });

  // React.useEffect(() => {
  //   // console.log('exhibit');
  //   initData();
  // }, []);

  // AHooks.useUnmount(() => {
  //   onChange({
  //     ...exhibitPageInitData,
  //   });
  // });

  // async function initData() {
  //   await dispatch<FetchExhibitListAction>({
  //     type: 'informalNodeManagerPage/fetchExhibitList',
  //     payload: {
  //       isRematch: true,
  //     },
  //   });
  // }

  if (informalNodeManagerPage.exhibitPageExhibitsTotal === -1) {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  // if (informalNodeManagerPage.exhibitList.length === 0) {
  //   return ();
  // }

  async function onChange(payload: Partial<InformalNodeManagerPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload,
    });
  }

  return (<>
    {
      informalNodeManagerPage.exhibitPageExhibitList.length === 0 && informalNodeManagerPage.exhibitPageSelectedType === '-1' && informalNodeManagerPage.exhibitPageSelectedStatus === '2' && informalNodeManagerPage.exhibitPageFilterKeywords === ''
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          tipText={'当前测试节点没有添加展品'}
          btnText={'添加测试展品'}
          onClick={() => {
            // console.log('@#$!@#$!@#$@#$90j.k23');
            onChange({addExhibitDrawerVisible: true});
          }}
        />)
        : (<FInfiniteScroll
          loadMore={() => {
            console.log('1234####0-p23[k,l;dsf#');
          }}
          hasMore={true}
        >
          <div className={styles.header}>
            <FTitleText text={'展品管理'}/>
            <Space size={30}>
              <Space size={5}>
                <FTextBtn
                  type="default"
                  onClick={() => {
                    onChange({addExhibitDrawerVisible: true});
                  }}>
                  <FAdd/>
                </FTextBtn>
                <FContentText text={FUtil1.I18n.message('title_add_test_exhibit')}/>
              </Space>
              <Space size={5}>
                <FTextBtn
                  type="default"
                  onClick={() => {
                    onChange({replaceModalVisible: true});
                  }}>
                  <FMappingRuleReplace/>
                </FTextBtn>
                <FContentText text={FUtil1.I18n.message('btn_replace_resource')}/>
              </Space>
              <div>
                <span>类型：</span>
                <FDropdownMenu
                  options={informalNodeManagerPage.exhibitPageTypeOptions}
                  onChange={async (value) => {
                    await onChange({exhibitPageSelectedType: value});
                    await dispatch<FetchExhibitListAction>({
                      type: 'informalNodeManagerPage/fetchExhibitList',
                      payload: {
                        isRematch: false,
                      },
                    });
                  }}
                >
            <span
              style={{cursor: 'pointer'}}>{informalNodeManagerPage.exhibitPageTypeOptions.find((rto) => rto.value === informalNodeManagerPage.exhibitPageSelectedType)?.text || ''}<FDown
              style={{marginLeft: 8}}/></span>
                </FDropdownMenu>
              </div>
              <div>
                <span>状态：</span>
                <FDropdownMenu
                  options={informalNodeManagerPage.exhibitPageStatusOptions}
                  onChange={async (value) => {
                    await onChange({exhibitPageSelectedStatus: value as '0'});
                    await dispatch<FetchExhibitListAction>({
                      type: 'informalNodeManagerPage/fetchExhibitList',
                      payload: {
                        isRematch: false,
                      },
                    });
                  }}
                >
            <span style={{cursor: 'pointer'}}>{informalNodeManagerPage.exhibitPageStatusOptions.find((rso) => {
              return rso.value === informalNodeManagerPage.exhibitPageSelectedStatus.toString();
            })?.text}<FDown style={{marginLeft: 10}}/></span>
                </FDropdownMenu>
              </div>
              <div>
                <FInput
                  theme={'dark'}
                  value={informalNodeManagerPage.exhibitPageFilterKeywords}
                  debounce={300}
                  onDebounceChange={async (value) => {
                    await onChange({exhibitPageFilterKeywords: value});
                    await dispatch<FetchExhibitListAction>({
                      type: 'informalNodeManagerPage/fetchExhibitList',
                      payload: {
                        isRematch: false,
                      },
                    });
                  }}
                />
              </div>
            </Space>
          </div>
          {
            informalNodeManagerPage.exhibitPageExhibitList.length === 0
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

export default connect(({informalNodeManagerPage, storageHomePage}: ConnectState) => ({
  informalNodeManagerPage,
  storageHomePage,
}))(Exhibit);
