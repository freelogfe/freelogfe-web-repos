import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {Drawer, Row, Space, Col} from 'antd';
import FTable from '@/components/FTable';
import {EditOutlined, SnippetsOutlined, SendOutlined, DownloadOutlined, DeleteOutlined} from '@ant-design/icons';
import Header from '../Header';
import Details from '@/pages/storage/Content/Details';
// @ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {downloadObject} from '@/services/storages';
import FPagination from '@/components/FPagination';
import {DeleteObjectAction, OnChangePaginationAction} from '@/models/storageHomePage';
import FCopyToClipboard from "@/components/FCopyToClipboard";

interface ContentProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function Content({storage, dispatch}: ContentProps) {

  const [objectInfoVisible, setObjectInfoVisible] = React.useState<boolean>(false);
  const [hoverRecord, setHoverRecord] = React.useState<any>(null);

  const columns = [
    {
      title: '对象名称',
      dataIndex: 'name',
      key: 'name',
      render(text: any, record: any) {
        return <Space size={10}>
          <FContentText text={text}/>
          <FCopyToClipboard
            text={`${storage.activatedBucket}/${text}`}
            title={'复制对象名称'}
          />
        </Space>;
      }
    },
    {
      title: '',
      dataIndex: 'tool',
      key: 'tool',
      width: 180,
      render(text: any, record: any) {
        // console.log(hoverRecord, record);
        if (hoverRecord?.key !== record?.key) {
          return null;
        }
        return (<Space size={25}>
          <FTextButton theme={'primary'}>
            <EditOutlined/>
          </FTextButton>
          <FTextButton theme={'primary'}>
            <SendOutlined/>
          </FTextButton>
          <FTextButton
            onClick={() => downloadObject({objectIdOrName: record.id})}
            // onClick={() => window.location.href = apiHost + `/v1/storages/objects/${record.id}/file`}
            theme={'primary'}
          >
            <DownloadOutlined/>
          </FTextButton>
          <FTextButton
            onClick={() => dispatch<DeleteObjectAction>({
              type: 'storageHomePage/deleteObject',
              payload: record.id,
            })}
            className={styles.Delete}
          >
            <DeleteOutlined/>
          </FTextButton>
        </Space>);
      },
      className: styles.columns,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render(text: any, record: any) {
        if (!text) {
          return (<FContentText type="negative" text={'未设置类型'}/>);
        }
        return (<FContentText text={text}/>);
      },
      className: styles.columns,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      className: styles.columns,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 140,
      className: styles.columns,
    },
  ];

  return (<div>

    <Header/>

    <div className={styles.body}>
      <FTable
        columns={columns}
        dataSource={storage.objectList}
        pagination={false}
        onRow={(record) => {
          return {
            // onClick: event => {
            // }, // 点击行
            // onDoubleClick: event => {
            // },
            // onContextMenu: event => {
            // },
            onMouseEnter: (event: any) => {
              // console.log(event, record);
              setHoverRecord(record);
            }, // 鼠标移入行
            onMouseLeave: event => {
              setHoverRecord(null);
            },
          };
        }}
      />
      {
        storage.total !== -1 && (<div className={styles.pagination}>
          <FPagination
            pageSize={storage.pageSize}
            current={storage.pageCurrent}
            total={storage.total}
            onChangeCurrent={(value) => dispatch<OnChangePaginationAction>({
              type: 'storageHomePage/onChangePaginationAction',
              payload: {
                pageCurrent: value,
              },
            })}
            onChangePageSize={(value) => dispatch<OnChangePaginationAction>({
              type: 'storageHomePage/onChangePaginationAction',
              payload: {
                pageSize: value,
              },
            })}
          />
        </div>)
      }

    </div>

    <Drawer
      title={'编辑对象信息'}
      // onClose={() => setModalVisible(false)}
      visible={objectInfoVisible}
      width={720}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Details/>
      {/*<Market/>*/}
    </Drawer>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Content);
