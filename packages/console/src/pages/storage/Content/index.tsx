import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {Drawer, Space} from 'antd';
import FTable from '@/components/FTable';
import {EditOutlined, SnippetsOutlined, SendOutlined, DownloadOutlined, DeleteOutlined} from '@ant-design/icons';
import Market from "@/pages/resource/containers/FDepPanel/Market";
import Header from '../Header';
import Details from "@/pages/storage/Content/Details";
import SelectDeps from "@/pages/storage/Content/SelectDeps";

// import {} from '@/components/FT'

interface ContentProps {

}

const columns = [
  {
    title: '对象名称',
    dataIndex: 'name',
    key: 'name',
    render(text: any, record: any) {
      return <Space size={10}>
        <FContentText text={text}/>
        <FTextButton theme={'primary'}>
          <SnippetsOutlined/>
        </FTextButton>
      </Space>;
    }
  },
  {
    title: '',
    dataIndex: 'tool',
    key: 'tool',
    width: 170,
    render(text: any, record: any) {
      return (<Space size={25}>
        <FTextButton theme={'primary'}>
          <EditOutlined/>
        </FTextButton>
        <FTextButton theme={'primary'}>
          <SendOutlined/>
        </FTextButton>
        <FTextButton theme={'primary'}>
          <DownloadOutlined/>
        </FTextButton>
        <FTextButton className={styles.Delete}>
          <DeleteOutlined/>
        </FTextButton>
      </Space>);
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 140,
    render(text: any, record: any) {
      return text;
    }
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: 90,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 125,
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    type: 'image',
    size: 2378,
    updateTime: new Date().getTime(),
  },
];

function Content({}: ContentProps) {

  const [objectInfoVisible, setObjectInfoVisible] = React.useState<boolean>(true);
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  return (<div>

    <Header/>

    <div className={styles.body}>
      <FTable columns={columns} dataSource={data}/>
    </div>

    <Drawer
      title={'编辑对象信息'}
      // onClose={() => setModalVisible(false)}
      visible={objectInfoVisible}
      width={720}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Details/>
      <Drawer
        title="添加依赖"
        width={640}
        visible={depInfoVisible}
        // closable={}
        // onClose={this.onChildrenDrawerClose}
        // visible={this.state.childrenDrawer}
      >
        <SelectDeps/>
      </Drawer>
      {/*<Market/>*/}
    </Drawer>
  </div>);
}

export default Content;
