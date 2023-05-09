import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';

interface RelationProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Relation({ exhibitInfoPage }: RelationProps) {
  return (<div className={styles.info}>
    <FComponentsLib.FContentText
      text={FI18n.i18nNext.t('relevant_resource')}
      type='highlight'
    />
    <div style={{ height: 20 }} />
    <div className={styles.cover}>
      <div onClick={() => {
        window.open(FUtil.LinkTo.resourceDetails({
          resourceID: exhibitInfoPage.side_ResourceID,
        }));
      }}>
        <FCoverImage src={exhibitInfoPage.side_ResourceCover || ''} width={220} style={{ borderRadius: 10 }} />
      </div>
    </div>

    <div style={{ height: 12 }} />
    <FComponentsLib.FTextBtn
      type='default'
      onClick={() => {
        window.open(FUtil.LinkTo.resourceDetails({ resourceID: exhibitInfoPage.side_ResourceID }));
      }}
    >
      <FComponentsLib.FContentText
        style={{ width: 220 }}
        singleRow
        text={exhibitInfoPage.side_ResourceName}
      />
    </FComponentsLib.FTextBtn>
    <div style={{ height: 10 }} />
    <div style={{
      fontSize: 12,
      color: '#666',
    }}>{FUtil.Format.resourceTypeKeyArrToResourceType(exhibitInfoPage.side_ResourceType)}</div>
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Relation);
