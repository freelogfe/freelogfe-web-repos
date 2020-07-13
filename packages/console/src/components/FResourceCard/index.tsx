import * as React from 'react';
import {Divider, Tag} from 'antd';
import Status from './Status';
import Policy from './Policy';
import {FContentText} from '@/components/FText';

import styles from './index.less';

type EventFunc = (resource: FResourceCardProps['resource']) => void

interface FResourceCardProps {
  className?: string;
  type?: 'resource' | 'favorite' | 'market';
  resource: {
    cover: string;
    title: string;
    version: string;
    policy: string[];
    type: string;
  };
  onBoomJuice?: EventFunc;
  onClickDetails?: EventFunc;
  onClickEditing?: EventFunc;
  onClickRevision?: EventFunc;
  onClickMore?: EventFunc;
  onClick?: EventFunc;
}

export default function ({
                           className = '', type = 'market',
                           resource,
                           onBoomJuice, onClickDetails, onClickEditing, onClickRevision, onClickMore, onClick
                         }: FResourceCardProps) {
  return (
    <div onClick={() => onClick && onClick(resource)}
         className={[styles.FResourceCard, className, type === 'market' ? styles.gesture : ''].join(' ')}>
      <div className={styles.Cover}>
        {
          resource.cover && (<img
            src={resource.cover}
            alt=""/>)
        }

        {
          type === 'market' || (<>
            <nav className={styles.CoverMask}>
              <div className={styles.CoverMaskNav}>
                {
                  type === 'favorite'
                    ? (
                      <a onClick={() => onBoomJuice && onBoomJuice(resource)}>取消收藏</a>
                    )
                    : (
                      <>
                        <a onClick={() => onClickDetails && onClickDetails(resource)}>资源详情</a>
                        <Divider className={styles.Divider} type="vertical"/>
                        <a onClick={() => onClickEditing && onClickEditing(resource)}>编辑</a>
                        <Divider className={styles.Divider} type="vertical"/>
                        <a onClick={() => onClickRevision && onClickRevision(resource)}>更新版本</a>
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
        <FContentText
          singleRow={true}
          text={resource.title}
        />
        <div style={{height: '6px'}}/>
        <div className={styles.MetaInfo}>
          <FContentText type="additional1" text={resource.type}/>
          <FContentText type="additional1" text={'最新版本 ' + resource.version}/>
        </div>
        <div style={{height: '15px'}}/>
        <div className={styles.MetaFooter}>
          <div>
            {
              resource.policy.map((i: string) => <Policy key={i} text={i}/>)
            }
          </div>
          <a onClick={() => onClickMore && onClickMore(resource)}>更多>></a>
        </div>
      </div>
    </div>
  );
}
