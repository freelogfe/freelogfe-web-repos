import * as React from 'react';
import styles from './index.less';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'antd';
import { FCopy } from '../FIcons';
import { CSSProperties } from 'react';
import FComponentsLib from '@freelog/components-lib';


interface FCopyToClipboardProps {
  text: string;
  title: string;
  iconStyle?: CSSProperties;
  success?: string;
  children?: React.ReactNode;
}

function FCopyToClipboard({ text, title, success, iconStyle, children }: FCopyToClipboardProps) {

  const [tip, setTip] = React.useState<string>(title);
  const [visibleTooltip, setVisibleTooltip] = React.useState<boolean>(false);
  // const [timeout, setTimeout] = React.useState<any>(null);

  return (<Tooltip
    // visible={visibleTooltip}
    trigger='hover'
    title={<span className={styles.color}>{tip}</span>}
    color={'#fff'}
    placement='bottomLeft'
    mouseLeaveDelay={0}
    mouseEnterDelay={0}
  >
    <span onMouseOut={() => {
      setTimeout(() => setTip(title), 100);
    }}>
    <CopyToClipboard
      text={text}
      onCopy={(text: string, result: boolean) => {
        // console.log(text, result, '######');
        if (result) {
          setTip(success || '复制成功');
        }
      }}
    >
      {
        children || (<FComponentsLib.FTextBtn><FCopy style={iconStyle} /></FComponentsLib.FTextBtn>)
      }
    </CopyToClipboard>
      </span>
  </Tooltip>);
}

export default FCopyToClipboard;
