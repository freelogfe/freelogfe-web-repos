import * as React from 'react';
import styles from './index.less';
import {FTextButton} from '@/components/FButton';
// @ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {SnippetsOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';
import {FCopy} from "@/components/FIcons";

interface FCopyToClipboardProps {
  text: string;
  title: string;
  success?: string;
}

function FCopyToClipboard({text, title, success}: FCopyToClipboardProps) {

  const [tip, setTip] = React.useState<string>(title);
  // const [timeout, setTimeout] = React.useState<any>(null);

  return (<Tooltip
    title={<span className={styles.color}>{tip}</span>}
    color={'#fff'}
    placement="bottomLeft"
    mouseLeaveDelay={0}
    // mouseEnterDelay={0}
  >
    <CopyToClipboard
      text={text}
      onCopy={(text: string, result: boolean) => {
        // console.log(text, result, '######');
        if (result) {
          setTip(success || '复制成功');
        }
      }
      }>
      <FTextButton
        onMouseOut={() => {
          // console.log(title, 'T^TTTTTT');
          setTimeout(() => setTip(title), 100);
          // setTip(title);
        }}
        onMouseEnter={() => {
          // clearTimeout(timeout);
        }}
        theme={'primary'}
      >
        <FCopy/>
      </FTextButton>
    </CopyToClipboard>
  </Tooltip>);
}

export default FCopyToClipboard;
