import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {Space} from 'antd';
import FTable from '@/components/FTable';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {
  DeleteObjectAction,
  UploadFilesAction,
  ChangeAction as HomePageChangeAction,
  FetchObjectsAction,
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
import {ColumnsType} from "antd/lib/table/interface";
import {Link} from 'umi';
import FTooltip from "@/components/FTooltip";
import FLink from "@/components/FLink";
import fConfirmModal from "@/components/fConfirmModal";
import FUtil from "@/utils";
import {FApiServer} from "@/services";
import NoBucket from "@/pages/storage/NoBucket";

interface ContentProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Content({storageHomePage, dispatch}: ContentProps) {

  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  const columns: ColumnsType<NonNullable<StorageHomePageModelState['objectList']>[number]> = [
    {
      title: '对象名称',
      dataIndex: 'name',
      key: 'name',
      render(text: any, record: any) {
        return (<Space size={10}>
          <FContentText text={text}/>
          <div className={styles.hoverVisible}>
            <FCopyToClipboard
              text={`${storageHomePage.activatedBucket}/${text}`}
              title={'复制对象名称'}
            />
          </div>
        </Space>);
      },
    },
    {
      title: '',
      dataIndex: 'tool',
      key: 'tool',
      width: 150,
      render(text: any, record) {
        return (<div className={styles.hoverVisible}>
          <ToolsBar
            bucketName={record.bucketName}
            objectID={record.id}
            showDelete={!isUserDataBucket}
            showEdit={!isUserDataBucket}
            onClickDownload={() => FApiServer.Storage.downloadObject({objectIdOrName: record.id})}
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
      width: 140,
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
      width: 120,
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

  if (storageHomePage.bucketList?.length === 0) {
    return (<NoBucket/>);
  }

  return (<div>

    {
      storageHomePage.total === -1 && (<FLoadingTip height={'calc(100vh - 170px)'}/>)
    }

    {
      storageHomePage.total === 0 && (<>
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
            }}><FRectBtn>上传对象</FRectBtn></FUpload>}
        />
      </>)
    }

    {
      storageHomePage.total > 0 && (<InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={() => {
          if (storageHomePage.isLoading || storageHomePage.total === -1) {
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
        hasMore={!storageHomePage.isLoading && storageHomePage.total !== -1 && storageHomePage.objectList.length < storageHomePage.total}
      >
        <div className={styles.body}>
          <FTable
            rowClassName={styles.rowClassName}
            columns={columns}
            dataSource={storageHomePage.objectList}
            pagination={false}
          />
        </div>
        {storageHomePage.isLoading && <div className={styles.loader} key={0}>Loading ...</div>}
      </InfiniteScroll>)
    }

    <FUploadTasksPanel/>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
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
        <FLink to={FUtil.LinkTo.objectDetails({
          bucketName,
          objectID: objectID,
        })}><FEdit/></FLink>
      </FTooltip>)
    }
    {
      showDownload && (<FTooltip title={'下载'}>
        <span>
          <FTextBtn
            onClick={() => onClickDownload && onClickDownload()}
            type="primary"
          ><FDownload/></FTextBtn>
        </span>
      </FTooltip>)
    }
    {
      showDelete && (
        <FTooltip title={'删除'}>
          <span>
            <FTextBtn
              onClick={() => onClickDelete && onClickDelete()}
              className={styles.Delete}
            ><FDelete/></FTextBtn>
          </span>
        </FTooltip>
      )
    }
  </Space>)
}
