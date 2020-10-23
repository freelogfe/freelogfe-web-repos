import * as React from 'react';
import styles from './index.less';
import {FDown, FEdit, FExclamation, FFileSearch} from "@/components/FIcons";
import Header from '../Header';
import FTable from "@/components/FTable";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FContentText, FTitleText} from '@/components/FText';
import {Space} from "antd";
import {FTextButton} from '@/components/FButton';
import FPagination from "@/components/FPagination";
import FSwitch from "@/components/FSwitch";
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from "@/models/connect";
import FInput from "@/components/FInput";

const columns = [
  {
    title: <FContentText text={'展品标题｜类型｜展品名称｜策略'}/>,

    dataIndex: 'name',
    key: 'name',
    className: styles.name,
    width: 100,
    render() {
      return (<div className={styles.info}>
        <img src={imgSrc} alt={''}/>
        <div style={{width: 10, flexShrink: 0}}/>
        <div className={styles.infos}>
          <FContentText
            singleRow
            text={'这里是展品标题这里是展品标题这里是展品标题这里是展品标题这里是展品标题这里是展品标题'}
          />
          <div className={styles.sub}>
            <label>image</label>
            <div style={{width: 5}}/>
            <FContentText
              type="additional2"
              text={'这里是展品名称这里是展品名称这里是展品名称这里这里是展品名称这里是展品名称这里是展品名称这里'}
              singleRow
            />
          </div>
          <div className={styles.polices}>
            <label>免费</label>
            <label>免费2</label>
            <label>收费策略1</label>
            <label>收费策略2</label>
          </div>
        </div>
      </div>);
    },
  },
  {
    title: '',
    dataIndex: 'edit',
    key: 'edit',
    width: 100,
    render(): any {
      return (<Space size={25}>
        <FTextButton theme="primary">
          <FEdit/>
        </FTextButton>
        <FTextButton theme="primary">
          <FFileSearch/>
        </FTextButton>
      </Space>)
    }
  },
  {
    title: <FContentText text={'展示版本'}/>,
    dataIndex: 'version',
    key: 'version',
    width: 125,
    render(): any {
      return (<FContentText text={'1.0.10'}/>)
    },
  },
  {
    title: <FContentText text={'上线'}/>,
    dataIndex: 'status',
    key: 'status',
    width: 65,
    render(): any {
      return (<Space size={15}>
        <FSwitch/>
        <FExclamation/>
      </Space>)
    }
  },
];

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

interface ExhibitsProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Exhibits({dispatch, nodeManagerPage}: ExhibitsProps) {
  return (<div>
    <div className={styles.header}>
      <FTitleText type="h1" text={'展品管理'}/>
      <Space size={80}>
        <div>
          <span>类型：</span>
          <span>全部 <FDown/></span>
        </div>
        <div>
          <span>状态：</span>
          <span>全部 <FDown/></span>
        </div>
        <div>
          <FInput
            className={styles.input}
            theme="dark"
            // value={nodeManagerPage}
          />
        </div>
      </Space>
    </div>
    <div className={styles.body}>
      <FTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <div style={{height: 20}}/>
      <div className={styles.pagination}>
        <FPagination total={100}/>
      </div>
    </div>
  </div>);
}

export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(Exhibits);
