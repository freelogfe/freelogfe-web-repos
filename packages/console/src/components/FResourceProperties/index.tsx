import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';

interface FResourcePropertiesProps {
  immutableData: {
    key: string;
    value: string;
  }[];
  alterableData: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  onEdit_alterableData?(value: FResourcePropertiesProps['alterableData'][number]): void;

  onDelete_alterableData?(value: FResourcePropertiesProps['alterableData'][number]): void;
}

function FResourceProperties({
                               immutableData,
                               alterableData,
                               onEdit_alterableData,
                               onDelete_alterableData,
                             }: FResourcePropertiesProps) {
  return (<div className={styles.styles}>
    {
      immutableData.map((d) => {
        return (<React.Fragment key={d.key}>
          <div>
            <FComponentsLib.FContentText text={d.key} type={'additional2'} />
          </div>
          <div>
            <FComponentsLib.FContentText text={d.value} type={'highlight'} style={{ fontSize: 12 }} />
          </div>
        </React.Fragment>);
      })
    }

    {
      alterableData.map((d) => {
        return (<React.Fragment key={d.key}>
          <div className={styles.grid1}>
            <FComponentsLib.FContentText
              text={d.name}
              type={'additional2'}
              singleRow
            />
            {
              d.description && (<FTooltip
                title={d.description}
              >
                <FComponentsLib.FIcons.FInfo
                  style={{ cursor: 'pointer', fontSize: 12 }}
                />
              </FTooltip>)
            }
          </div>
          <div className={styles.grid2}>
            <FComponentsLib.FContentText
              text={d.value}
              type={'highlight'}
              style={{ fontSize: 12 }}
            />

            <FComponentsLib.FTextBtn
              type={'default'}
              onClick={() => {
                onEdit_alterableData && onEdit_alterableData(d);
              }}
            >
              <FComponentsLib.FIcons.FCircleDelete style={{ fontSize: 14 }} />
            </FComponentsLib.FTextBtn>
            <FComponentsLib.FTextBtn
              type={'danger'}
              onClick={() => {
                onDelete_alterableData && onDelete_alterableData(d);
              }}
            >
              <FComponentsLib.FIcons.FCircleEdit style={{ fontSize: 14 }} />
            </FComponentsLib.FTextBtn>
            {/*<FComponentsLib.FCircleBtn style={{ fontSize: 14 }} type={'danger'} />*/}
          </div>
        </React.Fragment>);
      })
    }
  </div>);
}

export default FResourceProperties;
