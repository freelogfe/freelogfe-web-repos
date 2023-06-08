import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FResourcePropertyAndOptionTipPopover from '@/components/FResourcePropertyAndOptionTipPopover';


interface FResourcePropertiesProps {
  immutableData: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  onlyEditValueData: {
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

  onEdit_onlyEditValueData?(value: FResourcePropertiesProps['onlyEditValueData'][number]): void;

  onEdit_alterableData?(value: FResourcePropertiesProps['alterableData'][number]): void;

  onDelete_alterableData?(value: FResourcePropertiesProps['alterableData'][number]): void;
}

function FResourceProperties($prop: FResourcePropertiesProps) {
  return (<div className={styles.styles}>
    {
      $prop.immutableData.map((d) => {
        return (<React.Fragment key={d.key}>
          <div className={styles.grid1}>
            <FResourcePropertyAndOptionTipPopover
              info={{
                key: d.key,
                name: d.name,
                description: d.description,
              }}
              type={'property'}
            >
              <FComponentsLib.FContentText
                text={d.name}
                type={'additional2'}
                style={{ maxWidth: 100 }}
                singleRow
              />
            </FResourcePropertyAndOptionTipPopover>
          </div>
          <div>
            <FComponentsLib.FContentText
              text={d.value}
              type={'highlight'}
              style={{ fontSize: 12, maxWidth: 230 }}
              singleRow
            />
          </div>
        </React.Fragment>);
      })
    }

    {
      $prop.onlyEditValueData.map((d) => {
        return (<React.Fragment key={d.key}>
          <div className={styles.grid1}>
            <FResourcePropertyAndOptionTipPopover
              info={{
                key: d.key,
                name: d.name,
                description: d.description,
              }}
              type={'property'}
            >
              <FComponentsLib.FContentText
                text={d.name}
                type={'additional2'}
                style={{ maxWidth: 100 }}
                singleRow
              />
            </FResourcePropertyAndOptionTipPopover>
          </div>
          <div className={styles.grid2}>
            {
              d.value === ''
                ? (<i style={{ fontSize: 12, color: '#999' }}>待填写</i>)
                : (<FComponentsLib.FContentText
                  text={d.value}
                  type={'highlight'}
                  style={{ fontSize: 12, maxWidth: 230 }}
                  singleRow
                />)
            }


            <FComponentsLib.FTextBtn
              type={'default'}
              onClick={() => {
                $prop.onEdit_onlyEditValueData && $prop.onEdit_onlyEditValueData(d);
              }}
            >
              <FComponentsLib.FIcons.FCircleDelete style={{ fontSize: 14 }} />
            </FComponentsLib.FTextBtn>
          </div>
        </React.Fragment>);
      })
    }

    {
      $prop.alterableData.map((d) => {
        return (<React.Fragment key={d.key}>
          <div className={styles.grid1}>
            <FResourcePropertyAndOptionTipPopover
              info={{
                key: d.key,
                name: d.name,
                description: d.description,
              }}
              type={'property'}
            >
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

            <FComponentsLib.FTextBtn
              type={'default'}
              onClick={() => {
                $prop.onEdit_alterableData && $prop.onEdit_alterableData(d);
              }}
            >
              <FComponentsLib.FIcons.FCircleDelete style={{ fontSize: 14 }} />
            </FComponentsLib.FTextBtn>

            <FComponentsLib.FTextBtn
              type={'danger'}
              onClick={() => {
                $prop.onDelete_alterableData && $prop.onDelete_alterableData(d);
              }}
            >
              <FComponentsLib.FIcons.FCircleEdit style={{ fontSize: 14 }} />
            </FComponentsLib.FTextBtn>

          </div>
        </React.Fragment>);
      })
    }
  </div>);
}

export default FResourceProperties;
