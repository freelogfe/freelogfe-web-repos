import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

// import FTooltip from '@/components/FTooltip';

interface FResourceOptionsProps {
  dataSource: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

}

function FResourceOptions({ dataSource }: FResourceOptionsProps) {
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
              <FComponentsLib.FTextBtn
                type={'default'}
                onClick={() => {
                  // onEdit_alterableData && onEdit_alterableData(d);
                }}
              >
                <FComponentsLib.FIcons.FCircleEdit style={{ fontSize: 14 }} />
              </FComponentsLib.FTextBtn>
              <FComponentsLib.FTextBtn
                type={'danger'}
                onClick={() => {
                  // onDelete_alterableData && onDelete_alterableData(d);
                }}
              >
                <FComponentsLib.FIcons.FCircleDelete style={{ fontSize: 14 }} />
              </FComponentsLib.FTextBtn>
            </div>
          </div>
          <div style={{ height: 5 }} />
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
                return (<>
                  <FComponentsLib.FContentText key={i} text={s} type={'additional2'} style={{ color: '#222' }} />
                </>);
              })
            }
          </div>
        </div>);
      })
    }
  </div>);
}

export default FResourceOptions;
