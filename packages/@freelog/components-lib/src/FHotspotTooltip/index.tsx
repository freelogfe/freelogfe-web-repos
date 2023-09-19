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
    | 'resourceDetailPage.checkPolicy'
    | 'nodeManager.nodeLink'
    | 'exhibitDetailPage.onlineSwitch'
    | 'exhibitDetailPage.createFirstPolicy'
    | 'resourceVersionEditorPage.noVersionAndCreateVersion';

type ContentValue = 'show' | 'hide';

type HotspotTooltip_LocalStorage_Content = {
    [k in ContentKey]?: ContentValue;
};

const defaultContent: HotspotTooltip_LocalStorage_Content = {
    'header.gotoConsoleBtn': 'show',
    'createResourcePage.createBtn': 'hide',
    'createResourceVersionPage.uploadFileBtn': 'show',
    'createResourceVersionPage.createBtn': 'hide',
    'policyBuilder.resource.policyTemplateBtn': 'show',
    'policyBuilder.resource.policyVerifyBtn': 'hide',
    'policyBuilder.resource.policyCreateBtn': 'show',
    'header.discoverNav': 'hide',
    'createNodePage.createBtn': 'hide',
    'resourceDetailPage.nodeSelector': 'show',
    'resourceDetailPage.checkPolicy': 'show',
    'policyBuilder.exhibit.policyTemplateBtn': 'show',
    'policyBuilder.exhibit.policyVerifyBtn': 'hide',
    'policyBuilder.exhibit.policyCreateBtn': 'show',
    'nodeManager.nodeLink': 'show',
    'exhibitDetailPage.onlineSwitch': 'hide',
    'exhibitDetailPage.createFirstPolicy': 'show',
    'resourceVersionEditorPage.noVersionAndCreateVersion': 'show',
};

function getHotspotTooltip_LocalStorage_Content(key: ContentKey): ContentValue | undefined {
    const contentString: string = self.localStorage.getItem(HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY) || '{}';
    const content: HotspotTooltip_LocalStorage_Content = JSON.parse(contentString);
    return content[key];
}

function setHotspotTooltip_LocalStorage_Content(key: ContentKey, value: ContentValue) {
    const contentString: string = self.localStorage.getItem(HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY) || '{}';
    const content: HotspotTooltip_LocalStorage_Content = JSON.parse(contentString);
    const newContentString: string = JSON.stringify({
        ...content,
        [key]: value,
    });
    self.localStorage.setItem(HOTSPOT_TOOLTIP_LOCALSTORAGE_KEY, newContentString);
}

interface FHotspotTooltipProps {
    id: ContentKey;
    children: React.ReactNode;
    text: string;
    style?: CSSProperties;
    zIndex?: number;

    onMount?(): void;
}

const set_visible_funcs: {
    [k in ContentKey]?: (value: boolean) => void;
} = {};

function FHotspotTooltip({id, children, style = {}, text, onMount, zIndex = 10000}: FHotspotTooltipProps) {

    const ref = React.useRef<any>();

    const [visible, set_visible] = React.useState<boolean>((getHotspotTooltip_LocalStorage_Content(id) || defaultContent[id]) === 'show');

    React.useEffect(() => {
        set_visible_funcs[id] = set_visible;
        onMount && onMount();
    }, []);

    if (!visible) {
        return <>{children}</>;
    }

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
            zIndex={zIndex}
        >
            <div style={{
                ...style,
                width: 40,
                position: 'absolute',
                zIndex: zIndex,
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

export function setHotspotTooltipVisible(id: ContentKey, option: {
    value: boolean;
    effectiveImmediately: boolean;
    onlyNullish: boolean;
}) {
    if (option.onlyNullish && getHotspotTooltip_LocalStorage_Content(id) !== undefined) {
        return;
    }
    if (option.effectiveImmediately) {
        const func = set_visible_funcs[id];
        func && func(option.value);
    }

    setHotspotTooltip_LocalStorage_Content(id, option.value ? 'show' : 'hide');
}