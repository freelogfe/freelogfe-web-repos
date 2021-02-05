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
import {ChangeAction, FetchExhibitListAction} from "@/models/informalNodeManagerPage";
import FModal from "@/components/FModal";

import Replacer from "@/pages/node/informal/$id/containers/FReplaceModal/Replacer";
import Replaced from "@/pages/node/informal/$id/containers/FReplaceModal/Replaced";
import ExhibitTable from "@/pages/node/informal/$id/Exhibit/ExhibitTable";
import {RouteComponentProps} from "react-router";
import FLoadingTip from "@/components/FLoadingTip";
import {WholeMutable} from "@/models/shared";
import AddInformExhibitDrawer from '../containers/AddInformExhibitDrawer';
import FReplaceModal from '../containers/FReplaceModal';

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
    });
  }

  if (informalNodeManagerPage.exhibitListIsLoading) {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  if (informalNodeManagerPage.exhibitList.length === 0) {
    return (<FNoDataTip
      height={'calc(100vh - 94px)'}
      tipText={'当前测试节点没有添加展品'}
      btnText={'添加测试展品'}
    />);
  }

  function onChange(value: Partial<InformalNodeManagerPageModelState>) {
    dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload: {
        ...value,
      },
    });
  }

  return (<FInfiniteScroll
    loadMore={() => {
      console.log('1234#####');
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
          <FDropdownMenu
            options={[{value: '1234', text: '1234'}]}
            text={'筛选'}
          />
        </div>
        <div><FInput theme={'dark'}/></div>
      </Space>
    </div>
    <div className={styles.body}>
      <div>
        <ExhibitTable/>
      </div>
    </div>

    <AddInformExhibitDrawer
      visible={informalNodeManagerPage.addExhibitDrawerVisible}
      onCancel={() => {
        onChange({
          addExhibitDrawerVisible: false,
        });
      }}
      onConfirm={(value) => {
        // console.log(value, 'VVVVVV');
        onChange({
          addExhibitDrawerVisible: false,
        });
      }}
      disabledResourceNames={['Freelog/blog-theme']}
      disabledObjectNames={['234234/th002.jpeg']}
    />

    <FReplaceModal
      nodeID={informalNodeManagerPage.nodeID}
      visible={informalNodeManagerPage.replaceHandlerModalVisible}
    />
  </FInfiniteScroll>);
}

export default connect(({informalNodeManagerPage, storageHomePage}: ConnectState) => ({
  informalNodeManagerPage,
  storageHomePage,
}))(Exhibit);
