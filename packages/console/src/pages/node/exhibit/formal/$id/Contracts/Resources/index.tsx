import * as React from 'react';
import styles from './index.less';
import {connect, Dispatch} from "dva";
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {FContentText, FTitleText} from "@/components/FText";
import {FTextBtn} from "@/components/FButton";
import FUtil from "@/utils";
import {ChangeAction} from "@/models/exhibitInfoPage";

interface ResourcesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Resources({dispatch, exhibitInfoPage}: ResourcesProps) {

  const [mainResource, ...otherResource] = exhibitInfoPage.associated;

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: payload,
    });
  }

  // function onChangeSelect(id: string) {
  //   onChange({
  //     associated: exhibitInfoPage.associated.map((a) => ({
  //       ...a,
  //       selected: a.id === id
  //     })),
  //   });
  // }

  return (<>
    <FTitleText type="h4">主资源</FTitleText>

    <a
      className={styles.signResource + ' ' + (mainResource.id === exhibitInfoPage.selectedAssociatedID ? styles.activatedSignResource : '')}
      onClick={() => onChange({selectedAssociatedID: mainResource.id})}
    >
      <FTextBtn
        onClick={(e) => {
          e.stopPropagation();
          window.open(FUtil.LinkTo.resourceDetails({
            resourceID: mainResource.id,
          }));
        }}
      >
        <FContentText
          type="highlight"
          text={mainResource.name}
          singleRow
          className={styles.FContentText}
        />
      </FTextBtn>
      <div style={{height: 5}}/>
      <FContentText
        type="additional2"
        text={mainResource.type}
      />
      <div style={{height: 5}}/>
      <div className={styles.policeTags}>
        {
          mainResource.contracts.map((c) => (<label key={c.id}>{c.name}</label>))
        }
      </div>
    </a>

    {
      otherResource.length > 0 && (<FTitleText type="h4">基础上抛</FTitleText>)
    }

    {
      otherResource.map((r) => (<a
        className={styles.signResource + ' ' + (exhibitInfoPage.selectedAssociatedID === r.id ? styles.activatedSignResource : '')}
        onClick={() => onChange({selectedAssociatedID: r.id})}
        key={r.id}
      >
        <FTextBtn
          onClick={(e) => {
            e.stopPropagation();
            window.open(FUtil.LinkTo.resourceDetails({
              resourceID: r.id,
            }));
          }}
        >
          <FContentText
            type="highlight"
            text={r.name}
            singleRow
            className={styles.FContentText}
          />
        </FTextBtn>
        <div style={{height: 5}}/>
        <FContentText
          type="additional2"
          text={r.type}
        />
        <div style={{height: 5}}/>
        <div className={styles.policeTags}>
          {
            r.contracts.map((c) => (<label key={c.id}>{c.name}</label>))
          }
        </div>
      </a>))
    }
  </>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Resources);
