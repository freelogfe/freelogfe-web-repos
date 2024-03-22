import * as React from 'react';
import styles from './index.less';
import { Checkbox } from 'antd';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import img_choiceLabel from '@/assets/choice-label@2x.png';

interface FResourceCard_AbleCheck_Props {
  checked: boolean;
  disabled?: boolean;
  showUserInfo?: boolean;
  resource: {
    title: string;
    cover: string;
    resourceType: string;
    latestVersion: string;
    policies: string[];
    status: 0 | 1 | 2 | 4;
    updateDate: string;
    username: string;
    useAvatar: string;
    isChoice: boolean;
  };

  onChange?(checked: boolean): void;
}

function FResourceCard_AbleCheck({
                                   checked,
                                   disabled = false,
                                   resource,
                                   onChange,
                                   showUserInfo = true,
                                 }: FResourceCard_AbleCheck_Props) {
  return (<div style={{ position: 'relative' }}>
    <div
      className={[styles.ableCheckCard, checked ? styles.checked : '', disabled ? styles.disabled : ''].join(' ')}
      onClick={() => {
        if (disabled) {
          return;
        }
        onChange && onChange(!checked);
      }}
    >
      <div>
        <Checkbox
          checked={checked}
          disabled={disabled}
        />
      </div>
      <div style={{ height: 10 }} />
      {/*<div style={{ display: 'block' }}>*/}
      <FCoverImage
        src={resource.cover}
        width={280}
      />
      {/*</div>*/}
      <div style={{ height: 10 }} />
      <FComponentsLib.FContentText
        text={resource.title}
        type={'highlight'}
        style={{ maxWidth: 280 }}
        singleRow
      />
      <div style={{ height: 10 }} />
      <div className={styles.ableCheckCardInfo}>
        <FComponentsLib.FContentText
          text={resource.resourceType}
          type={'additional2'}
          style={{ maxWidth: 120 }}
          singleRow
        />

        {/*<FComponentsLib.FContentText*/}
        {/*  text={latestVersion === '' ? '暂无版本' : `最新版本 ${latestVersion}`}*/}
        {/*  type={'additional2'}*/}
        {/*  style={{ maxWidth: 120 }}*/}
        {/*  singleRow*/}
        {/*/>*/}
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText
          singleRow
          // style={{ maxWidth: 120 }}
          type='additional2'
          // text={resource.version ? (FI18n.i18nNext.t('latest_version') + ' ' + resource.version) : '暂无版本'}
          text={`最新更新时间 ${resource.updateDate}`}
        />
      </div>
      <div style={{ height: 10 }} />
      <div className={styles.MetaFooter}>
        {
          resource.policies.length > 0
            ? (<FComponentsLib.F_Contract_And_Policy_Labels
              data={resource.policies.map((p) => {
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
      {
        showUserInfo && (<>
          <div style={{ height: 12 }} />
          <div className={styles.user}>
            <img src={resource.useAvatar || img_choiceLabel} alt={''} />
            <span>{resource.username}</span>
          </div>
        </>)
      }
    </div>

    <div style={{ position: 'absolute', top: 52, left: 20 }}>
      <FResourceStatusBadge
        status={resource.status === 2
          ? 'freeze'
          : resource.status === 1
            ? 'online'
            : resource.status === 0
              ? 'unreleased'
              : 'offline'}
      />
    </div>

    {
      resource.isChoice && (<img
        src={img_choiceLabel}
        alt={''}
        style={{ position: 'absolute', right: 20, top: 52, width: 63 }}
      />)
    }
  </div>);
}

export default FResourceCard_AbleCheck;
