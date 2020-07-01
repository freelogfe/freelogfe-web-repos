import * as React from 'react';
import {Divider, Tag} from 'antd';
import Status from './Status';
import Policy from './Policy';
import {FContentText} from '@/components/FText';

import styles from './index.less';

interface Interface {
  // isFavorite?: boolean;
  className?: string;
  type?: 'resource' | 'favorite' | 'market';
}

export default function ({className = '', type = 'market'}: Interface) {
  return (
    <div className={[styles.FResourceCard, className, type === 'market' ? styles.gesture : ''].join(' ')}>
      <div className={styles.Cover}>
        {/*<img*/}
        {/*  src={'https://image.freelog.com/preview/6e042474-8ed9-4fe1-936e-5edb86901315.png?x-oss-process=style/webp_image'}/>*/}

        {
          type === 'market' || (<>
            <nav className={styles.CoverMask}>
              <div className={styles.CoverMaskNav}>
                {
                  type === 'favorite'
                    ? (
                      <a href="#">取消收藏</a>
                    )
                    : (
                      <>
                        <a href="#">资源详情</a>
                        <Divider className={styles.Divider} type="vertical"/>
                        <a href="#">编辑</a>
                        <Divider className={styles.Divider} type="vertical"/>
                        <a href="#">更新版本</a>
                      </>
                    )
                }
              </div>
            </nav>
            <Status normal={true} className={styles.Status}/>
          </>)
        }

      </div>

      <div className={styles.Meta}>
        <div style={{height: '12px'}}/>
        <FContentText text={'这里是发行名称这里是发行名称这这里是发行名称这里是发行名称这'}/>
        <div style={{height: '6px'}}/>
        <div className={styles.MetaInfo}>
          <FContentText type="additional1" text={'image'}/>
          <FContentText type="additional1" text={'最新版本 1.0.10'}/>
        </div>
        <div style={{height: '15px'}}/>
        <div className={styles.MetaFooter}>
          <div>
            <Policy text={'免费'}/>
            <Policy text={'免费'}/>
            <Policy text={'免费'}/>
          </div>
          <a>更多>></a>
        </div>
      </div>
    </div>
  );
}
