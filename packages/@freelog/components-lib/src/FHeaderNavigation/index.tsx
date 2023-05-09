import * as React from 'react';
import styles from './index.less';
import UserInfo from './UserInfo';
import EmptyAndCreate from './EmptyAndCreate';
import NavList from './NavList';
import AOrLink from './AOrLink';
import {FUtil, FI18n} from '@freelog/tools-lib';
import FComponentsLib from '../';
import FHotspotTooltip, {setHotspotTooltipVisible} from '../FHotspotTooltip';
import {Space} from 'antd';

interface FHeaderNavigationProps {
    logoBtn: {
        href: string;
        target?: '_self' | '_blank';
    };
    showAlphaTest?: boolean;
    showConsoleBabel?: boolean;
    menu?: {
        id: string;
        text: string;
        href: string;
        target?: '_self' | '_blank';
        items: {
            id: string;
            text: string;
            href: string;
            target?: '_self' | '_blank';
        }[];
        createBtn?: {
            href: string;
            target?: '_self' | '_blank';
        } | null;
        emptyItemsTip?: {
            tipText: string;
            btnText: string;
            btnHref: string;
            target?: '_self' | '_blank';
        },
    }[];
    activeIDs?: [string, string];
    extra?: React.ReactNode;
    showGotoConsole?: boolean;
    createBtnMenu?: {
        id: string;
        text: string;
        href: string;
        target?: '_self' | '_blank';
    }[];
    userPanel: {
        info: {
            avatar: string;
            userName: string;
            email: string;
            phone: string;
        };
        menu: {
            text: string;
            onClick(): void;
        }[];
    } | null;

    // LinkPatch: React.ForwardRefExoticComponent<any>;
    UmiLinkPatch?: any;
    showHotspotTooltip?: boolean;
}

function FHeaderNavigation({
                               logoBtn,
                               showAlphaTest = false,
                               showConsoleBabel = false,
                               menu = [],
                               activeIDs = ['', ''],
                               extra,
                               showGotoConsole = false,
                               createBtnMenu = [],
                               userPanel,
                               UmiLinkPatch,
                               showHotspotTooltip,
                           }: FHeaderNavigationProps) {
    return (<div className={styles.FHeaderNavigation}>
        <div className={styles.FHeaderNavigation_Left}>
            <AOrLink href={logoBtn.href} className={styles.logoLink} UmiLinkPatch={UmiLinkPatch}>
                <i className={'freelog fl-icon-a-featherlogo5'}/>
                {
                    showConsoleBabel && (<>
                        <div style={{width: 10}}/>
                        <span>· 工作台</span>
                    </>)
                }
            </AOrLink>

            {
                showAlphaTest && (<>
                    <div style={{width: 10}}/>
                    <label className={styles.alphaTestLabel}>内测</label>
                </>)
            }

            {
                menu && menu.length > 0 && (<>
                    <div style={{width: 25}}/>
                    <div className={styles.Menus}>
                        {
                            menu.map((m) => {
                                // console.log(m, 'm.emptyItemsTip3fsdfasdfsd');
                                return (<FComponentsLib.FDropdown
                                    key={m.id}
                                    disabled={m.items.length === 0 && !m.emptyItemsTip}
                                    overlay={m.items.length === 0 && m.emptyItemsTip
                                        ? <EmptyAndCreate UmiLinkPatch={UmiLinkPatch} {...m.emptyItemsTip} />
                                        : <NavList
                                            items={m.items}
                                            createBtn={m.createBtn}
                                            activeID={activeIDs[1]}
                                            UmiLinkPatch={UmiLinkPatch}
                                        />}
                                >
                                    {
                                        m.id === 'discover' && showHotspotTooltip
                                            ? (<FHotspotTooltip
                                                id={'header.discoverNav'}
                                                style={{left: '50%', marginLeft: -16, bottom: -20}}
                                                text={FI18n.i18nNext.t('hotpots_myresource_nav_explore')}
                                            >
                                                <AOrLink
                                                    href={m.href}
                                                    target={m.target}
                                                    className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                                                    UmiLinkPatch={UmiLinkPatch}
                                                ><span>{m.text}</span></AOrLink>
                                            </FHotspotTooltip>)
                                            : (<AOrLink
                                                href={m.href}
                                                target={m.target}
                                                className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                                                UmiLinkPatch={UmiLinkPatch}
                                            ><span>{m.text}</span></AOrLink>)
                                    }

                                </FComponentsLib.FDropdown>);

                            })
                        }

                    </div>
                </>)
            }

        </div>
        <div className={styles.FHeaderNavigation_Right}>
            {/*{*/}
            {/*  showGlobalSearch && (<>*/}
            {/*    <FInput*/}
            {/*      size='small'*/}
            {/*      theme='dark'*/}
            {/*      style={{ width: 200 }}*/}
            {/*      value={''}*/}
            {/*    />*/}
            {/*    <div style={{ width: 30 }} />*/}
            {/*  </>)*/}
            {/*}*/}
            {extra}

            <div style={{width: 30}}/>

            <Space size={30}>
                {
                    showGotoConsole && (<>
                        {
                            showHotspotTooltip
                                ? (<FHotspotTooltip
                                    id={'header.gotoConsoleBtn'}
                                    style={{left: '50%', marginLeft: -16, bottom: -42}}
                                    text={FI18n.i18nNext.t('hotpots_home_btn_gotoconsole')}
                                    onMount={() => {
                                        setHotspotTooltipVisible('header.gotoConsoleBtn', {
                                            value: false,
                                            effectiveImmediately: false,
                                            onlyNullish: false,
                                        });
                                    }}
                                >
                                    <FComponentsLib.FRectBtn
                                        size='small'
                                        type='secondary'
                                        onClick={() => {
                                            window.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.dashboard());
                                        }}
                                    >进入工作台</FComponentsLib.FRectBtn>
                                    {/*<div style={{width: 30}}/>*/}
                                </FHotspotTooltip>)
                                : (<FComponentsLib.FRectBtn
                                    size='small'
                                    type='secondary'
                                    onClick={() => {
                                        window.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.dashboard());
                                    }}
                                >进入工作台</FComponentsLib.FRectBtn>)}
                    </>)
                }

                {
                    createBtnMenu && createBtnMenu.length > 0 && (<>
                        <FComponentsLib.FDropdown
                            overlay={<NavList items={createBtnMenu} UmiLinkPatch={UmiLinkPatch}/>}
                        >
                            <a
                                className={styles.createBtnMenu}
                                id={'header.createBtn'}
                            ><span><FComponentsLib.FIcons.FPlus/></span></a>
                        </FComponentsLib.FDropdown>
                        {/*<div style={{width: 30}}/>*/}
                    </>)
                }

                <UserInfo data={userPanel}/>
            </Space>
        </div>
    </div>);
}

export default FHeaderNavigation;
