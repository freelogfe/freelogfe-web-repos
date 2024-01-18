import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import img from '@/assets/file-object.svg';
import { RcFile } from 'antd/lib/upload/interface';
import FTable from '@/components/FTable';
import FModal from '@/components/FModal';
import { useGetState } from '@/utils/hooks';
import fOccupiedFileResourceVersion from '@/components/fOccupiedFileResourceVersion';

interface ErrorCardProps {
  order: number;
  errorInfo: {
    uid: string;
    file: RcFile | null;
    fileName: string;
    from: string;
    errorText: string;
    occupancyResource?: {
      resourceID: string;
      resourceName: string;
      resourceType: string[];
      resourceVersion: string;
      url: string;
    }[];
  };

  onDelete?(): void;
}

function ErrorCard({ order, errorInfo, onDelete }: ErrorCardProps) {
  // const [$otherUsedResource, set$otherUsedResource, get$otherUsedResource] = useGetState<{
  //   resourceID: string;
  //   resourceName: string;
  //   resourceType: string[];
  //   resourceVersion: string;
  //   url: string;
  // }[]>([]);

  return (<div className={styles.resourceContainer}>
    <div className={styles.resourceOrder}>
      <FComponentsLib.FContentText
        text={FI18n.i18nNext.t('brr_resourcelisting_item_no', {
          ResourceNO: order,
        })}
        type={'highlight'}
        style={{ fontSize: 12 }}
      />
      <FComponentsLib.FTextBtn
        style={{ fontSize: 12 }}
        type={'danger'}
        onClick={() => {
          onDelete && onDelete();
          // const dataSource: HandleStates['dataSource'] = get$dataSource()
          //   .filter((rli) => {
          //     return rli.uid !== r.uid;
          //   });
          // set$dataSource(dataSource);
        }}
      >
        <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
        &nbsp;{FI18n.i18nNext.t('brr_resourcelisting_item_btn_deleteitem')}
      </FComponentsLib.FTextBtn>
    </div>
    <div style={{ height: 5 }} />
    <div className={styles.fileInfo}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={errorInfo.fileName}
            style={{ maxWidth: 600 }}
            singleRow
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={errorInfo.from}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FComponentsLib.FTextBtn
          type='danger'
          style={{ fontSize: 12 }}
        >{errorInfo.errorText}</FComponentsLib.FTextBtn>

        {
          errorInfo.occupancyResource && (<FComponentsLib.FTextBtn
            type='primary'
            style={{ fontSize: 12 }}
            onClick={async () => {
              // set$otherUsedResource(errorInfo.occupancyResource || []);
              if (!errorInfo.occupancyResource) {
                return;
              }
              await fOccupiedFileResourceVersion({
                list: errorInfo.occupancyResource,
                canOk: false,
              });
            }}
          >查看</FComponentsLib.FTextBtn>)
        }

      </div>
    </div>

    {/*<FModal*/}
    {/*  title={null}*/}
    {/*  width={920}*/}
    {/*  open={$otherUsedResource.length > 0}*/}
    {/*  onCancel={() => {*/}
    {/*    set$otherUsedResource([]);*/}
    {/*  }}*/}
    {/*  onOk={() => {*/}
    {/*    set$otherUsedResource([]);*/}
    {/*  }}*/}
    {/*  okText={'关闭'}*/}
    {/*  // cancelText={'取消'}*/}
    {/*  cancelButtonProps={{*/}
    {/*    style: {*/}
    {/*      display: 'none',*/}
    {/*    },*/}
    {/*  }}*/}
    {/*>*/}
    {/*  <FTable*/}
    {/*    // rowClassName={styles.tableRowClassName}*/}
    {/*    scroll={{ y: $otherUsedResource.length > 5 ? 350 : undefined }}*/}
    {/*    columns={[*/}
    {/*      {*/}
    {/*        title: '资源',*/}
    {/*        dataIndex: 'resourceName',*/}
    {/*        width: 400,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceName}*/}
    {/*            style={{ maxWidth: 370 }}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '类型',*/}
    {/*        dataIndex: 'resourceType',*/}
    {/*        width: 280,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceType.join(' / ')}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '版本',*/}
    {/*        dataIndex: 'resourceVersion',*/}
    {/*        width: 160,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceVersion}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '操作',*/}
    {/*        dataIndex: 'operation',*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FTextBtn onClick={() => {*/}
    {/*            window.open(record.url);*/}
    {/*          }}>查看</FComponentsLib.FTextBtn>);*/}
    {/*        },*/}
    {/*      },*/}
    {/*    ]}*/}
    {/*    dataSource={$otherUsedResource.map((sfur) => {*/}
    {/*      return {*/}
    {/*        key: sfur.url,*/}
    {/*        ...sfur,*/}
    {/*      };*/}
    {/*    })}*/}
    {/*  />*/}
    {/*</FModal>*/}
  </div>);
}

export default ErrorCard;
