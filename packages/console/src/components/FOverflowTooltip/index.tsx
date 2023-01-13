import * as React from 'react';
import styles from './index.less';
import FTooltip from '@/components/FTooltip';
import { MutableRefObject } from 'react';

interface FOverflowTooltipProps {
  text: string;
  style?: React.CSSProperties;
}

function FOverflowTooltip({ text, style = {} }: FOverflowTooltipProps) {

  const refTitle: MutableRefObject<any> = React.useRef(null);

  const [tooltipDisable, set_tooltipDisable] = React.useState<boolean>(true);

  return (<FTooltip
    title={text}
    placement={'top'}
    open={!tooltipDisable ? false : undefined}
  >
    <div
      ref={refTitle}
      className={styles.title}
      onMouseEnter={() => {
        set_tooltipDisable(refTitle.current.clientWidth < refTitle.current.scrollWidth);
      }}
      style={style}
    >{text}</div>
  </FTooltip>);
}

export default FOverflowTooltip;
