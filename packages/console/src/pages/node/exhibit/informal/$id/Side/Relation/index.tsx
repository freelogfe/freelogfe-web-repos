import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';

interface RelationProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Relation({ informExhibitInfoPage }: RelationProps) {
  if (!informExhibitInfoPage.side_Resource_Relation) {
    return null;
  }

  return (<div className={styles.info}>
    <FComponentsLib.FContentText text={informExhibitInfoPage.side_Resource_Relation?.cardTitle} type='highlight' />
    <div style={{ height: 20 }} />
    <div className={styles.cover}>
      {/*<img*/}
      {/*  alt=""*/}
      {/*  onClick={() => {*/}
      {/*    window.open(informExhibitInfoPage.side_Resource_Relation?.linkToDetails);*/}
      {/*  }}*/}
      {/*  src={informExhibitInfoPage.side_Resource_Relation?.cover || imgSrc}*/}
      {/*/>*/}
      <div onClick={() => {
        window.open(informExhibitInfoPage.side_Resource_Relation?.linkToDetails);
      }}>
        <FCoverImage src={informExhibitInfoPage.side_Resource_Relation?.cover || ''} width={220}
                     style={{ borderRadius: 10 }} />
      </div>
    </div>

    <div style={{ height: 12 }} />
    <FComponentsLib.FTextBtn
      type='default'
      onClick={() => {
        window.open(informExhibitInfoPage.side_Resource_Relation?.linkToDetails);
      }}
    >
      <FComponentsLib.FContentText
        style={{ width: 220 }}
        singleRow
        text={informExhibitInfoPage.side_Resource_Relation?.name}
      />
    </FComponentsLib.FTextBtn>
    <div style={{ height: 10 }} />
    <div style={{
      fontSize: 12,
      color: '#666',
    }}>{FUtil.Format.resourceTypeKeyArrToResourceType(informExhibitInfoPage.side_Resource_Relation?.type || [])}</div>
  </div>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Relation);
