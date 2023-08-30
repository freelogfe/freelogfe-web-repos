import * as React from 'react';
import styles from './index.less';
import FResourceStatusBadge from '../FResourceStatusBadge';
import FCoverImage from '@/components/FCoverImage';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';

type EventFunc = () => void

export interface FResourceCardProps {
  className?: string;
  type?: 'resource' | 'favorite' | 'market';
  resource: {
    id: string;
    cover: string;
    name: string;
    title: string;
    version: string;
    policy: string[];
    type: string[];
    status: 0 | 1 | 2 | 4;
    authProblem?: boolean;
  };
  onBoomJuice?: EventFunc;
  onClickDetails?: EventFunc;
  onClickEditing?: EventFunc;
  onClickRevision?: EventFunc;
  // onClickMore?: EventFunc;
  onClick?: EventFunc;
}

function FResourceCard({
                         className = '', type = 'market', resource,
                         onBoomJuice, onClickDetails, onClickEditing, onClickRevision, onClick,
                       }: FResourceCardProps) {
  return (
    <div
      onClick={() => onClick && onClick()}
      className={[styles.styles, className, type === 'market' ? styles.gesture : ''].join(' ')}
    >
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
                status={resource.status === 2
                  ? 'freeze'
                  : resource.status === 1
                    ? 'online'
                    : resource.status === 0
                      ? 'unreleased'
                      : 'offline'}
              />
              <div style={{ width: 10 }} />
              {resource.authProblem &&
              <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning style={{ fontSize: 16 }} /></FTooltip>}
            </div>
          </>)
        }

      </div>

      <div className={styles.Meta}>
        <div style={{ height: '12px' }} />
        <FComponentsLib.FContentText
          singleRow={true}
          text={resource.title || resource.name}
        />
        <div style={{ height: '6px' }} />
        <div className={styles.MetaInfo}>
          <FComponentsLib.FContentText
            type='additional1'
            text={FUtil.Format.resourceTypeKeyArrToResourceType(resource.type)}
          />
          <FComponentsLib.FContentText
            type='additional1'
            text={resource.version ? (FI18n.i18nNext.t('latest_version') + ' ' + resource.version) : '暂无版本'}
          />
        </div>
        <div style={{ height: '15px' }} />
        <div className={styles.MetaFooter}>
          {
            resource.policy.length > 0
              // ? resource.policy.map((i: string) => <Policy key={i} text={i} />)
              ? (<FComponentsLib.F_Contract_And_Policy_Labels
                data={resource.policy.map((p) => {
                  return {
                    text: p,
                    dot: '',
                  };
                })}
                singleRow
              />)
              : (<FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />)
          }
        </div>
      </div>
    </div>
  );
}

export default FResourceCard;
