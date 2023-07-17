import * as React from 'react';
import fMessage from '../fMessage';
import FTooltip from '../FTooltip';
import styles from './index.less';

const QRCode = require('qrcode.react');

/** 分享按钮 */
interface shareBtnItem {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

export const FShare = (props: {
  children: any;
  type: 'node' | 'resource';
  title: string;
  url: string;
  cover?: string;
}) => {
  const { children, type, title, url, cover } = props;
  const [shareText, setShareText] = React.useState('');
  const [popupShow, setPopupShow] = React.useState(false);
  const [qrcodeShow, setQrcodeShow] = React.useState(false);
  const [qrcodeInfo, setQrcodeInfo] = React.useState<{ name: string; url: string }>({
    name: '',
    url: '',
  });

  /** 分享按钮 */
  const shareBtns: shareBtnItem[] = [
    {
      id: 'qqZone',
      name: 'QQ空间',
      icon: 'fl-icon-kongjian',
      bgColor: '#66d8f7',
    },
    { id: 'qq', name: 'QQ', icon: 'fl-icon-QQ', bgColor: '#5382d3' },
    { id: 'weibo', name: '微博', icon: 'fl-icon-weibo', bgColor: '#ff6f68' },
    { id: 'wechat', name: '微信', icon: 'fl-icon-weixin', bgColor: '#1ec76f' },
    { id: 'douban', name: '豆瓣', icon: 'fl-icon-douban', bgColor: '#42a151' },
  ];

  /** 关闭弹窗 */
  const closePopup = () => {
    setPopupShow(false);
    setQrcodeShow(false);
  };

  const share = (item: { id: string; name: string }) => {
    const summary = ``;

    if (item.id === 'qqZone') {
      // QQ空间
      const shareWeb = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&desc=${shareText}&summary=${summary}&title=${title}&pics=${cover}`;
      window.open(shareWeb);
    } else if (item.id === 'weibo') {
      // 微博
      const weiboTitle = `我在freelog发现一个不错的${type === 'node' ? '节点' : '资源'}：${title}`;
      window.open(
        `https://service.weibo.com/share/share.php?url=${url}&title=${weiboTitle}&pic=${cover}`,
      );
    } else if (item.id === 'douban') {
      // 豆瓣
      // window.open(`https://www.douban.com/share/service?url=${url}&title=${title}&image=${cover}`);
      // window.open(`https://www.douban.com/share/service?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&image=${encodeURIComponent(cover || '')}`);
      window.open(handleDoubanUrl({
        href: url,
        name: title,
        text: shareText,
        image: cover || '',
      }));
    } else if (['qq', 'wechat'].includes(item.id)) {
      // qq、微信
      const qrcodeInfo = { name: item.name, url };
      setPopupShow(false);
      setQrcodeShow(true);
      setQrcodeInfo(qrcodeInfo);
    } else if (item.id === 'copy') {
      // 复制链接
      const input: any = document.getElementById('url');
      input.select();
      document.execCommand('Copy');
      fMessage('链接复制成功～', 'success');
    }
  };

  React.useEffect(() => {
    setShareText(`我在freelog发现一个不错的${type === 'node' ? '节点' : '资源'}：${title} ${url}`);
  }, []);

  return (
    <>
      <div onClick={() => setPopupShow(true)}>{children}</div>

      {(popupShow || qrcodeShow) && (
        <div className={styles.popup} onClick={closePopup}>
          {popupShow && (
            <div className={styles['share-popup']} onClick={(e) => e.stopPropagation()}>
              <div className={styles['share-title']}>分享</div>

              <input id='url' className={styles['hidden-input']} value={url} readOnly />

              <textarea
                className={styles.textarea}
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
              />

              <div className={styles['btns-box']}>
                <div className={styles['share-btns']}>
                  <div className={styles['share-label']}>快速分享至：</div>
                  {shareBtns.map((item: shareBtnItem) => {
                    return (
                      <FTooltip title={`分享至${item.name}`} key={item.id}>
                        <div
                          className={styles['share-btn-item']}
                          style={{ backgroundColor: item.bgColor }}
                          onClick={() => share(item)}
                        >
                          <i className={`freelog ${item.icon} ${styles.freelog}`} />
                        </div>
                      </FTooltip>
                    );
                  })}
                </div>

                <div className={styles['copy-btn']} onClick={() => share({ id: 'copy', name: '' })}>
                  复制链接
                </div>
              </div>
            </div>
          )}

          {qrcodeShow && (
            <div className={styles['qrcode-popup']} onClick={(e) => e.stopPropagation()}>
              <i
                className={`freelog fl-icon-guanbi ${styles['close-btn']}`}
                onClick={() => setQrcodeShow(false)}
              />
              <div className={styles['qrcode-text']}>分享到{qrcodeInfo.name}</div>
              <QRCode value={qrcodeInfo.url} size={220} />
              <div className={styles['qrcode-text']}>使用{qrcodeInfo.name}扫一扫完成分享</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

interface HandleDoubanUrlParams {
  href: string;
  name: string;
  text: string;
  image: string;
}

function handleDoubanUrl(params: HandleDoubanUrlParams): string {
  // var _shareUrl = 'http://shuo.douban.com/!service/share?';
  // _shareUrl += 'href=' + encodeURIComponent(url || location.href);//分享的链接
  // _shareUrl += '&name=' + encodeURIComponent(title || document.title);//分享的标题
  // _shareUrl += '&image=' + encodeURIComponent(pic || '');//分享的图片
  // window.open(_shareUrl, '_blank');
  // return `http://shuo.douban.com/!service/share?href=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}&image=${encodeURIComponent(pic)}`;
  // return `https://www.douban.com/share/service?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}image=${encodeURIComponent(image)}`

  const search: string = Object.entries(params)
    .map((p) => {
      return p[0] + '=' + encodeURIComponent(p[1]);
    })
    .join('&');
  return `https://www.douban.com/share/service?${search}`;
}
