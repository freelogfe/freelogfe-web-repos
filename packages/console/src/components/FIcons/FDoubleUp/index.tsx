import * as React from 'react';
import styles from './index.less';
import {DoubleRightOutlined} from '@ant-design/icons';

interface FCloseProps {

}

function FDoubleUp({...props}: FCloseProps) {
  return (<DoubleRightOutlined {...props}/>);
}

export default FDoubleUp;
