import * as React from 'react';
import styles from './index.less';
import { CSSProperties, ImgHTMLAttributes } from 'react';
import { FUtil } from '@freelog/tools-lib';

// import * as imgSrc from '@/assets/default-resource-cover.jpg';

interface FCoverImageProps {
  src: string;
  width: number;

  style?: CSSProperties;
  className?: string;
}

interface FCoverImageStates {
  imgStyle: {
    width: number;
    height: number;
    translateX: number;
    translateY: number;
    transform: string;
  } | null;
}

function FCoverImage({ src, width, style = {}, className = '' }: FCoverImageProps) {

  const [imgStyle, setImgStyle] = React.useState<FCoverImageStates['imgStyle']>(null);

  React.useEffect(() => {
    if (!src.includes('#')) {
      setImgStyle(null);
    } else {
      const { x, y, w, h, r, width: wh, height: ht } = hashString(src);
      const scale: number = width / w;
      setImgStyle({
        width: wh * scale,
        height: ht * scale,
        translateX: -x * scale,
        translateY: -y * scale,
        transform: `rotate(${r})`,
      });
    }

  }, [src, width]);


  return (<div
    className={[styles.FCoverImage, className].join(' ')}
    style={{
      ...style,
      width,
      height: width / 4 * 3,
      // backgroundImage: `url("${src}")`,
      // backgroundPosition: `${-y}px ${w - wh}px ${h - ht}px ${-x}px`,
    }}
  >
    {
      imgStyle
        ? (<img
          src={src}
          alt={''}
          style={{
            width: imgStyle.width,
            height: imgStyle.height,
            transform: `translateX(${imgStyle.translateX}px) translateY(${imgStyle.translateY}px)`,
          }}
        />)
        : (<img
          // src={src || (FUtil.Format.completeUrlByDomain('static') + '/static/default_cover.png')}
          src={src || '//static.freelog.com/static/default_cover.png'}
          style={{
            width: width,
            height: width / 4 * 3,
          }}
          alt={''}
        />)
    }
    {/*http://static.testfreelog.com/static/default_cover.png*/}
  </div>);
}

export default FCoverImage;

interface HashStringReturn {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  width: number;
  height: number;
}

function hashString(str: string): HashStringReturn {
  let params = str.split('#')[1];
  let param = params.split('&');
  let obj: { [key: string]: number } = {}; // 用一个对象存储目标值
  for (const kv of param) {
    let [key, value] = kv.split('=');
    obj[key] = Number(value);
  }
  if (typeof obj['r'] !== 'number') {
    obj['r'] = 0;
  }
  return obj as any;
}

