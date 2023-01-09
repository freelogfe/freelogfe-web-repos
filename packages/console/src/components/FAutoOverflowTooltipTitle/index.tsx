import * as React from 'react';
import styles from './index.less';
import { MutableRefObject } from 'react';
import FTooltip from '@/components/FTooltip';

interface FAutoOverflowTooltipTitleProps {
  name: string;
  right: React.ReactNode;
}

function FAutoOverflowTooltipTitle({ name, right }: FAutoOverflowTooltipTitleProps) {

  const refTitle: MutableRefObject<any> = React.useRef(null);

  const [tooltipDisable, set_tooltipDisable] = React.useState<boolean>(true);

  return (<div
    className={styles.row}
    onMouseEnter={() => {
      set_tooltipDisable(refTitle.current.clientWidth < refTitle.current.scrollWidth);
    }}>
    <FTooltip
      title={name}
      placement={'top'}
      open={!tooltipDisable ? false : undefined}
    >
      <div ref={refTitle} className={styles.title}>{name}</div>
    </FTooltip>

    <div className={styles.right}>
      {right}
    </div>
  </div>);
}

export default FAutoOverflowTooltipTitle;
