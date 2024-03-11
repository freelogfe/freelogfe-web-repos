import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FResourcePropertyAndOptionTipPopover from '@/components/FResourcePropertyAndOptionTipPopover';

interface FResourceOptionsProps {
  dataSource: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];
  theme?: 'dark' | 'light';

  onEdit?(value: FResourceOptionsProps['dataSource'][number]): void;

  onDelete?(value: FResourceOptionsProps['dataSource'][number]): void;
}

function FResourceOptions({ dataSource, theme = 'light', onEdit, onDelete }: FResourceOptionsProps) {
  return (<div className={styles.styles}>
    {
      dataSource.map((d) => {
        return (<div key={d.key} className={styles.item}>
          <div className={styles.itemHeader}>
            <div className={styles.itemHeaderLeft}>
              <FResourcePropertyAndOptionTipPopover
                info={{
                  key: d.key,
                  name: d.name,
                  description: d.description,
                }}
                type={'option'}
              >
                <div><FComponentsLib.FContentText
                  text={d.name}
                  type={'normal'}
                /></div>
              </FResourcePropertyAndOptionTipPopover>
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
          <div className={styles.itemContent}
               style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,.02)' : 'white' }}>
            <div className={styles.itemBody}>
              {
                d.type === 'input' && (
                  <div
                    style={{ color: '#222', fontSize: 12, flexShrink: 1, overflowWrap: 'break-word', maxWidth: 650 }}>
                    {d.input}
                  </div>
                )
              }

              {
                d.type === 'select' && d.select.map((s, i) => {
                  if (i !== 0) {
                    return (<React.Fragment key={i}>
                      <span style={{ color: '#E5E7EB' }}>|</span>
                      <FComponentsLib.FContentText
                        text={s}
                        type={'additional2'}
                        style={{ color: '#222', maxWidth: 650 }}
                        singleRow
                      />
                    </React.Fragment>);
                  }
                  return (<FComponentsLib.FContentText
                    key={i}
                    text={s}
                    type={'additional2'}
                    style={{ color: '#222', maxWidth: 650 }}
                    singleRow
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
