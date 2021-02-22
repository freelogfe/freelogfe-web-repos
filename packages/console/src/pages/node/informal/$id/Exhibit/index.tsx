import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Popconfirm, Space} from "antd";
import FInput from "@/components/FInput";
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";
import {FNormalButton, FTextButton} from "@/components/FButton";
import FAdd from "@/components/FIcons/FAdd";
import FDropdownMenu from "@/components/FDropdownMenu";
import FInfiniteScroll from "@/components/FInfiniteScroll";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState, StorageHomePageModelState} from "@/models/connect";
import {
  ChangeAction,
  FetchExhibitListAction,
  SaveDataRulesAction,
} from "@/models/informalNodeManagerPage";
import FModal from "@/components/FModal";

import Replacer from "@/pages/node/informal/$id/containers/FReplaceModal/Replacer";
import Replaced from "@/pages/node/informal/$id/containers/FReplaceModal/Replaced";
import ExhibitTable from "@/pages/node/informal/$id/Exhibit/ExhibitTable";
import {RouteComponentProps} from "react-router";
import FLoadingTip from "@/components/FLoadingTip";
import {WholeMutable} from "@/models/shared";
import AddInformExhibitDrawer from '../containers/AddInformExhibitDrawer';
import FReplaceModal from '../containers/FReplaceModal';
import {FDown} from "@/components/FIcons";
import {resourceTypes} from "@/utils/globals";

const {decompile} = require('@freelog/nmr_translator');

const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...resourceTypes.filter((i) => i !== 'theme').map((i) => ({value: i, text: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '2'},
  {text: '已上线', value: '1'},
  {text: '已下线', value: '0'},
];

interface ExhibitProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
  storageHomePage: StorageHomePageModelState;
}

function Exhibit({dispatch, informalNodeManagerPage, storageHomePage}: ExhibitProps) {

  React.useEffect(() => {
    // console.log('exhibit');
    initData();
  }, []);

  async function initData() {
    await dispatch<FetchExhibitListAction>({
      type: 'informalNodeManagerPage/fetchExhibitList',
      payload: {
        isRematch: true,
      },
    });
  }

  if (informalNodeManagerPage.exhibitListIsLoading) {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  // if (informalNodeManagerPage.exhibitList.length === 0) {
  //   return ();
  // }

  async function onChange(value: Partial<InformalNodeManagerPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload: {
        ...value,
      },
    });
  }

  return (<>
    {
      informalNodeManagerPage.exhibitList.length === 0 && informalNodeManagerPage.selectedType === '-1' && informalNodeManagerPage.selectedStatus === '2'
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          tipText={'当前测试节点没有添加展品'}
          btnText={'添加测试展品'}
          onClick={() => {
            console.log('@#$!@#$!@#$@#$90j.k23');
            onChange({addExhibitDrawerVisible: true});
          }}
        />)
        : (<FInfiniteScroll
          loadMore={() => {
            console.log('1234####0-p23[k,l;dsf#');
          }}
        >
          <div className={styles.header}>
            <FTitleText text={'展品管理'}/>
            <Space size={30}>
              <Space size={5}>
                <FTextButton onClick={() => {
                  onChange({addExhibitDrawerVisible: true});
                }}><FAdd/></FTextButton>
                <FContentText text={'新增测试展品'}/>
              </Space>
              <Space size={5}>
                <FTextButton onClick={() => {
                  onChange({replaceHandlerModalVisible: true});
                }}><FMappingRuleReplace/></FTextButton>
                <FContentText text={'资源替换'}/>
              </Space>
              <div>
                <span>类型：</span>
                <FDropdownMenu
                  options={resourceTypeOptions}
                  onChange={async (value) => {
                    await onChange({selectedType: value});
                    await dispatch<FetchExhibitListAction>({
                      type: 'informalNodeManagerPage/fetchExhibitList',
                      payload: {
                        isRematch: false,
                      },
                    });
                  }}
                >
            <span
              style={{cursor: 'pointer'}}>{resourceTypeOptions.find((rto) => rto.value === informalNodeManagerPage.selectedType)?.text || ''}<FDown
              style={{marginLeft: 8}}/></span>
                </FDropdownMenu>
              </div>
              <div>
                <span>状态：</span>
                <FDropdownMenu
                  options={resourceStatusOptions}
                  onChange={async (value) => {
                    await onChange({selectedStatus: value as '0'})
                    await dispatch<FetchExhibitListAction>({
                      type: 'informalNodeManagerPage/fetchExhibitList',
                      payload: {
                        isRematch: false,
                      },
                    });
                  }}
                >
            <span style={{cursor: 'pointer'}}>{resourceStatusOptions.find((rso) => {
              return rso.value === informalNodeManagerPage.selectedStatus.toString();
            })?.text}<FDown style={{marginLeft: 10}}/></span>
                </FDropdownMenu>
              </div>
              <div><FInput theme={'dark'}/></div>
            </Space>
          </div>
          {
            informalNodeManagerPage.exhibitList.length === 0
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

    <AddInformExhibitDrawer
      visible={informalNodeManagerPage.addExhibitDrawerVisible}
      onCancel={() => {
        onChange({
          addExhibitDrawerVisible: false,
        });
      }}
      onConfirm={(value) => {
        // console.log(value, 'VVVV234pjl;kdsfl;kdf;lVV');
        dispatch<SaveDataRulesAction>({
          type: 'informalNodeManagerPage/saveDataRules',
          payload: {
            type: 'append',
            data: value.names.map((n) => {
              return {
                operation: 'add',
                exhibitName: n.replace('/', '_'),
                candidate: {
                  name: n,
                  versionRange: 'latest',
                  type: value.identity,
                },
              };
            }),
          },
        });
        onChange({
          addExhibitDrawerVisible: false,
        });
      }}
      disabledResourceNames={informalNodeManagerPage.exhibitList.filter((e) => e.identity === 'resource').map((e) => e.originId)}
      disabledObjectNames={informalNodeManagerPage.exhibitList.filter((e) => e.identity === 'object').map((e) => e.originId)}
    />

    <FReplaceModal
      nodeID={informalNodeManagerPage.nodeID}
      visible={informalNodeManagerPage.replaceHandlerModalVisible}
      onCancel={() => {
        onChange({replaceHandlerModalVisible: false});
      }}
      onConfirm={(value) => {
        console.log(value, '@#ASDFASDfloj98p');
      }}
    />
  </>);
}

export default connect(({informalNodeManagerPage, storageHomePage}: ConnectState) => ({
  informalNodeManagerPage,
  storageHomePage,
}))(Exhibit);
