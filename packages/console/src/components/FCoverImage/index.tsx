import * as React from 'react';
import styles from './index.less';
import { ImgHTMLAttributes } from 'react';

interface FCoverImageProps extends ImgHTMLAttributes<any> {
  src: string;
  width: number;
}

interface FCoverImageStates {
  imgStyle: {
    width: number;
    height: number;
    translateX: number;
    translateY: number;
  } | null;
}

function FCoverImage({ src, width, ...props }: FCoverImageProps) {

  const [imgStyle, setImgStyle] = React.useState<FCoverImageStates['imgStyle']>(null);

  React.useEffect(() => {
    if (!src.includes('#')) {
      setImgStyle(null);
    } else {
      const { x, y, w, h, width: wh, height: ht } = hashString(src);
      const scale: number = width / w;
      setImgStyle({
        width: wh * scale,
        height: ht * scale,
        translateX: -x * scale,
        translateY: -y * scale,
      });
    }

  }, [src, width]);


  return (<div
    className={styles.FCoverImage}
    style={{
      width,
      // backgroundImage: `url("${src}")`,
      // backgroundPosition: `${-y}px ${w - wh}px ${h - ht}px ${-x}px`,
    }}
  >
    <img
      src={src}
      alt={''}
      style={{
        width: imgStyle.width,
        height: imgStyle.height,
        transform: `translateX(${imgStyle.translateX}px) translateY(${imgStyle.translateY}px)`,
      }}
    />
  </div>);
}

export default FCoverImage;

interface HashStringReturn {
  x: number;
  y: number;
  w: number;
  h: number;
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
  return obj as any;
}

