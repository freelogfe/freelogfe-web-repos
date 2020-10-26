import * as React from 'react';
import styles from './index.less';
import {FDown, FEdit, FExclamation, FFileSearch} from '@/components/FIcons';
import Header from '../Header';
import FTable from '@/components/FTable';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FContentText, FTitleText} from '@/components/FText';
import {Dropdown, Space} from 'antd';
import {FTextButton} from '@/components/FButton';
import FPagination from '@/components/FPagination';
import FSwitch from '@/components/FSwitch';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageState, NodeManagerModelState} from '@/models/connect';
import FInput from '@/components/FInput';
import {router} from "umi";
import {ColumnsType} from "antd/lib/table/interface";
import FMenu from "@/components/FMenu";
import {resourceTypes} from "@/utils/globals";
import {ChangeAction, OnChangeExhibitAction} from "@/models/nodeManagerPage";

const columns: ColumnsType<NodeManagerModelState['exhibitList'][number]> = [
  {
    title: <FContentText text={'展品标题｜类型｜展品名称｜策略'}/>,

    dataIndex: 'name',
    key: 'name',
    className: styles.tableName,
    // width: 100,
    render(_, record) {
      return (<div className={styles.info}>
        <img src={record.cover || imgSrc} alt={''}/>
        <div style={{width: 10, flexShrink: 0}}/>
        <div className={styles.infos}>
          <FContentText
            singleRow
            text={record.title}
          />
          <div className={styles.sub}>
            <label>{record.type}</label>
            <div style={{width: 5}}/>
            <FContentText
              type="additional2"
              text={record.resourceName}
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
      return (<Space size={25}>
        <FTextButton
          onClick={() => router.push('/node/exhibit/' + record.id)}
          theme="primary"
        >
          <FEdit/>
        </FTextButton>
        <FTextButton
          onClick={() => router.push('/resource/' + record.resourceId)}
          theme="primary"
        >
          <FFileSearch/>
        </FTextButton>
      </Space>)
    }
  },
  {
    title: <FContentText text={'展示版本'}/>,
    dataIndex: 'version',
    key: 'version',
    // width: 125,
    className: styles.tableVersion,
    render(_, record): any {
      return (<FContentText text={record.version}/>)
    },
  },
  {
    title: <FContentText text={'上线'}/>,
    dataIndex: 'status',
    key: 'status',
    // width: 65,
    className: styles.tableStatus,
    render(_, record): any {
      return (<Space size={15}>
        <FSwitch checked={record.isOnline}/>
        {/*{record.isOnline || <FExclamation/>}*/}
      </Space>)
    }
  },
];

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...resourceTypes.map((i) => ({value: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '2'},
  {text: '已上线', value: '1'},
  {text: '已下线', value: '0'},
];

function Exhibits({dispatch, nodeManagerPage}: ExhibitsProps) {

  // React.useEffect(() => {
  //   console.log('Exhibits useEffect');
  // }, []);

  const dataSource: NodeManagerModelState['exhibitList'] = nodeManagerPage.exhibitList.map((i) => ({
    key: i.id,
    ...i,
  }));

  return (<div>
    <div className={styles.header}>
      <FTitleText type="h1" text={'展品管理'}/>
      <Space size={80}>
        <div>
          <span>类型：</span>
          <Dropdown overlay={<FMenu
            options={resourceTypeOptions}
            onClick={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                selectedType: value,
              },
            })}
          />}>
            <span style={{cursor: 'pointer'}}>全部<FDown style={{marginLeft: 8}}/></span>
          </Dropdown>
          {/*<span>全部 <FDown/></span>*/}
        </div>
        <div>
          <span>状态：</span>
          <Dropdown overlay={<FMenu
            options={resourceStatusOptions}
            onClick={(value) => dispatch<OnChangeExhibitAction>({
              type: 'nodeManagerPage/onChangeExhibit',
              payload: {
                selectedStatus: value,
              },
            })}
          />}>
            <span style={{cursor: 'pointer'}}>全部<FDown style={{marginLeft: 10}}/></span>
          </Dropdown>
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
    </div>
    <div className={styles.body}>
      <FTable
        columns={columns}
        dataSource={dataSource as any}
        pagination={false}
      />
      <div style={{height: 20}}/>
      <div className={styles.pagination}>
        <FPagination
          current={nodeManagerPage.pageCurrent}
          onChangeCurrent={(value) => dispatch<OnChangeExhibitAction>({
            type: 'nodeManagerPage/onChangeExhibit',
            payload: {
              pageCurrent: value,
            },
          })}
          pageSize={nodeManagerPage.pageSize}
          onChangePageSize={(value) => dispatch<OnChangeExhibitAction>({
            type: 'nodeManagerPage/onChangeExhibit',
            payload: {
              pageSize: value,
            },
          })}
          total={nodeManagerPage.totalNum}
        />
      </div>
    </div>
  </div>);
}

export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
