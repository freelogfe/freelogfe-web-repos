import * as React from 'react';
import styles from './index.less';
import {Tooltip} from 'antd';
import {CSSProperties} from 'react';

const HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY = 'HotspotTooltip';

type ContentKey = 'header.gotoConsoleBtn'
    | 'header.discoverNav'
    | 'createResourcePage.createBtn'
    | 'createResourceVersionPage.createBtn'
    | 'createResourceVersionPage.uploadFileBtn'
    | 'policyBuilder.resource.policyTemplateBtn'
    | 'policyBuilder.resource.policyVerifyBtn'
    | 'policyBuilder.resource.policyCreateBtn'
    | 'policyBuilder.exhibit.policyTemplateBtn'
    | 'policyBuilder.exhibit.policyVerifyBtn'
    | 'policyBuilder.exhibit.policyCreateBtn'
    | 'createNodePage.createBtn'
    | 'resourceDetailPage.nodeSelector'
    | 'exhibitDetailPage.onlineSwitch'
    ;
type ContentValue = 'show' | 'hide';

type HotspotTooltip_LocalStorage_Content = {
    [k in ContentKey]?: ContentValue;
};

const defaultContent: HotspotTooltip_LocalStorage_Content = {};

export function getHotspotTooltip_LocalStorage_Content(key: ContentKey) {
    const contentString: string = self.localStorage.getItem(HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY) || '{}';
    const content: HotspotTooltip_LocalStorage_Content = JSON.parse(contentString);
    return content[key] || defaultContent[key];
}

export function setHotspotTooltip_LocalStorage_Content(key: ContentKey, value: ContentValue) {
    const contentString: string = self.localStorage.getItem(HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY) || '{}';
    const content: HotspotTooltip_LocalStorage_Content = JSON.parse(contentString);
    const newContentString: string = JSON.stringify({
        ...content,
        [key]: value,
    });
    self.localStorage.setItem(HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY, newContentString);
}

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
            </div>
        </Tooltip>
    </div>);
}

export default FHotspotTooltip;
