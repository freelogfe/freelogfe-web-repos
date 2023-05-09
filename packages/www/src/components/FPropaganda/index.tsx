import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';


interface FPropagandaProps {
  style?: React.CSSProperties;
}

function FPropaganda({ style = {} }: FPropagandaProps) {
  return (<div
    className={styles.styles}
    style={style}
  >
    <FComponentsLib.FIcons.FFeather className={styles.FFeather} />
    <FComponentsLib.FTitleText
      type={'h2'}
      text={'Freelog，专业免费的资源发行和运营平台'}
      style={{ fontWeight: 600 }}
    />
    <FComponentsLib.FContentText
      type={'normal'}
      text={'支持图片、小说、游戏、漫画、视频、音乐、主题、插件等各类型资源快速变现'}
    />
  </div>);
}

export default FPropaganda;
