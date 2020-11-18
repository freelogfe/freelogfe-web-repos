import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {connect, Dispatch} from "dva";
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";

interface RelationProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Relation({exhibitInfoPage}: RelationProps) {
  return (<div className={styles.info}>
    <FTitleText text={'关联资源'} type="h4"/>
    <div style={{height: 20}}/>
    <div className={styles.cover} style={{cursor: 'default'}}>
      <img
        alt=""
        src={exhibitInfoPage.resourceCover || imgSrc}
      />
    </div>

    <div style={{height: 12}}/>
    <FContentText singleRow text={exhibitInfoPage.resourceName}/>
    <div style={{height: 10}}/>
    <div style={{fontSize: 12, color: '#666'}}>{exhibitInfoPage.resourceType}</div>
  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Relation);
