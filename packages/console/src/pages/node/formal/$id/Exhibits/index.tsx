import * as React from 'react';
import styles from './index.less';
import { FDown, FEdit, FFileSearch, FLoading, FWarning } from '@/components/FIcons';
import FTable from '@/components/FTable';
// import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import { Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { connect, Dispatch } from 'dva';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import FInput from '@/components/FInput';
import { router } from 'umi';
import { ColumnsType } from 'antd/lib/table/interface';
import {
  OnChange_Exhibit_InputFilter_Action,
  OnChange_Exhibit_SelectedStatus_Action,
  OnChange_Exhibit_SelectedType_Action,
  OnLoadMore_ExhibitList_Action,
  OnMount_ExhibitPage_Action,
  OnOnlineOrOfflineAction,
  OnUnmount_ExhibitPage_Action,
} from '@/models/nodeManagerPage';
import { ChangeAction as MarketChangeAction } from '@/models/marketPage';
import FNoDataTip from '@/components/FNoDataTip';
import FDropdownMenu from '@/components/FDropdownMenu';
import FLoadingTip from '@/components/FLoadingTip';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/node/formal/$id/Sider';
import FTooltip from '@/components/FTooltip';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import InfiniteScroll from 'react-infinite-scroller';
import * as AHooks from 'ahooks';
import { FTextBtn, FRectBtn } from '@/components/FButton';
import FListFooter from '@/components/FListFooter';
import FCoverImage from '@/components/FCoverImage';

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Exhibits({ dispatch, nodeManagerPage }: ExhibitsProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_ExhibitPage_Action>({
      type: 'nodeManagerPage/onMount_ExhibitPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_ExhibitPage_Action>({
      type: 'nodeManagerPage/onUnmount_ExhibitPage',
    });
  });

  const dataSource: NodeManagerModelState['exhibit_List'] = nodeManagerPage.exhibit_List.map((i) => ({
    key: i.id,
    ...i,
  }));

  // if (nodeManagerPage.exhibit_ListState === 'loading') {
  //   return (<FLoadingTip height={'calc(100vh - 70px)'} />);
  // }

  const columns: ColumnsType<NonNullable<NodeManagerModelState['exhibit_List']>[number]> = [
    {
      title: (<FTitleText
        // text={'展品名称｜类型｜展品标题｜策略'}
        text={FUtil1.I18n.message('tableheader_exhibit')}
        type='table'
      />),
      dataIndex: 'name',
      key: 'name',
      // className: styles.tableName,
      // width: 100,
      render(_, record) {
        return (<div className={styles.info}>
          {/*<img src={record.cover || imgSrc} alt={''} />*/}
          <FCoverImage src={record.cover || ''} width={120} style={{ borderRadius: 4 }} />
          <div style={{ width: 10, flexShrink: 0 }} />
          <div className={styles.infos}>
            <FContentText
              singleRow
              text={record.resourceName}
            />
            <div className={styles.sub}>
              <label>{record.type}</label>
              <div style={{ width: 5 }} />
              <FContentText
                type='additional2'
                text={record.title}
                singleRow
              />
            </div>
            <div className={styles.polices}>
              {
                record.policies.length > 0
                  ? record.policies.map((l) => (<label key={l}>{l}</label>))
                  : (<FContentText text={'暂无策略…'} type='additional2' />)
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
          <FTooltip title={FUtil1.I18n.message('tip_edit_exhibit')}>
            <FTextBtn
              type='primary'
              onClick={() => {
                window.open(FUtil.LinkTo.exhibitManagement({
                  exhibitID: record.id,
                }));
              }}
            ><FEdit /></FTextBtn>
          </FTooltip>

          <FTooltip title={FUtil1.I18n.message('tip_check_relevant_resource')}>
            <FTextBtn
              type='primary'
              onClick={() => {
                window.open(FUtil.LinkTo.resourceDetails({
                  resourceID: record.resourceId,
                }));
              }}><FFileSearch /></FTextBtn>
          </FTooltip>
        </Space>);
      },
    },
    {
      title: (<FTitleText
        type='table'
        text={FUtil1.I18n.message('tableheader_exhibit_version')}
      />),
      dataIndex: 'version',
      key: 'version',
      // width: 125,
      className: styles.tableVersion,
      render(_, record): any {
        return (<FContentText text={record.version} />);
      },
    },
    {
      title: (<FTitleText
        type='table'
        text={FUtil1.I18n.message('tableheader_show_exhibit')}
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
              <FWarning />
            </FTooltip> : ''}
        </Space>);
      },
    },
  ];

  return (<FLeftSiderLayout
    type={nodeManagerPage.exhibit_ListState === 'noData' ? 'empty' : 'table'}
    sider={<Sider />}
    header={<div className={styles.header}>
      <FTitleText type='h1' text={'展品管理'} />
      <Space size={80}>
        <div>
          <span>类型：</span>
          <FDropdownMenu
            options={nodeManagerPage.exhibit_ResourceTypeOptions}
            onChange={(value) => {
              dispatch<OnChange_Exhibit_SelectedType_Action>({
                type: 'nodeManagerPage/onChange_Exhibit_SelectedType',
                payload: {
                  value: value,
                },
              });
            }}
          >
            <span
              style={{ cursor: 'pointer' }}>{nodeManagerPage.exhibit_ResourceTypeOptions.find((rto) => rto.value === nodeManagerPage.exhibit_SelectedType)?.text || ''}<FDown
              style={{ marginLeft: 8 }} /></span>
          </FDropdownMenu>
        </div>
        <div>
          <span>状态：</span>
          <FDropdownMenu
            options={nodeManagerPage.exhibit_ResourceStateOptions}
            onChange={(value) => {
              dispatch<OnChange_Exhibit_SelectedStatus_Action>({
                type: 'nodeManagerPage/onChange_Exhibit_SelectedStatus',
                payload: {
                  value: value,
                },
              });
            }}
          >
            <span style={{ cursor: 'pointer' }}>{nodeManagerPage.exhibit_ResourceStateOptions.find((rso) => {
              return rso.value === nodeManagerPage.exhibit_SelectedStatus.toString();
            })?.text}<FDown style={{ marginLeft: 10 }} /></span>
          </FDropdownMenu>
        </div>
        <div>
          <FInput
            className={styles.input}
            theme='dark'
            value={nodeManagerPage.exhibit_InputFilter}
            debounce={300}
            onDebounceChange={(value) => {
              dispatch<OnChange_Exhibit_InputFilter_Action>({
                type: 'nodeManagerPage/onChange_Exhibit_InputFilter',
                payload: {
                  value: value,
                },
              });
            }}
          />
        </div>
      </Space>
    </div>}
  >

    {
      nodeManagerPage.exhibit_ListState === 'noData' ? (<FNoDataTip
        height={'calc(100vh - 70px)'}
        tipText={FUtil1.I18n.message('manage_exhibits_empty')}
        btnText={FUtil1.I18n.message('btn_go_to_resource_market')}
        onClick={() => {
          dispatch<MarketChangeAction>({
            type: 'marketPage/change',
            payload: {
              resourceType: '-1',
            },
          });
          router.push(FUtil.LinkTo.market());
        }}
      />) : (<>

        {
          nodeManagerPage.exhibit_ListState === 'loading' && (<FLoadingTip height={'calc(100vh - 270px)'} />)
        }

        {
          nodeManagerPage.exhibit_ListState === 'noSearchResult'
          && (<FNoDataTip
            height={'calc(100vh - 270px)'}
            tipText={'无搜索结果'}
          />)
        }

        {
          nodeManagerPage.exhibit_ListState === 'loaded' && (<div className={styles.body}>
            <FTable
              rowClassName={styles.rowClassName}
              columns={columns}
              dataSource={dataSource as any}
              pagination={false}
            />

            <FListFooter
              state={nodeManagerPage.exhibit_ListMore}
              onClickLoadMore={() => {
                dispatch<OnLoadMore_ExhibitList_Action>({
                  type: 'nodeManagerPage/onLoadMore_ExhibitList',
                });
              }}
            />
          </div>)
        }

        {/*{*/}
        {/*  nodeManagerPage.exhibit_ListState === 'loaded' && (<InfiniteScroll*/}
        {/*    pageStart={0}*/}
        {/*    initialLoad={false}*/}
        {/*    loadMore={() => {*/}
        {/*      // console.log('@@@@8888QQQQQQ');*/}
        {/*      dispatch<FetchExhibitsAction>({*/}
        {/*        type: 'nodeManagerPage/fetchExhibits',*/}
        {/*        payload: false,*/}
        {/*      });*/}
        {/*    }}*/}
        {/*    // hasMore={nodeManagerPage.totalNum !== -1 && nodeManagerPage.exhibitList.length < nodeManagerPage.totalNum}*/}
        {/*    hasMore={nodeManagerPage.exhibit_ListMore === 'andMore'}*/}
        {/*    // hasMore={true}*/}
        {/*  >*/}
        {/*    <div className={styles.body}>*/}
        {/*      <FTable*/}
        {/*        rowClassName={styles.rowClassName}*/}
        {/*        columns={columns}*/}
        {/*        dataSource={dataSource as any}*/}
        {/*        pagination={false}*/}
        {/*      />*/}

        {/*      {*/}
        {/*        nodeManagerPage.exhibit_ListMore === 'loading' &&*/}
        {/*        <div className={styles.loader} key={0}>Loading ...</div>*/}
        {/*      }*/}
        {/*    </div>*/}
        {/*  </InfiniteScroll>)*/}
        {/*}*/}


      </>)
    }

  </FLeftSiderLayout>);
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
