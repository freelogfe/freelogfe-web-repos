import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {connect, Dispatch} from "dva";
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import {FTextBtn} from "@/components/FButton";

interface RelationProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Relation({exhibitInfoPage}: RelationProps) {
  return (<div className={styles.info}>
    <FContentText
      text={FUtil1.I18n.message('relevant_resource')}
      type="highlight"
    />
    <div style={{height: 20}}/>
    <div className={styles.cover}>
      <img
        alt=""
        src={exhibitInfoPage.resourceCover || imgSrc}
        onClick={() => {
          window.open(FUtil.LinkTo.resourceDetails({
            resourceID: exhibitInfoPage.resourceId,
          }));
        }}
      />
    </div>

    <div style={{height: 12}}/>
    <FTextBtn
      type="default"
      onClick={() => {
        window.open(FUtil.LinkTo.resourceDetails({resourceID: exhibitInfoPage.resourceId}));
      }}
    >
      <FContentText
        text={exhibitInfoPage.resourceName}
      />
    </FTextBtn>
    <div style={{height: 10}}/>
    <div style={{fontSize: 12, color: '#666'}}>{exhibitInfoPage.resourceType}</div>
  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Relation);
