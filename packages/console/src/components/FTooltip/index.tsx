import * as React from 'react';
import styles from './index.less';
import {FInfo} from "@/components/FIcons";
import {Tooltip} from 'antd';
import {TooltipProps, TooltipPropsWithOverlay, TooltipPropsWithTitle} from 'antd/lib/tooltip';

interface FTooltipProps extends TooltipPropsWithTitle {
  children: React.ReactNode;
}

function FTooltip({children, title}: FTooltipProps) {
  return (<Tooltip
    title={<span className={styles.title}>{title}</span>}
    color={'#fff'}>{children}</Tooltip>);
}

export default FTooltip;
