import * as React from 'react';
import styles from './index.less';
import { FContentText } from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import { FTextBtn } from '@/components/FButton';
import FCoverImage from '@/components/FCoverImage';

interface RelationProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Relation({ exhibitInfoPage }: RelationProps) {
  return (<div className={styles.info}>
    <FContentText
      text={FUtil1.I18n.message('relevant_resource')}
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
      {/*<img*/}
      {/*  alt=""*/}
      {/*  src={exhibitInfoPage.side_ResourceCover || imgSrc}*/}
      {/*  onClick={() => {*/}
      {/*    window.open(FUtil.LinkTo.resourceDetails({*/}
      {/*      resourceID: exhibitInfoPage.side_ResourceID,*/}
      {/*    }));*/}
      {/*  }}*/}
      {/*/>*/}
    </div>

    <div style={{ height: 12 }} />
    <FTextBtn
      type='default'
      onClick={() => {
        window.open(FUtil.LinkTo.resourceDetails({ resourceID: exhibitInfoPage.side_ResourceID }));
      }}
    >
      <FContentText
        style={{ width: 220 }}
        singleRow
        text={exhibitInfoPage.side_ResourceName}
      />
    </FTextBtn>
    <div style={{ height: 10 }} />
    <div style={{ fontSize: 12, color: '#666' }}>{exhibitInfoPage.side_ResourceType}</div>
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Relation);
