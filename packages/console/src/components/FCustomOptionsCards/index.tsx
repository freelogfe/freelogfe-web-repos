import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FTooltip from '../FTooltip';
// import { FInfo } from '../FIcons';
import FDivider from '../FDivider';
import fConfirmModal from '@/components/fConfirmModal';
import FComponentsLib from '@freelog/components-lib';

interface FCustomOptionsCardsProps {
  dataSource: {
    theKey: string;
    description: string;
    type: 'input' | 'select';
    value: string;
  }[];

  onEdit?(theKey: string): void;

  onDelete?(theKey: string): void;
}

function FCustomOptionsCards({ dataSource, onEdit, onDelete }: FCustomOptionsCardsProps) {
  return (<div className={styles.customOptions1}>

    {
      dataSource.map((ds) => {
        return (<div key={ds.theKey} className={styles.customOptions1Item}>
          <div>
            <Space size={5}>
              <FComponentsLib.FContentText text={ds.theKey} type='additional2' />
              {
                ds.description
                  ? (<FTooltip title={ds.description}><FComponentsLib.FIcons.FInfo style={{ cursor: 'pointer', fontSize: 14 }} /></FTooltip>)
                  : null
              }

            </Space>
            <div style={{ height: 10 }} />
            <Space size={5}>
              <FComponentsLib.FContentText text={ds.type === 'select' ? '下拉框' : '输入框'} />
              <FDivider />
              {
                ds.value !== ''
                  ? (<FComponentsLib.FContentText
                    text={ds.value}
                    style={{ maxWidth: 500 }}
                    singleRow
                  />)
                  : (<FComponentsLib.FContentText
                    text={'未填写默认值'}
                    style={{ maxWidth: 500 }}
                    singleRow
                    type='negative'
                  />)
              }

            </Space>
          </div>
          <div style={{ width: 10 }} />
          <Space size={10} className={styles.customOptions1ItemOperation}>
            {
              onEdit && (<FTooltip title={'编辑'}>
                <div>
                  <FComponentsLib.FCircleBtn
                    type='minor'
                    onClick={() => {
                      onEdit(ds.theKey);
                    }}
                  />
                </div>
              </FTooltip>)
            }

            {
              onDelete && (<FTooltip title={'删除'}>
                <div>
                  <FComponentsLib.FCircleBtn
                    style={{ width: 20, height: 20 }}
                    onClick={() => {
                      fConfirmModal({
                        message: '一旦删除则无法恢复，确认删除吗？',
                        onOk() {
                          onDelete(ds.theKey);
                        },
                      });
                    }}
                    type='danger'
                  />
                </div>
              </FTooltip>)
            }

          </Space>
        </div>);
      })
    }


  </div>);
}

export default FCustomOptionsCards;

// function fn(num: number) {
//   return Array(num).fill(null).map((n, i) => '' + n + i);
// }
