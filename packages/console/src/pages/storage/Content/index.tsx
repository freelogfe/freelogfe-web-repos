import * as React from 'react';
import styles from './index.less';
import { Checkbox, Modal, Space } from 'antd';
import FTable from '@/components/FTable';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState } from '@/models/connect';
import {
  DeleteObjectAction,
  FetchObjectsAction,
  FetchSpaceStatisticAction,
  FetchBucketsAction,
  ChangeAction,
  OnBatchDeleteObjectsAction,
  OnBatchUpdateObjectsAction,
} from '@/models/storageHomePage';
import FNoDataTip from '@/components/FNoDataTip';
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
import FStorageUploadTasksPanel, { getStorageUploadTasksPanel } from '@/components/FStorageUploadTasksPanel';
import * as AHooks from 'ahooks';
import Details from './Details';
import fCenterMessage from '@/components/fCenterMessage';

interface ContentProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Content({ storageHomePage, dispatch }: ContentProps) {

  AHooks.useDebounceEffect(() => {
    const allIDs: string[] = storageHomePage.object_List.map((ol) => {
      return ol.id;
    });

    dispatch<ChangeAction>({
      type: 'storageHomePage/change',
      payload: {
        checkedObjectIDs: storageHomePage.checkedObjectIDs.filter((id) => {
          return allIDs.includes(id);
        }),
      },
    });

  }, [storageHomePage.object_List], {
    wait: 30,
  });


  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  const columns: ColumnsType<NonNullable<StorageHomePageModelState['object_List']>[number]> = [
    {
      title: <Space size={5}>
        <Checkbox
          checked={storageHomePage.checkedObjectIDs.length === storageHomePage.object_List.length}
          indeterminate={storageHomePage.checkedObjectIDs.length !== 0 && storageHomePage.checkedObjectIDs.length !== storageHomePage.object_List.length}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch<ChangeAction>({
                type: 'storageHomePage/change',
                payload: {
                  checkedObjectIDs: storageHomePage.object_List.map((o) => {
                    return o.id;
                  }),
                },
              });
            } else {
              dispatch<ChangeAction>({
                type: 'storageHomePage/change',
                payload: {
                  checkedObjectIDs: [],
                },
              });
            }
          }}
        />
        <FComponentsLib.FTitleText
          style={{ display: 'inline-block' }}
          type='table'
          text={'全选'}
        />
      </Space>,
      dataIndex: 'checked',
      key: 'checked',
      render(text, record) {
        return (<Checkbox
          checked={storageHomePage.checkedObjectIDs.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch<ChangeAction>({
                type: 'storageHomePage/change',
                payload: {
                  checkedObjectIDs: [
                    ...storageHomePage.checkedObjectIDs,
                    record.id,
                  ],
                },
              });
            } else {
              dispatch<ChangeAction>({
                type: 'storageHomePage/change',
                payload: {
                  checkedObjectIDs: storageHomePage.checkedObjectIDs.filter((id) => {
                    return id !== record.id;
                  }),
                },
              });
            }
          }} />);
      },
      width: 100,
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('object_name')} />),
      dataIndex: 'name',
      key: 'name',
      render(text, record) {
        return (<Space size={10}>
          <FComponentsLib.FContentText type='normal' text={text} singleRow style={{ maxWidth: 700 }} />
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
      storageHomePage.object_ListState === 'loading' && (<FLoadingTip height={'calc(100vh - 170px)'} />)
    }

    {
      storageHomePage.object_ListState === 'noData' && storageHomePage.filterInput === '' && (<>
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
              (await getStorageUploadTasksPanel()).addTask(files);
            }}
            size='large'
            type='primary'
            style={{ paddingLeft: 50, paddingRight: 50 }}
          >{FI18n.i18nNext.t('upload_object')}</FComponentsLib.FRectBtn>}
        />
      </>)
    }

    {
      storageHomePage.object_ListState === 'noSearchResult' && storageHomePage.filterInput !== '' && (<>
        <FNoDataTip
          height={'calc(100vh - 170px)'}
          tipText={'无搜索结果'}
        />
      </>)
    }

    {
      storageHomePage.object_ListState === 'loaded' && (<>

        {
          storageHomePage.checkedObjectIDs.length > 0 && (<>
            <div className={styles.handled}>
              <FComponentsLib.FContentText
                type={'additional2'}
                style={{ fontSize: 14 }}
                // text={'已选择2个对象，可进行操作:'}
                text={FI18n.i18nNext.t('storage_bulkaction_label_selectedqty')}
              />
              <FComponentsLib.FTextBtn
                // disabled={storageHomePage.checkedObjectIDs.length === 0}
                type={'primary'}
                onClick={() => {
                  if (storageHomePage.checkedObjectIDs.length === 0) {
                    return fCenterMessage({ message: '请选择要执行操作的对象' });
                  }
                  dispatch<OnBatchUpdateObjectsAction>({
                    type: 'storageHomePage/onBatchUpdateObjects',
                  });
                }}
              >
                <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                &nbsp;{FI18n.i18nNext.t('storage_bulkaction_btn_settype')}
              </FComponentsLib.FTextBtn>

              <FComponentsLib.FTextBtn
                type={'danger'}
                // disabled={storageHomePage.checkedObjectIDs.length === 0}
                onClick={() => {
                  // console.log('(*YOIOIUY*(OUOIJLKJLkj');
                  if (storageHomePage.checkedObjectIDs.length === 0) {
                    return fCenterMessage({ message: '请选择要执行操作的对象' });
                  }
                  dispatch<OnBatchDeleteObjectsAction>({
                    type: 'storageHomePage/onBatchDeleteObjects',
                  });
                }}
              >
                <FComponentsLib.FIcons.FDelete
                  style={{ fontSize: 14 }}
                />
                &nbsp;{FI18n.i18nNext.t('storage_bulkaction_btn_deleteobject')}
              </FComponentsLib.FTextBtn>
            </div>
            <div style={{ height: 30 }} />
          </>)
        }


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

    <Details />
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
