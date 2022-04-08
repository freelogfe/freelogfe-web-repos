import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';

interface F_Contract_And_Policy_Labels_Props {
  data: {
    text: string;
    dot: 'green' | 'yellow' | '';
  }[];
  singleRow?: boolean;
}

const colors = {
  green: '#42C28C',
  yellow: '#E9A923',
};

function F_Contract_And_Policy_Labels({ data, singleRow }: F_Contract_And_Policy_Labels_Props) {
  console.log(data, 'data@#089iosdfsdlk');
  return (<div className={[styles.styles, singleRow ? styles.singleRow : ''].join(' ')}>
    {
      data.map((d, i) => {
        return (<label className={styles.label} key={i}>
          <span className={styles.labelText}>{d.text}</span>
          {
            d.dot && (<>
              <div style={{ width: 5 }} />
              <i className={styles.labelDot} style={{ backgroundColor: colors[d.dot] }} />
            </>)
          }
        </label>);
      })
    }

  </div>);
}

export default F_Contract_And_Policy_Labels;
