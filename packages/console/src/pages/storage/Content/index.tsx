import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FTable from '@/components/FTable';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState } from '@/models/connect';
import {
  DeleteObjectAction,
  UploadFilesAction,
  FetchObjectsAction, FetchSpaceStatisticAction, FetchBucketsAction,
} from '@/models/storageHomePage';
import FNoDataTip from '@/components/FNoDataTip';
import FUploadTasksPanel from '@/pages/storage/containers/FUploadTasksPanel';
import FLoadingTip from '@/components/FLoadingTip';
import { ColumnsType } from 'antd/lib/table/interface';
import FTooltip from '@/components/FTooltip';
import FLink from '@/components/FLink';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import NoBucket from '@/pages/storage/NoBucket';
import FListFooter from '@/components/FListFooter';
import FComponentsLib from '@freelog/components-lib';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import FStorageUploadTasksPanel from '@/components/FStorageUploadTasksPanel';

interface ContentProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Content({ storageHomePage, dispatch }: ContentProps) {

  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  const columns: ColumnsType<NonNullable<StorageHomePageModelState['object_List']>[number]> = [
    {
      title: (<FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('object_name')} />),
      dataIndex: 'name',
      key: 'name',
      render(text, record) {
        return (<Space size={10}>
          <FComponentsLib.FContentText type='normal' text={text} />
          <div className={styles.hoverVisible}>
            <FComponentsLib.FCopyToClipboard
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
                message: FI18n.i18nNext.t('msg_delete_object_confirm'),
                cancelText: FI18n.i18nNext.t('btn_cancel'),
                okText: FI18n.i18nNext.t('btn_delete_object'),
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
      title: (<FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('resource_type')} />),
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render(text, record) {
        // console.log(record, 'record890wieojfsdifjsdlkfjsd;lkfjasdlf');
        if (record.type.length === 0) {
          return (<FComponentsLib.FContentText type='negative' text={'未设置类型'} />);
        }
        return (<FComponentsLib.FContentText text={FUtil.Format.resourceTypeKeyArrToResourceType(record.type)} />);
      },
      // className: styles.columns,
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('size')} />),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      // className: styles.columns,
      render(text: any, record: any): any {
        return (<FComponentsLib.FContentText type='normal' text={text} />);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('last_updated_time')} />),
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      // className: styles.columns,
      render(text: any, record: any): any {
        return (<FComponentsLib.FContentText type='normal' text={text} />);
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
      storageHomePage.total === 0 && storageHomePage.filterInput !== '' && (<>
        <FNoDataTip
          height={'calc(100vh - 170px)'}
          tipText={'无搜索结果'}
        />
      </>)
    }

    {
      storageHomePage.total === 0 && storageHomePage.filterInput === '' && (<>
        <FNoDataTip
          height={'calc(100vh - 170px)'}
          tipText={FI18n.i18nNext.t('objects_list_empty')}
          btn={<FComponentsLib.FRectBtn
            onClick={async () => {
              const files = await fReadLocalFiles({
                multiple: true,
              });
              if (!files) {
                return;
              }

              dispatch<UploadFilesAction>({
                type: 'storageHomePage/uploadFiles',
                payload: files,
              });
            }}
            size='large'
            type='primary'
            style={{ paddingLeft: 50, paddingRight: 50 }}
          >{FI18n.i18nNext.t('upload_object')}</FComponentsLib.FRectBtn>}
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

    {/*<FUploadTasksPanel />*/}
    <FStorageUploadTasksPanel
      bucketName={storageHomePage.activatedBucket}
      availableStorageSize={storageHomePage.totalStorage - storageHomePage.usedStorage}
      onSuccess={() => {
        dispatch<FetchObjectsAction>({
          type: 'storageHomePage/fetchObjects',
          payload: 'insert',
        });
        dispatch<FetchSpaceStatisticAction>({
          type: 'storageHomePage/fetchSpaceStatistic',
        });
        dispatch<FetchBucketsAction>({
          type: 'storageHomePage/fetchBuckets',
        });
      }}
    />
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
        })}><FComponentsLib.FIcons.FEdit /></FLink>
      </FTooltip>)
    }
    {
      showDownload && (<FTooltip title={FI18n.i18nNext.t('tip_download_object')}>
        <span>
          <FComponentsLib.FTextBtn
            onClick={() => onClickDownload && onClickDownload()}
            type='primary'
          ><FComponentsLib.FIcons.FDownload /></FComponentsLib.FTextBtn>
        </span>
      </FTooltip>)
    }
    {
      showDelete && (
        <FTooltip title={FI18n.i18nNext.t('tip_delete')}>
          <span>
            <FComponentsLib.FTextBtn
              type={'danger'}
              onClick={() => onClickDelete && onClickDelete()}
              className={styles.Delete}
            ><FComponentsLib.FIcons.FDelete /></FComponentsLib.FTextBtn>
          </span>
        </FTooltip>
      )
    }
  </Space>);
}
