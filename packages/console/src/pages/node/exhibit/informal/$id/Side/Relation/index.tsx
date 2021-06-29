import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {connect, Dispatch} from "dva";
import {ConnectState, InformExhibitInfoPageModelState} from "@/models/connect";

interface RelationProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Relation({informExhibitInfoPage}: RelationProps) {
  if (!informExhibitInfoPage.relation) {
    return null;
  }

  return (<div className={styles.info}>
    <FContentText text={informExhibitInfoPage.relation?.cardTitle} type="highlight"/>
    <div style={{height: 20}}/>
    <div className={styles.cover} style={{cursor: 'default'}}>
      <img
        alt=""
        src={informExhibitInfoPage.relation?.cover || imgSrc}
      />
    </div>

    <div style={{height: 12}}/>
    <FContentText singleRow text={informExhibitInfoPage.relation?.name}/>
    <div style={{height: 10}}/>
    <div style={{fontSize: 12, color: '#666'}}>{informExhibitInfoPage.relation?.type}</div>
  </div>);
}

export default connect(({informExhibitInfoPage}: ConnectState) => ({
  informExhibitInfoPage,
}))(Relation);
