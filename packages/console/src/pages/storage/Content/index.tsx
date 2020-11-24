import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {Drawer, Row, Space, Col} from 'antd';
import FTable from '@/components/FTable';
import {EditOutlined, SnippetsOutlined, SendOutlined, DownloadOutlined, DeleteOutlined} from '@ant-design/icons';
import Header from '../Header';
import Details from '@/pages/storage/Content/Details';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {downloadObject} from '@/services/storages';
import FPagination from '@/components/FPagination';
import {
  DeleteObjectAction,
  // OnChangePaginationAction,
  UploadFilesAction,
  ChangeAction as HomePageChangeAction, FetchObjectsAction
} from '@/models/storageHomePage';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {ChangeAction, FetchInfoAction} from "@/models/storageObjectEditor";
import {FDelete} from "@/components/FIcons";
import FNoDataTip from "@/components/FNoDataTip";
import FUploadTasksPanel from "@/pages/storage/containers/FUploadTasksPanel";
import FUpload from "@/components/FUpload";
import {RcFile} from "antd/lib/upload/interface";
import FLoadingTip from "@/components/FLoadingTip";
import InfiniteScroll from 'react-infinite-scroller';

interface ContentProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function Content({storage, dispatch}: ContentProps) {

  // const [objectInfoVisible, setObjectInfoVisible] = React.useState<boolean>(false);
  const [hoverRecord, setHoverRecord] = React.useState<any>(null);
  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 170);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 170);
  }

  const columns = [
    {
      title: '对象名称',
      dataIndex: 'name',
      key: 'name',
      render(text: any, record: any) {
        return (<Space size={10}>
          <FContentText text={text}/>
          <FCopyToClipboard
            text={`${storage.activatedBucket}/${text}`}
            title={'复制对象名称'}
          />
        </Space>);
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
          <FTextButton
            onClick={() => {
              // console.log(record, 'RREAcf90s8o');
              dispatch<FetchInfoAction>({
                type: 'storageObjectEditor/fetchInfo',
                payload: record.id,
              });
              dispatch<ChangeAction>({
                type: 'storageObjectEditor/change',
                payload: {
                  visible: true,
                },
              });
            }}
            theme={'primary'}
          >
            <EditOutlined/>
          </FTextButton>
          {/*<FTextButton theme={'primary'}>*/}
          {/*  <SendOutlined/>*/}
          {/*</FTextButton>*/}
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
            <FDelete/>
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

    {
      storage.total === -1 && (<FLoadingTip height={minHeight}/>)
    }

    {
      storage.total === 0 && (<FNoDataTip
        height={minHeight}
        tipText={'当前Bucket还没有上传任何对象'}
        btn={<FUpload
          showUploadList={false}
          multiple={true}
          beforeUpload={(file: RcFile, fileList: RcFile[]) => {
            // console.log(file, FileList, 'beforeUpload 24ew890sio;');
            if (file === fileList[fileList.length - 1]) {
              // console.log('0923uiojfdaslk');
              dispatch<UploadFilesAction>({
                type: 'storageHomePage/uploadFiles',
                payload: fileList,
              });
            }
            return false;
          }}><FNormalButton>上传对象</FNormalButton></FUpload>}
      />)
    }

    {
      storage.total > 0 && (<InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={(page: number) => {
          // console.log(page, 'page23904');
          console.log(storage, '9023jstoragestorage');
          if (storage.isLoading || storage.total === -1) {
            return;
          }
          dispatch<HomePageChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              isLoading: true,
            },
          });
          dispatch<FetchObjectsAction>({
            type: 'storageHomePage/fetchObjects',
            payload: 'append',
          });
        }}
        hasMore={!storage.isLoading && storage.total !== -1 && storage.objectList.length < storage.total}
        // loader={}
      >
        <div className={styles.body}>
          <FTable
            columns={columns}
            dataSource={storage.objectList}
            pagination={false}
            onRow={(record) => {
              return {
                onMouseEnter: (event: any) => {
                  setHoverRecord(record);
                }, // 鼠标移入行
                onMouseLeave: event => {
                  setHoverRecord(null);
                },
              };
            }}
          />
        </div>
        {storage.isLoading && <div className={styles.loader} key={0}>Loading ...</div>}
      </InfiniteScroll>)
    }

    {!storage.isLoading && <div style={{height: 100}}/>}
    <Details/>

    <FUploadTasksPanel/>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Content);
