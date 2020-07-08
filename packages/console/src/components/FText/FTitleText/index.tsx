import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';

interface FTitleProps {
  text?: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'form';
  singleRow?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
}

export default function ({children, text, type = 'h1', singleRow = false}: FTitleProps) {
  const singleRowClassName = singleRow ? shared.singleRow : '';
  const finalClassName = [singleRowClassName, styles[type], styles.text].join(' ');
  switch (type) {
    case 'h1':
      return <h1 className={finalClassName}>{children || text}</h1>;
    case 'h2':
      return <h2 className={finalClassName}>{children || text}</h2>;
    case 'h3':
      return <h3 className={finalClassName}>{children || text}</h3>;
    case 'h4':
      return <h4 className={finalClassName}>{children || text}</h4>;
    case 'h5':
      return <h5 className={finalClassName}>{children || text}</h5>;
    default:
      return <h6 className={finalClassName}>{children || text}</h6>
  }

}
