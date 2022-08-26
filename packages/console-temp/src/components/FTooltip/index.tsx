import * as React from 'react';
import styles from './index.less';
import {Tooltip} from 'antd';
import { TooltipPropsWithTitle } from 'antd/lib/tooltip';

interface FTooltipProps extends TooltipPropsWithTitle {
  title: React.ReactNode;
  children: React.ReactNode;
}

function FTooltip({children, title, placement = 'bottomLeft', arrowPointAtCenter = true, ...props}: FTooltipProps) {
  return (<Tooltip
    title={<span className={styles.title}>{title}</span>}
    color={'#fff'}
    arrowPointAtCenter={arrowPointAtCenter}
    placement={placement}
    {...props}
  >{children}</Tooltip>);
}

export default FTooltip;
