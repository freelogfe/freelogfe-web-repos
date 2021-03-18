import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {Space, Popconfirm, Modal} from 'antd';
import FTable from '@/components/FTable';
import Details from '@/pages/storage/Content/Details';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState, StorageHomePageModelState} from '@/models/connect';
import {downloadObject} from '@/services/storages';
import {
  DeleteObjectAction,
  UploadFilesAction,
  ChangeAction as HomePageChangeAction, FetchObjectsAction, DeleteBucketByNameAction
} from '@/models/storageHomePage';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {FDelete, FEdit, FWarning} from "@/components/FIcons";
import FNoDataTip from "@/components/FNoDataTip";
import FUploadTasksPanel from "@/pages/storage/containers/FUploadTasksPanel";
import FUpload from "@/components/FUpload";
import {RcFile} from "antd/lib/upload/interface";
import FLoadingTip from "@/components/FLoadingTip";
import InfiniteScroll from 'react-infinite-scroller';
import FDownload from "@/components/FIcons/FDownload";
import FLinkTo from "@/utils/path-assembler";
import {ColumnsType} from "antd/lib/table/interface";
import {Link} from 'umi';
import FTooltip from "@/components/FTooltip";
import FLink from "@/components/FLink";
import fConfirmModal from "@/components/fConfirmModal";

interface ContentProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function Content({storage, dispatch}: ContentProps) {

  const isUserDataBucket = storage.activatedBucket === '.UserNodeData';

  const columns: ColumnsType<NonNullable<StorageHomePageModelState['objectList']>[number]> = [
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
      },
    },
    {
      title: '',
      dataIndex: 'tool',
      key: 'tool',
      width: 180,
      render(text: any, record) {
        return (<div className={styles.hoverVisible}>
          <ToolsBar
            bucketName={record.bucketName}
            objectID={record.id}
            showDelete={!isUserDataBucket}
            showEdit={!isUserDataBucket}
            onClickDownload={() => downloadObject({objectIdOrName: record.id})}
            onClickDelete={() => {
              fConfirmModal({
                message: '存储空间对象一旦删除则无法恢复，确认删除吗？',
                onOk() {
                  onClickDelete(record);
                },
              });
            }}
          />
        </div>);
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

  // function onClickEdit(record) {
  //   dispatch<FetchInfoAction>({
  //     type: 'storageObjectEditor/fetchInfo',
  //     payload: record.id,
  //   });
  //   dispatch<ChangeAction>({
  //     type: 'storageObjectEditor/change',
  //     payload: {
  //       visible: true,
  //     },
  //   });
  // }

  function onClickDelete(record: any) {
    dispatch<DeleteObjectAction>({
      type: 'storageHomePage/deleteObject',
      payload: record.id,
    });
  }

  return (<div>

    {
      storage.total === -1 && (<FLoadingTip height={'calc(100vh - 170px)'}/>)
    }

    {
      storage.total === 0 && (<>
        <FNoDataTip
          height={'calc(100vh - 170px)'}
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
        />
      </>)
    }

    {
      storage.total > 0 && (<InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={() => {
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
      >
        <div className={styles.body}>
          <FTable
            rowClassName={styles.rowClassName}
            columns={columns}
            dataSource={storage.objectList}
            pagination={false}
          />
        </div>
        {storage.isLoading && <div className={styles.loader} key={0}>Loading ...</div>}
      </InfiniteScroll>)
    }

    <Details/>

    <FUploadTasksPanel/>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Content);

interface ToolsBarProps {
  bucketName: string;
  objectID: string;
  showEdit?: boolean;
  showDownload?: boolean;
  showDelete?: boolean;

  // onClickEdit?(): void;

  onClickDownload?(): void;

  onClickDelete?(): void;
}

function ToolsBar({bucketName, objectID, showEdit = true, showDownload = true, showDelete = true, onClickDownload, onClickDelete}: ToolsBarProps) {
  return (<Space
    className={styles.toolBar}
    // style={{visibility: hoverRecord?.key !== record?.key ? 'visibility' : 'inherit'} as CSSProperties}
    size={25}>
    {
      showEdit && (<FTooltip title={'编辑'}>
        <FLink to={FLinkTo.objectDetails({
          bucketName,
          objectID: objectID,
        })}><FEdit/></FLink>
      </FTooltip>)
    }
    {
      showDownload && (<FTooltip title={'下载'}>
        <FTextButton
          onClick={() => onClickDownload && onClickDownload()}
          theme={'primary'}
        ><FDownload/></FTextButton>
      </FTooltip>)
    }
    {
      showDelete && (
        <FTooltip title={'删除'}>
          <FTextButton
            onClick={() => onClickDelete && onClickDelete()}
            className={styles.Delete}
          ><FDelete/></FTextButton>
        </FTooltip>
      )
    }
  </Space>)
}
