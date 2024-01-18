import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
// import FOnOffFeedback from '@/components/fOnOffFeedback';
import FTable from '@/components/FTable';
import FComponentsLib from '@freelog/components-lib';
import FModal from '@/components/FModal';
import { FUtil } from '@freelog/tools-lib';

interface FOccupiedFileResourceVersionProps {
  list: {
    resourceID: string;
    resourceName: string;
    resourceType: string[];
    resourceVersion: string;
    url: string;
  }[];
  canOk: boolean;
}

export function fOccupiedFileResourceVersion({ list, canOk }: FOccupiedFileResourceVersionProps): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const divRoot = self.document.body;
    const div = self.document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);

    return root.render(<M
      list={list}
      canOk={canOk}
      onOk={() => {
        resolve(true);
      }}
      onCancel={() => {
        resolve(false);
      }}
      afterClose={() => {
        setTimeout(() => {
          root.unmount();
          div.remove();
        }, 100);
      }}
    />);
  });

}

export default fOccupiedFileResourceVersion;

interface MProps {
  list: {
    resourceID: string;
    resourceName: string;
    resourceType: string[];
    resourceVersion: string;
    url: string;
  }[];
  canOk: boolean;

  onOk(): void;

  onCancel(): void;

  afterClose(): void;
}

function M({ list, canOk, onOk, onCancel, afterClose }: MProps) {
  const [$open, set$open] = FUtil.Hook.useGetState<boolean>(true);
  return (<FModal
    title={null}
    width={920}
    open={$open}
    onCancel={() => {
      onCancel();
      set$open(false);
    }}
    onOk={() => {
      onOk();
      set$open(false);
    }}
    okText={'继续上传'}
    cancelText={'关闭'}
    // cancelText={'取消'}
    okButtonProps={{
      style: {
        display: canOk ? undefined : 'none',
      },
    }}
    afterClose={afterClose}
  >
    <FTable
      // rowClassName={styles.tableRowClassName}
      scroll={{ y: list.length > 5 ? 350 : undefined }}
      columns={[
        {
          title: '资源',
          dataIndex: 'resourceName',
          width: 400,
          render(value, record, index) {
            return (<FComponentsLib.FContentText
              text={record.resourceName}
              style={{ maxWidth: 370 }}
            />);
          },
        },
        {
          title: '类型',
          dataIndex: 'resourceType',
          width: 280,
          render(value, record, index) {
            return (<FComponentsLib.FContentText
              text={record.resourceType.join(' / ')}
            />);
          },
        },
        {
          title: '版本',
          dataIndex: 'resourceVersion',
          width: 160,
          render(value, record, index) {
            return (<FComponentsLib.FContentText
              text={record.resourceVersion}
            />);
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render(value, record, index) {
            return (<FComponentsLib.FTextBtn onClick={() => {
              window.open(record.url);
            }}>查看</FComponentsLib.FTextBtn>);
          },
        },
      ]}
      dataSource={list.map((s) => {
        return {
          key: s.url,
          ...s,
        };
      })}
    />
  </FModal>);
}
