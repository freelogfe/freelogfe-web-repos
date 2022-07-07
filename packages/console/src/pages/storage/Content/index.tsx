import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { Space } from 'antd';
import FTable from '@/components/FTable';
import { connect, Dispatch } from 'dva';
import { ConnectState, StorageHomePageModelState } from '@/models/connect';
import {
  DeleteObjectAction,
  UploadFilesAction,
  FetchObjectsAction,
} from '@/models/storageHomePage';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {
  FDelete, FEdit,
} from '@/components/FIcons';
import FNoDataTip from '@/components/FNoDataTip';
import FUploadTasksPanel from '@/pages/storage/containers/FUploadTasksPanel';
import FUpload from '@/components/FUpload';
import { RcFile } from 'antd/lib/upload/interface';
import FLoadingTip from '@/components/FLoadingTip';
import FDownload from '@/components/FIcons/FDownload';
import { ColumnsType } from 'antd/lib/table/interface';
import FTooltip from '@/components/FTooltip';
import FLink from '@/components/FLink';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import NoBucket from '@/pages/storage/NoBucket';
import FListFooter from '@/components/FListFooter';

interface ContentProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Content({ storageHomePage, dispatch }: ContentProps) {

  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  const columns: ColumnsType<NonNullable<StorageHomePageModelState['object_List']>[number]> = [
    {
      title: (<FTitleText type='table' text={FI18n.i18nNext.t('object_name')} />),
      dataIndex: 'name',
      key: 'name',
      render(text, record) {
        return (<Space size={10}>
          <FContentText type='normal' text={text} />
          <div className={styles.hoverVisible}>
            <FCopyToClipboard
              text={`${storageHomePage.activatedBucket}/${text}`}
              title={FI18n.i18nNext.t('copy_object_name')}
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
      render(text, record) {
        return (<div className={styles.hoverVisible}>
          <ToolsBar
            bucketName={record.bucketName}
            objectID={record.id}
            showDelete={!isUserDataBucket}
            showEdit={!isUserDataBucket}
            onClickDownload={() => FServiceAPI.Storage.downloadObject({ objectIdOrName: record.id })}
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
      // className: styles.columns,
    },
    {
      title: (<FTitleText type='table' text={FI18n.i18nNext.t('resource_type')} />),
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render(text, record) {
        console.log(record, 'record');
        if (record.type.length === 0) {
          return (<FContentText type='negative' text={'未设置类型'} />);
        }
        return (<FContentText text={FUtil.Format.resourceTypeKeyArrToResourceType(record.type)} />);
      },
      // className: styles.columns,
    },
    {
      title: (<FTitleText type='table' text={FI18n.i18nNext.t('size')} />),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      // className: styles.columns,
      render(text: any, record: any): any {
        return (<FContentText type='normal' text={text} />);
      },
    },
    {
      title: (<FTitleText type='table' text={FI18n.i18nNext.t('last_updated_time')} />),
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      // className: styles.columns,
      render(text: any, record: any): any {
        return (<FContentText type='normal' text={text} />);
      },
    },
  ];

  function onClickDelete(record: any) {
    dispatch<DeleteObjectAction>({
      type: 'storageHomePage/deleteObject',
      payload: record.id,
    });
  }

  if (storageHomePage.bucketList?.length === 0) {
    return (<NoBucket />);
  }

  return (<div>
    {
      storageHomePage.total === -1 && (<FLoadingTip height={'calc(100vh - 170px)'} />)
    }

    {
      storageHomePage.total === 0 && (<>
        <FNoDataTip
          height={'calc(100vh - 170px)'}
          // tipText={'当前Bucket还没有上传任何对象'}
          tipText={FI18n.i18nNext.t('objects_list_empty')}
          btn={<FUpload
            showUploadList={false}
            multiple={true}
            beforeUpload={(file: RcFile, fileList: RcFile[]) => {
              if (file === fileList[fileList.length - 1]) {
                dispatch<UploadFilesAction>({
                  type: 'storageHomePage/uploadFiles',
                  payload: fileList,
                });
              }
              return false;
            }}>
            <FRectBtn
              size='large'
              type='primary'
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >{FI18n.i18nNext.t('upload_object')}</FRectBtn>
          </FUpload>}
        />
      </>)
    }

    {
      storageHomePage.total > 0 && (<>
        <div className={styles.body}>
          <FTable
            rowClassName={styles.rowClassName}
            columns={columns}
            dataSource={storageHomePage.object_List}
            pagination={false}
          />
          <FListFooter
            state={storageHomePage.object_ListMore}
            onClickLoadMore={() => {
              dispatch<FetchObjectsAction>({
                type: 'storageHomePage/fetchObjects',
                payload: 'append',
              });
            }}
          />
        </div>

      </>)
    }

    <FUploadTasksPanel />
  </div>);
}


export default connect(({ storageHomePage }: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Content);

interface ToolsBarProps {
  bucketName: string;
  objectID: string;
  showEdit?: boolean;
  showDownload?: boolean;
  showDelete?: boolean;

  onClickDownload?(): void;

  onClickDelete?(): void;
}

function ToolsBar({
                    bucketName,
                    objectID,
                    showEdit = true,
                    showDownload = true,
                    showDelete = true,
                    onClickDownload,
                    onClickDelete,
                  }: ToolsBarProps) {
  return (<Space
    className={styles.toolBar}
    // style={{visibility: hoverRecord?.key !== record?.key ? 'visibility' : 'inherit'} as CSSProperties}
    size={25}>
    {
      showEdit && (<FTooltip title={FI18n.i18nNext.t('tip_edit_object')}>
        <FLink to={FUtil.LinkTo.objectDetails({
          bucketName,
          objectID: objectID,
        })}><FEdit /></FLink>
      </FTooltip>)
    }
    {
      showDownload && (<FTooltip title={FI18n.i18nNext.t('tip_download_object')}>
        <span>
          <FTextBtn
            onClick={() => onClickDownload && onClickDownload()}
            type='primary'
          ><FDownload /></FTextBtn>
        </span>
      </FTooltip>)
    }
    {
      showDelete && (
        <FTooltip title={FI18n.i18nNext.t('tip_delete')}>
          <span>
            <FTextBtn
              onClick={() => onClickDelete && onClickDelete()}
              className={styles.Delete}
            ><FDelete /></FTextBtn>
          </span>
        </FTooltip>
      )
    }
  </Space>);
}
