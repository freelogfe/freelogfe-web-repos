import * as React from 'react';
import styles from './index.less';
import {FDown, FEdit, FExclamation, FFileSearch, FWarning} from '@/components/FIcons';
import FTable from '@/components/FTable';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FContentText, FTitleText} from '@/components/FText';
import {Space} from 'antd';
import FSwitch from '@/components/FSwitch';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from '@/models/connect';
import FInput from '@/components/FInput';
import {router} from "umi";
import {ColumnsType} from "antd/lib/table/interface";
// import {resourceTypes} from "@/utils/predefined";
import {FetchExhibitsAction, OnChangeExhibitAction, OnOnlineOrOfflineAction} from "@/models/nodeManagerPage";
import {ChangeAction as MarketChangeAction} from '@/models/marketPage';
import FNoDataTip from "@/components/FNoDataTip";
import FDropdownMenu from "@/components/FDropdownMenu";
import FLoadingTip from "@/components/FLoadingTip";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/node/formal/$id/Sider";
import FTooltip from "@/components/FTooltip";
import FLink from "@/components/FLink";
import FUtil from "@/utils";
import InfiniteScroll from 'react-infinite-scroller';

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...FUtil.Predefined.resourceTypes.map((i) => ({value: i, text: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '2'},
  {text: '已上线', value: '1'},
  {text: '已下线', value: '0'},
];

function Exhibits({dispatch, nodeManagerPage}: ExhibitsProps) {

  const dataSource: NodeManagerModelState['exhibitList'] = nodeManagerPage.exhibitList.map((i) => ({
    key: i.id,
    ...i,
  }));

  if (nodeManagerPage.exhibitDataState === 'loading') {
    return (<FLoadingTip height={'calc(100vh - 70px)'}/>);
  }

  const columns: ColumnsType<NonNullable<NodeManagerModelState['exhibitList']>[number]> = [
    {
      title: (<FTitleText
        // text={'展品名称｜类型｜展品标题｜策略'}
        text={FUtil.I18n.message('tableheader_exhibit')}
        type="table"
      />),
      dataIndex: 'name',
      key: 'name',
      // className: styles.tableName,
      // width: 100,
      render(_, record) {
        return (<div className={styles.info}>
          <img src={record.cover || imgSrc} alt={''}/>
          <div style={{width: 10, flexShrink: 0}}/>
          <div className={styles.infos}>
            <FContentText
              singleRow
              text={record.resourceName}
            />
            <div className={styles.sub}>
              <label>{record.type}</label>
              <div style={{width: 5}}/>
              <FContentText
                type="additional2"
                text={record.title}
                singleRow
              />
            </div>
            <div className={styles.polices}>
              {
                record.policies.map((l) => (<label key={l}>{l}</label>))
              }
            </div>
          </div>
        </div>);
      },
    },
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      // width: 100,
      className: styles.tableEdit,
      render(_, record): any {
        return (<Space size={25} className={[styles.toolBar, styles.hoverVisible].join(' ')}>
          <FTooltip title={FUtil.I18n.message('tip_edit_exhibit')}>
            <FLink to={FUtil.LinkTo.exhibitManagement({
              exhibitID: record.id
            })}><FEdit/></FLink>
          </FTooltip>

          <FTooltip title={FUtil.I18n.message('tip_check_relevant_resource')}>
            <FLink to={FUtil.LinkTo.resourceDetails({
              resourceID: record.resourceId
            })}><FFileSearch/></FLink>
          </FTooltip>
        </Space>)
      }
    },
    {
      title: (<FTitleText
        type="table"
        text={FUtil.I18n.message('tableheader_exhibit_version')}
      />),
      dataIndex: 'version',
      key: 'version',
      // width: 125,
      className: styles.tableVersion,
      render(_, record): any {
        return (<FContentText text={record.version}/>)
      },
    },
    {
      title: (<FTitleText
        type="table"
        text={FUtil.I18n.message('tableheader_show_exhibit')}
      />),
      dataIndex: 'status',
      key: 'status',
      // width: 65,
      className: styles.tableStatus,
      render(_, record): any {
        return (<Space size={15}>
          <FSwitch
            disabled={!record.isAuth || record.policies.length === 0}
            checked={record.isOnline}
            onChange={(value) => {
              dispatch<OnOnlineOrOfflineAction>({
                type: 'nodeManagerPage/onOnlineOrOffline',
                payload: {
                  id: record.id,
                  onlineStatus: value ? 1 : 0,
                },
              });
            }}
          />
          {!record.isAuth || record.policies.length === 0 ?
            <FTooltip title={!record.isAuth ? record.authErrorText : '暂无上线策略'}>
              <FWarning/>
            </FTooltip> : ''}
        </Space>)
      }
    },
  ];

  return (<FLeftSiderLayout
    type={nodeManagerPage.exhibitDataState === 'noData' ? 'empty' : 'table'}
    sider={<Sider/>}
    header={<div className={styles.header}>
      <FTitleText type="h1" text={'展品管理'}/>
      <Space size={80}>
        <div>
          <span>类型：</span>
          <FDropdownMenu
            options={resourceTypeOptions}
            onChange={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                selectedType: value,
              },
            })}
          >
            <span
              style={{cursor: 'pointer'}}>{resourceTypeOptions.find((rto) => rto.value === nodeManagerPage.selectedType)?.text || ''}<FDown
              style={{marginLeft: 8}}/></span>
          </FDropdownMenu>
        </div>
        <div>
          <span>状态：</span>
          <FDropdownMenu
            options={resourceStatusOptions}
            onChange={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                selectedStatus: value,
              },
            })}
          >
            <span style={{cursor: 'pointer'}}>{resourceStatusOptions.find((rso) => {
              return rso.value === nodeManagerPage.selectedStatus.toString();
            })?.text}<FDown style={{marginLeft: 10}}/></span>
          </FDropdownMenu>
        </div>
        <div>
          <FInput
            className={styles.input}
            theme="dark"
            value={nodeManagerPage.exhibitInputFilter}
            debounce={300}
            onDebounceChange={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                exhibitInputFilter: value,
              },
            })}
          />
        </div>
      </Space>
    </div>}
  >

    {
      nodeManagerPage.exhibitDataState === 'noData' ? (<FNoDataTip
        height={'calc(100vh - 70px)'}
        tipText={FUtil.I18n.message('manage_exhibits_empty')}
        btnText={FUtil.I18n.message('btn_go_to_resource_market')}
        onClick={() => {
          dispatch<MarketChangeAction>({
            type: 'marketPage/change',
            payload: {
              resourceType: '-1',
            }
          });
          router.push(FUtil.LinkTo.market());
        }}
      />) : (<>
        {
          nodeManagerPage.exhibitDataState === 'noSearchData'
            ? (<FNoDataTip
              height={'calc(100vh - 170px)'}
              tipText={'无搜索结果'}
            />)
            : (<InfiniteScroll
              pageStart={0}
              initialLoad={false}
              loadMore={() => {
                // console.log('@@@@8888QQQQQQ');
                dispatch<FetchExhibitsAction>({
                  type: 'nodeManagerPage/fetchExhibits',
                  payload: false,
                });
              }}
              hasMore={nodeManagerPage.totalNum !== -1 && nodeManagerPage.exhibitList.length < nodeManagerPage.totalNum}
              // hasMore={true}
            >
              <div className={styles.body}>
                <FTable
                  rowClassName={styles.rowClassName}
                  columns={columns}
                  dataSource={dataSource as any}
                  pagination={false}
                />
              </div>
            </InfiniteScroll>)
        }
        {nodeManagerPage.exhibitList.length < nodeManagerPage.totalNum &&
        <div className={styles.loader} key={0}>Loading ...</div>}

      </>)
    }

  </FLeftSiderLayout>);
}

export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
