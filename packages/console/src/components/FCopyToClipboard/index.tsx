import * as React from 'react';
import styles from './index.less';
import {FTextBtn} from '../FButton';
// @ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Tooltip} from 'antd';
import {FCopy} from "../FIcons";
import {CSSProperties} from "react";

interface FCopyToClipboardProps {
  text: string;
  title: string;
  iconStyle?: CSSProperties;
  success?: string;
}

function FCopyToClipboard({text, title, success,iconStyle}: FCopyToClipboardProps) {

  const [tip, setTip] = React.useState<string>(title);
  const [visibleTooltip, setVisibleTooltip] = React.useState<boolean>(false);
  // const [timeout, setTimeout] = React.useState<any>(null);

  return (<Tooltip
    // visible={visibleTooltip}
    trigger="hover"
    title={<span className={styles.color}>{tip}</span>}
    color={'#fff'}
    placement="bottomLeft"
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
      <FTextBtn><FCopy style={iconStyle}/></FTextBtn>
    </CopyToClipboard>
      </span>
  </Tooltip>);
}

export default FCopyToClipboard;
