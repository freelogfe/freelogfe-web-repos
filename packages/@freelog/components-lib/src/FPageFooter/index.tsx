import * as React from 'react';
import styles from './index.less';
import {Space} from 'antd';
import FIcons from "../FIcons";
import {FUtil, FI18n} from '@freelog/tools-lib';
import {Popover} from 'antd';

interface FPageFooterProps {
    PopoverPatch?: React.ForwardRefExoticComponent<any>;
    style?: React.CSSProperties;
}

function FPageFooter({PopoverPatch, style = {}}: FPageFooterProps): React.ReactElement {

    const FPopover = PopoverPatch || Popover;

    return (<footer className={styles.footer} style={style}>
        <div className={styles.footerLeft}>
            <Space size={20}>
                <a
                    className={styles.footerLeft_Link}
                    href={FUtil.Format.completeUrlByDomain('www')}
                    target="_blank"
                >
                    <FIcons.FFreelog/>
                </a>
                <div className={styles.Divider}/>
                <a
                    href={'https://freelog4.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cf872542afc0002f1d8b0c'}
                    target="_blank"
                    className={styles.footerLeft_Link}
                >{FI18n.i18nNext.t('nav_ProductDevActivities')}</a>
                <div className={styles.Divider}/>
                <a
                    className={styles.footerLeft_Link}
                    href={'https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2'}
                    target="_blank"
                >{FI18n.i18nNext.t('nav_TermsPrivacy')}</a>
                <div className={styles.Divider}/>
                <a
                    className={styles.footerLeft_Link}
                    href={'https://freelog4.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62d0d202456ff0002e3295ab'}
                    target="_blank"
                >{FI18n.i18nNext.t('nav_AboutUs')}</a>
                <div className={styles.Divider}/>
                <a
                    className={styles.footerLeft_Link}
                    // href={'https://freelog4.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62d0d202456ff0002e3295ab'}
                    href={'https://freelog4.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62d0d58042afc0002f1d9282'}
                    target="_blank"
                >{FI18n.i18nNext.t('nav_ContactUs')}</a>
                <div className={styles.Divider}/>
                <a
                    className={styles.footerLeft_Link}
                    onClick={() => {
                        // const allLanguage: string[] = FI18n.i18nNext.getAllLanguage();
                        // console.log(allLanguage, 'allLanguage903iosdlfkj');
                        const currentLanguage = FI18n.i18nNext.getCurrentLanguage();
                        // console.log(currentLanguage, 'currentLanguage90i3osdlkfjsdlk');
                        FI18n.i18nNext.changeLanguage(currentLanguage !== 'zh_CN' ? 'zh_CN' : 'en_US');
                        window.location.reload();
                    }}
                >{FI18n.i18nNext.getCurrentLanguage() !== 'zh_CN' ? '简体中文' : 'English'}</a>
            </Space>
            <div style={{width: 20}}/>
            <div className={styles.Divider}/>
            <div style={{width: 30}}/>
            <Space size={25}>
                <FPopover
                    // getPopupContainer={() => ref.current}
                    overlayInnerStyle={{
                        width: 200,
                        padding: '8px 4px',
                    }}
                    content={<div className={styles.PopoverContent}>
                        <div className={styles.PopoverContentTitle}>Freelog飞致</div>
                        <div style={{height: 20}}/>
                        <img src={'//static.freelog.com/static/WeChatQR.jpg'} alt={''}/>
                    </div>}
                    title={null}
                >
                    <a className={styles.footerLeft_Link}>
                        <FIcons.FWeChat/>
                    </a>
                </FPopover>
                <a href={'https://weibo.com/u/7762454686'} target={'_blank'} className={styles.footerLeft_Link}>
                    <FIcons.FSina/>
                </a>
            </Space>
        </div>
        <div style={{height: 20}}/>
        <div className={styles.footerRight}>
            <a
                className={styles.footerRightText}
                href={'https://beian.miit.gov.cn/'}
                target={'_blank'}
            >{window.location.origin.includes('.freelog.com') ? '粤ICP备17085716号-1' : '粤ICP备17085716号-2'}</a>
            <div style={{width: 20}}/>
            {/*<div className={styles.footerRightText}>Copyright© 2020 freelog.com</div>*/}
            <div className={styles.footerRightText}>{FI18n.i18nNext.t('nav_copyright')}</div>
        </div>
    </footer>);
}

export default FPageFooter;
