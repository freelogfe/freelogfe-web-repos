import * as React from 'react';
import styles from './index.less';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Tooltip} from 'antd';
import FIcons from '../FIcons';
import FComponentsLib from '../';

interface FCopyToClipboardProps {
    text: string;
    title: string;
    iconStyle?: React.CSSProperties;
    success?: string;
    children?: React.ReactNode;
}

const CopyToClipboard_Copy: any = CopyToClipboard;

function FCopyToClipboard({text, title, success, iconStyle, children}: FCopyToClipboardProps) {

    const [tip, setTip] = React.useState<string>(title);

    return (<Tooltip
        trigger='hover'
        title={<span className={styles.color}>{tip}</span>}
        color={'#fff'}
        placement='bottomLeft'
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
    >
    <span onMouseOut={() => {
        setTimeout(() => setTip(title), 100);
    }}><CopyToClipboard_Copy
        text={text}
        onCopy={(_text: string, result: boolean) => {
            // console.log(text, result, '######');
            if (result) {
                setTip(success || '复制成功');
            }
        }}
    >
      {
          children || (<FComponentsLib.FTextBtn><FIcons.FCopy style={iconStyle}/></FComponentsLib.FTextBtn>)
      }
    </CopyToClipboard_Copy></span>
    </Tooltip>);
}

export default FCopyToClipboard;
