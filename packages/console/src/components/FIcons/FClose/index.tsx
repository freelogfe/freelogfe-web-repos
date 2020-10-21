import * as React from 'react';
import styles from './index.less';
import {CloseOutlined} from '@ant-design/icons';

interface FCloseProps {

}

function FClose({...props}: FCloseProps) {
  return (<CloseOutlined {...props}/>);
}

export default FClose;
