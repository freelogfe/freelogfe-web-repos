import * as React from 'react';
import Policy from './Policy';
import { FContentText } from '../FText';
import styles from './index.less';
import FResourceStatusBadge from '../FResourceStatusBadge';
import FUtil1 from '@/utils';
import FCoverImage from '@/components/FCoverImage';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import { FWarning } from '@/components/FIcons';
import FTooltip from '@/components/FTooltip';
import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';

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
    authProblem?: boolean;
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
        <FCoverImage src={resource.cover} width={280} style={{ borderRadius: 4 }} />
        {
          type === 'market' || (<>
            <nav className={styles.CoverMask}>
              {
                type === 'favorite'
                  ? (<FCoverFooterButtons buttons={[
                    {
                      type: 'resourceDetails',
                      fn() {
                        onClickDetails && onClickDetails();
                      },
                    },
                    {
                      type: 'cancelCollect',
                      fn() {
                        onBoomJuice && onBoomJuice();
                      },
                    },
                  ]} />)
                  : (<FCoverFooterButtons buttons={[
                    {
                      type: 'resourceDetails',
                      fn() {
                        onClickDetails && onClickDetails();
                      },
                    },
                    {
                      type: 'edit',
                      fn() {
                        onClickEditing && onClickEditing();
                      },
                    },
                    {
                      type: 'update',
                      fn() {
                        onClickRevision && onClickRevision();
                      },
                    },
                  ]} />)
              }
            </nav>
            <div className={styles.Status}>
              <FResourceStatusBadge
                status={resource.status === 1 ? 'online' : !resource.version ? 'unreleased' : 'offline'}
              />
              <div style={{ width: 10 }} />
              {resource.authProblem && <FTooltip title={'存在授权问题'}><FWarning style={{ fontSize: 16 }} /></FTooltip>}
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
            resource.policy.length > 0
              // ? resource.policy.map((i: string) => <Policy key={i} text={i} />)
              ? (<F_Contract_And_Policy_Labels
                data={resource.policy.map((p) => {
                  return {
                    text: p,
                    dot: '',
                  };
                })}
                singleRow
              />)
              : (<FContentText text={'暂无策略…'} type='additional2' />)
          }
        </div>
      </div>
    </div>
  );
}

export default FResourceCard;
