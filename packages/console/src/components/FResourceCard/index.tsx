import * as React from 'react';
import Policy from './Policy';
import { FContentText } from '../FText';
import styles from './index.less';
import FResourceStatusBadge from '../FResourceStatusBadge';
// import {FUtil} from '@freelog/tools-lib';
import FUtil1 from '@/utils';
import FCoverImage from '@/components/FCoverImage';

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

function FResourceCard({
                         className = '', type = 'market',
                         resource,
                         onBoomJuice, onClickDetails, onClickEditing, onClickRevision, onClickMore, onClick,
                       }: FResourceCardProps) {
  return (
    <div onClick={() => onClick && onClick()}
         className={[styles.styles, className, type === 'market' ? styles.gesture : ''].join(' ')}>
      <div className={styles.Cover}>
        {/*{*/}
        {/*  resource.cover && (<img*/}
        {/*    // srcSet*/}
        {/*    src={resource.cover}*/}
        {/*    loading='lazy'*/}
        {/*    alt=''*/}
        {/*  />)*/}
        {/*}*/}
        <FCoverImage src={resource.cover} width={280} />
        {
          type === 'market' || (<>
            <nav className={styles.CoverMask}>
              <div className={styles.CoverMaskNav}>
                {
                  type === 'favorite'
                    ? (<div className={styles.favorite}>
                      <a onClick={() => onClickDetails && onClickDetails()}>{FUtil1.I18n.message('resource_details')}</a>
                      <span>|</span>
                      <a onClick={() => onBoomJuice && onBoomJuice()}>{FUtil1.I18n.message('remove_from_collection')}</a>
                    </div>)
                    : (
                      <div className={styles.resources}>
                        <a
                          onClick={() => onClickDetails && onClickDetails()}>{FUtil1.I18n.message('resource_details')}</a>
                        <span>|</span>
                        <a onClick={() => onClickEditing && onClickEditing()}>{FUtil1.I18n.message('edit_resource')}</a>
                        <span>|</span>
                        <a
                          onClick={() => onClickRevision && onClickRevision()}>{FUtil1.I18n.message('update_resource')}</a>
                      </div>
                    )
                }
              </div>
            </nav>
            {/*<Status*/}
            {/*  normal={resource.status === 1}*/}
            {/*  className={styles.Status}*/}
            {/*/>*/}
            <div className={styles.Status}>
              <FResourceStatusBadge
                status={resource.status === 1 ? 'online' : !resource.version ? 'unreleased' : 'offline'}
              />
            </div>
          </>)
        }

      </div>

      <div className={styles.Meta}>
        <div style={{ height: '12px' }} />
        <FContentText
          singleRow={true}
          text={resource.title}
        />
        <div style={{ height: '6px' }} />
        <div className={styles.MetaInfo}>
          <FContentText
            type='additional1'
            text={resource.type}
          />
          <FContentText
            type='additional1'
            text={resource.version ? (FUtil1.I18n.message('latest_version') + ' ' + resource.version) : '暂无版本'}
          />
        </div>
        <div style={{ height: '15px' }} />
        <div className={styles.MetaFooter}>
          {
            resource.policy.map((i: string) => <Policy key={i} text={i} />)
          }
        </div>
      </div>
    </div>
  );
}

export default FResourceCard;
