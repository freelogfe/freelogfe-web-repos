import * as React from 'react';
import styles from './index.less';
import {Space} from 'antd';
import FIcons from "../FIcons";
import {FUtil, FI18n} from '@freelog/tools-lib';
import {Popover} from 'antd';

interface FPageFooterProps {

}

function FPageFooter({}: FPageFooterProps) {

    const ref = React.useRef<any>(null);

    return (<footer ref={ref} className={styles.footer}>
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
                <a className={styles.footerLeft_Link}>产品动态</a>
                <div className={styles.Divider}/>
                <a className={styles.footerLeft_Link}>服务协议</a>
                <div className={styles.Divider}/>
                <a className={styles.footerLeft_Link}>关于我们</a>
                <div className={styles.Divider}/>
                <a className={styles.footerLeft_Link}>联系我们</a>
                <div className={styles.Divider}/>
                <a
                    className={styles.footerLeft_Link}
                    onClick={() => {
                        const allLanguage = FI18n.i18nNext.getAllLanguage();
                        console.log(allLanguage, 'allLanguage903iosdlfkj');
                        const currentLanguage = FI18n.i18nNext.getCurrentLanguage();
                        console.log(currentLanguage, 'currentLanguage90i3osdlkfjsdlk');
                        FI18n.i18nNext.changeLanguage(currentLanguage !== 'zh_CN' ? 'zh_CN' : 'en_US');
                        window.location.reload();
                    }}
                >{FI18n.i18nNext.getCurrentLanguage() !== 'zh_CN' ? '简体中文' : 'English'}</a>
            </Space>
            <div style={{width: 20}}/>
            <div className={styles.Divider}/>
            <div style={{width: 30}}/>
            <Space size={25}>
                <Popover
                    getPopupContainer={() => ref.current}
                    overlayInnerStyle={{
                        width: 200,
                        padding: '8px 4px',
                    }}
                    content={<div className={styles.PopoverContent}>
                        <div className={styles.PopoverContentTitle}>freeolg平台公众号名称</div>
                        <div style={{height: 20}}/>
                        <img src={'//static.freelog.com/static/WeChatQR.jpg'}/>
                    </div>}
                    title={null}
                >
                    <a className={styles.footerLeft_Link}>
                        <FIcons.FWeChat/>
                    </a>
                </Popover>
                {/*<Popover*/}
                {/*    overlayInnerStyle={{*/}
                {/*        width: 200,*/}
                {/*        padding: '8px 4px',*/}
                {/*    }}*/}
                {/*    content={<div className={styles.PopoverContent}>*/}
                {/*        <div className={styles.PopoverContentTitle}>freeolg平台公众号名称</div>*/}
                {/*        <div style={{height: 20}}/>*/}
                {/*        <img/>*/}
                {/*    </div>}*/}
                {/*    title={null}*/}
                {/*>*/}
                <a href={'//weibo.com/u/7762454686'} target={'_blank'} className={styles.footerLeft_Link}>
                    <FIcons.FSina/>
                </a>
                {/*</Popover>*/}
                {/*<Popover*/}
                {/*    overlayInnerStyle={{*/}
                {/*        width: 200,*/}
                {/*        padding: '8px 4px',*/}
                {/*    }}*/}
                {/*    content={<div className={styles.PopoverContent}>*/}
                {/*        <div className={styles.PopoverContentTitle}>freeolg平台公众号名称</div>*/}
                {/*        <div style={{height: 20}}/>*/}
                {/*        <img src={'//static.freelog.com/static/WeChatQR.jpg'}/>*/}
                {/*    </div>}*/}
                {/*    title={null}*/}
                {/*>*/}
                {/*    <a className={styles.footerLeft_Link}>*/}
                {/*        <FIcons.FLinkedin/>*/}
                {/*    </a>*/}
                {/*</Popover>*/}
            </Space>
        </div>
        <div style={{height: 20}}/>
        <div className={styles.footerRight}>
            {/*<img*/}
            {/*  src={img_Police}*/}
            {/*  className={styles.policeImg}*/}
            {/*  alt={''}*/}
            {/*  onClick={() => {*/}
            {/*    window.open('https://beian.miit.gov.cn/');*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<div style={{ width: 6 }} />*/}
            <a
                className={styles.footerRightText}
                href={'https://beian.miit.gov.cn/'}
                target={'_blank'}
            >{window.location.origin.includes('.freelog.com') ? '粤ICP备17085716号-1' : '粤ICP备17085716号-2'}</a>
            <div style={{width: 20}}/>
            <div className={styles.footerRightText}>Copyright© 2020 freelog.com</div>
        </div>
    </footer>);
}

export default FPageFooter;
