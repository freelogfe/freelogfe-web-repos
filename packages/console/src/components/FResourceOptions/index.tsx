import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface FResourceOptionsProps {
  dataSource: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  onEdit?(value: FResourceOptionsProps['dataSource'][number]): void;

  onDelete?(value: FResourceOptionsProps['dataSource'][number]): void;
}

function FResourceOptions({ dataSource, onEdit, onDelete }: FResourceOptionsProps) {
  return (<div className={styles.styles}>
    {
      dataSource.map((d) => {
        return (<div key={d.key} className={styles.item}>
          <div className={styles.itemHeader}>
            <div className={styles.itemHeaderLeft}>
              <FComponentsLib.FContentText
                text={d.name}
                type={'normal'}
              />
              <FComponentsLib.FContentText
                text={`(${d.key})`}
                type={'additional2'}
              />
            </div>
            <div className={styles.itemHeaderRight}>
              {
                onEdit && (<FComponentsLib.FTextBtn
                  type={'default'}
                  onClick={() => {
                    // onEdit_alterableData && onEdit_alterableData(d);
                    onEdit(d);
                  }}
                >
                  <FComponentsLib.FIcons.FCircleDelete style={{ fontSize: 14 }} />
                </FComponentsLib.FTextBtn>)
              }

              {
                onDelete && (<FComponentsLib.FTextBtn
                  type={'danger'}
                  onClick={() => {
                    // onDelete_alterableData && onDelete_alterableData(d);
                    onDelete(d);
                  }}
                >
                  <FComponentsLib.FIcons.FCircleEdit style={{ fontSize: 14 }} />
                </FComponentsLib.FTextBtn>)
              }

            </div>
          </div>
          <div style={{ height: 5 }} />
          <div className={styles.itemContent}>
            <div className={styles.itemBody}>
              {
                d.type === 'input' && (
                  <FComponentsLib.FContentText text={d.input} type={'additional2'} style={{ color: '#222' }} />)
              }

              {
                d.type === 'select' && d.select.map((s, i) => {
                  if (i !== 0) {
                    return (<React.Fragment key={i}>
                      <span style={{ color: '#E5E7EB' }}>|</span>
                      <FComponentsLib.FContentText text={s} type={'additional2'} style={{ color: '#222' }} />
                    </React.Fragment>);
                  }
                  return (<FComponentsLib.FContentText
                    key={i}
                    text={s}
                    type={'additional2'}
                    style={{ color: '#222' }}
                  />);
                })
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FComponentsLib.FContentText
                text={'配置方式：' + (d.type === 'select' ? '下拉选择器' : '输入框')}
                type={'additional2'}
              />
            </div>
          </div>
        </div>);
      })
    }
  </div>);
}

export default FResourceOptions;
