import * as React from 'react';
import styles from './index.less';
import {Link} from 'umi';
import {LinkProps} from 'react-router-dom';

interface FLinkProps extends LinkProps {

}

function FLink({...props}: FLinkProps) {
  return (<Link {...props}/>);
}

export default FLink;
