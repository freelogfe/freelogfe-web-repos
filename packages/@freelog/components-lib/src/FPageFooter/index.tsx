import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FWeChat from '@/components/FIcons/FWeChat';
import FSina from '@/components/FIcons/FSina';
import FLinkedin from '@/components/FIcons/FLinkedin';
import img_Police from '@/assets/police@2x.png';

interface FPageFooterProps {

}

function FPageFooter({}: FPageFooterProps) {
  return (<footer className={styles.footer}>
    <div className={styles.footerLeft}>
      <Space size={30} style={{ height: 70 }}>
        <a className={styles.footerLeft_Link}>产品动态</a>
        <a className={styles.footerLeft_Link}>服务协议</a>
        <a className={styles.footerLeft_Link}>关于我们</a>
        <a className={styles.footerLeft_Link}>联系我们</a>
        <a className={styles.footerLeft_Link}>English</a>
      </Space>
      <div style={{ width: 40 }} />
      <Space size={30} style={{ height: 70 }}>
        <a className={styles.footerLeft_Link}>
          <FWeChat />
        </a>
        <a className={styles.footerLeft_Link}>
          <FSina />
        </a>
        <a className={styles.footerLeft_Link}>
          <FLinkedin />
        </a>
      </Space>
    </div>

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
      <div style={{ width: 30 }} />
      <div className={styles.footerRightText}>Copyright© 2020 freelog.com</div>
    </div>
  </footer>);
}

export default FPageFooter;
