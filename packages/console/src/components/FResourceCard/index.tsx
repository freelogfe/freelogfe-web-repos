import * as React from 'react';
import {Divider, Tag} from 'antd';
import Status from './Status';
import Policy from './Policy';
import {FContentText} from '@/components/FText';

import styles from './index.less';
import {i18nMessage} from "@/utils/i18n";

type EventFunc = () => void

export interface FResourceCardProps {
  className?: string;
  type?: 'resource' | 'favorite' | 'market';
  resource: {
    id: string;
    cover: string;
    title: string;
    version: string;
    policy: string[];
    type: string;
    status: 0 | 1;
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
    <div onClick={() => onClick && onClick()}
         className={[styles.FResourceCard, className, type === 'market' ? styles.gesture : ''].join(' ')}>
      <div className={styles.Cover}>
        {
          resource.cover && (<img
            // srcSet
            src={resource.cover}
            loading="lazy"
            alt=""
          />)
        }

        {
          type === 'market' || (<>
            <nav className={styles.CoverMask}>
              <div className={styles.CoverMaskNav}>
                {
                  type === 'favorite'
                    ? (<div className={styles.favorite}>
                      <a onClick={() => onClickDetails && onClickDetails()}>{i18nMessage('resource_details')}</a>
                      <span>|</span>
                      <a onClick={() => onBoomJuice && onBoomJuice()}>{i18nMessage('remove_from_collection')}</a>
                    </div>)
                    : (
                      <div className={styles.resources}>
                        <a
                          onClick={() => onClickDetails && onClickDetails()}>{i18nMessage('resource_details')}</a>
                        <span>|</span>
                        <a onClick={() => onClickEditing && onClickEditing()}>{i18nMessage('edit_resource')}</a>
                        <span>|</span>
                        <a
                          onClick={() => onClickRevision && onClickRevision()}>{i18nMessage('update_resource')}</a>
                      </div>
                    )
                }
              </div>
            </nav>
            <Status
              normal={resource.status === 1}
              className={styles.Status}
            />
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
          <FContentText
            type="additional1"
            text={resource.type}
          />
          <FContentText
            type="additional1"
            text={resource.version ? (i18nMessage('latest_version') + ' ' + resource.version) : '暂无版本'}
          />
        </div>
        <div style={{height: '15px'}}/>
        <div className={styles.MetaFooter}>
          <div>
            {
              resource.policy.map((i: string) => <Policy key={i} text={i}/>)
            }
          </div>
          {/*<a onClick={() => onClickMore && onClickMore()}>{i18nMessage('more_details')}>></a>*/}
        </div>
      </div>
    </div>
  );
}
