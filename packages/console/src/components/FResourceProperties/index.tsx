import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

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

  onChange_alterableData?(value: FResourcePropertiesProps['alterableData']): void;
}

function FResourceProperties({ immutableData, alterableData, onChange_alterableData }: FResourcePropertiesProps) {
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
          <div>
            <FComponentsLib.FContentText text={d.name} type={'additional2'} />
          </div>
          <div>
            <FComponentsLib.FContentText text={d.value} type={'highlight'} style={{ fontSize: 12 }} />
          </div>
        </React.Fragment>);
      })
    }
    {/*<div>*/}
    {/*  <FComponentsLib.FContentText text={'png'} type={'highlight'} style={{ fontSize: 12 }} />*/}
    {/*</div>*/}
    {/*<div>*/}
    {/*  <FComponentsLib.FContentText text={'类型'} type={'additional2'} />*/}
    {/*</div>*/}
    {/*<div>*/}
    {/*  <FComponentsLib.FContentText text={'png'} type={'highlight'} style={{ fontSize: 12 }} />*/}
    {/*</div>*/}
    {/*<div>*/}
    {/*  <FComponentsLib.FContentText text={'类型'} type={'additional2'} />*/}
    {/*</div>*/}
    {/*<div>*/}
    {/*  <FComponentsLib.FContentText text={'png'} type={'highlight'} style={{ fontSize: 12 }} />*/}
    {/*</div>*/}
  </div>);
}

export default FResourceProperties;
