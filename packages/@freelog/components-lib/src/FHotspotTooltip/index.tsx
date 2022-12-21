import * as React from 'react';
import styles from './index.less';
import {Tooltip} from 'antd';
// import img_respiration from '@/assets/respiration.gif';
import {CSSProperties} from 'react';

// import img_Execute from '@/assets/execute.svg';

interface FHotspotTooltipProps {
    style?: CSSProperties;
    text: string;
    children: React.ReactNode;
}

function FHotspotTooltip({children, style = {}, text}: FHotspotTooltipProps) {

    const ref = React.useRef<any>();

    return (<div
        ref={ref}
        style={{width: 'fit-content', height: 'fit-content', position: 'relative'}}>
        {children}
        <Tooltip
            visible
            placement='bottomRight'
            title={text}
            color='#FFFFFF linear-gradient(135deg, #4568DC 0%, #B06AB3 100%)'
            overlayInnerStyle={{
                padding: '12px 20px',
                borderRadius: 8,
            }}
            getPopupContainer={() => ref.current}
            // overlayStyle={{ transform: 'translate(12px, -4px)' }}
        >
            <div style={{
                ...style,
                width: 40,
                position: 'absolute',
                zIndex: 10000,
                maxWidth: 240,
            }}>
                <div className={styles.outerRing}>
                    <div className={styles.innerCircle}/>
                </div>
                {/*<img*/}
                {/*  className={styles.respiration}*/}
                {/*  src={img_respiration}*/}
                {/*  alt={''}*/}
                {/*  style={{}}*/}
                {/*/>*/}
            </div>
        </Tooltip>
    </div>);
}

export default FHotspotTooltip;
