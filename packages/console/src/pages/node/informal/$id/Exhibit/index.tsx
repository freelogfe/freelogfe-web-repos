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
import FDrawer from "@/components/FDrawer";
import FSelect from "@/components/FSelect";
import FCheckbox from "@/components/FCheckbox";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";
import FInfiniteScroll from "@/components/FInfiniteScroll";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState, StorageHomePageModelState} from "@/models/connect";
import {ChangeAction, FetchExhibitListAction} from "@/models/informalNodeManagerPage";
import FModal from "@/components/FModal";
import {SwapRightOutlined} from '@ant-design/icons';
import Replacer from "@/pages/node/informal/$id/Exhibit/Replacer";
import Replaced from "@/pages/node/informal/$id/Exhibit/Replaced";
import ExhibitTable from "@/pages/node/informal/$id/Exhibit/ExhibitTable";
import {RouteComponentProps} from "react-router";
import FLoadingTip from "@/components/FLoadingTip";
import {WholeMutable} from "@/models/shared";

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

    <FModal
      title={null}
      width={947}
      visible={informalNodeManagerPage.replaceHandlerModalVisible}
      closable={false}
      onCancel={() => {
        onChange({replaceHandlerModalVisible: false});
      }}
    >
      <div className={styles.replaceHandler}>
        <div className={styles.replacer}>
          <FTitleText type="h5" text={'选择替换资源'}/>
          <div style={{height: 5}}/>
          <div className={styles.content}>
            <Replacer/>
          </div>

        </div>
        <div className={styles.arrow}>
          <SwapRightOutlined style={{fontSize: 36, fontWeight: 600, color: '#D8D8D8'}}/>
        </div>
        <div className={styles.replaced}>
          <FTitleText type="h5" text={'选择被替换资源'}/>
          <div style={{height: 5}}/>
          <div className={styles.content}>
            <Replaced/>
          </div>
        </div>
      </div>
    </FModal>

    <FDrawer
      title={'添加测试展品'}
      visible={informalNodeManagerPage.addExhibitDrawerVisible}
      topRight={<Space size={30}>
        <FTextButton>取消</FTextButton>
        <FNormalButton>添加</FNormalButton>
      </Space>}
      onClose={() => {
        onChange({addExhibitDrawerVisible: false});
      }}
    >
      <div className={styles.filter}>
        <FSelect
          value={informalNodeManagerPage.addExhibitSelectValue}
          dataSource={[
            ...informalNodeManagerPage.addExhibitOptions as WholeMutable<InformalNodeManagerPageModelState['addExhibitOptions']>,
            ...storageHomePage.bucketList.map<InformalNodeManagerPageModelState['addExhibitOptions'][number]>((b) => {
              return {
                value: b.bucketName,
                title: b.bucketName,
              };
            })
          ]}
          onChange={(value) => {
            onChange({addExhibitSelectValue: value});
          }}
        />
        <FInput
          value={informalNodeManagerPage.addExhibitInputValue}
          onChange={(e) => {
            onChange({addExhibitInputValue: e.target.value});
          }}
          theme="dark"
        />
      </div>
      <div style={{height: 15}}/>
      <div className={styles.list}>
        {
          informalNodeManagerPage.addExhibitCheckedList
            .map((l, i, arr) => {
              return (<div key={l.id} className={styles.item}>
                <FCheckbox
                  checked={l.checked}
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
                    })
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
                    <FResourceStatusBadge status={l.status}/>
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
      {
        false
          ? (<div className={styles.footer}>
            <FNormalButton
              // onClick={() => onLoadMord && onLoadMord()}
            >加载更多</FNormalButton>
          </div>)
          : (['2'].length > 0 && (
            <div style={{textAlign: 'center', padding: '10px 0'}}>
              <FContentText type="additional1" text={'没有更多了~'}/>
            </div>))
      }
    </FDrawer>
  </FInfiniteScroll>);
}

export default connect(({informalNodeManagerPage, storageHomePage}: ConnectState) => ({
  informalNodeManagerPage,
  storageHomePage,
}))(Exhibit);


