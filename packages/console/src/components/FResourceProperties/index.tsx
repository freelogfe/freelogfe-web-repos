import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';
import { Space } from 'antd';
import FPopover from '@/components/FPopover';
import FResourcePropertyAndOptionTipPopover from '@/components/FResourcePropertyAndOptionTipPopover';


interface FResourcePropertiesProps {
  immutableData: {
    key: string;
    name: string;
    value: string;
    description: string;
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
          <div className={styles.grid1}>
            <FResourcePropertyAndOptionTipPopover info={{
              key: d.key,
              name: d.name,
              description: d.description,
            }}>
              <FComponentsLib.FContentText
                text={d.name}
                type={'additional2'}
                style={{ maxWidth: 100 }}
                singleRow
              />
            </FResourcePropertyAndOptionTipPopover>


            {/*{*/}
            {/*  d.description && (<FTooltip*/}
            {/*    title={d.description}*/}
            {/*  >*/}
            {/*    <FComponentsLib.FIcons.FInfo*/}
            {/*      style={{ cursor: 'pointer', fontSize: 12 }}*/}
            {/*    />*/}
            {/*  </FTooltip>)*/}
            {/*}*/}
          </div>
          <div>
            <FComponentsLib.FContentText
              text={d.value}
              type={'highlight'}
              style={{ fontSize: 12 }}
            />
          </div>
        </React.Fragment>);
      })
    }

    {
      alterableData.map((d) => {
        return (<React.Fragment key={d.key}>
          <div className={styles.grid1}>
            <FResourcePropertyAndOptionTipPopover info={{
              key: d.key,
              name: d.name,
              description: d.description,
            }}>
              <FComponentsLib.FContentText
                text={d.name}
                type={'additional2'}
                singleRow
                style={{ maxWidth: 100 }}
              />
            </FResourcePropertyAndOptionTipPopover>
          </div>
          <div className={styles.grid2}>
            <FComponentsLib.FContentText
              text={d.value}
              type={'highlight'}
              style={{ fontSize: 12, maxWidth: 230 }}
              singleRow
            />

            {
              onEdit_alterableData && (<FComponentsLib.FTextBtn
                type={'default'}
                onClick={() => {
                  onEdit_alterableData(d);
                }}
              >
                <FComponentsLib.FIcons.FCircleDelete style={{ fontSize: 14 }} />
              </FComponentsLib.FTextBtn>)
            }

            {
              onDelete_alterableData && (<FComponentsLib.FTextBtn
                type={'danger'}
                onClick={() => {
                  onDelete_alterableData(d);
                }}
              >
                <FComponentsLib.FIcons.FCircleEdit style={{ fontSize: 14 }} />
              </FComponentsLib.FTextBtn>)
            }

          </div>
        </React.Fragment>);
      })
    }
  </div>);
}

export default FResourceProperties;
