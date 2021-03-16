import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/marketResourcePage";

interface ResourcesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Resources({dispatch, marketResourcePage}: ResourcesProps) {

  const showResource: any = marketResourcePage.signedResources || marketResourcePage.signResources;

  // console.log(showResource, 'showResource3209');

  function onChangeSelected(id: string) {
    // console.log(id, 'id3209udsf');
    // console.log(marketResourcePage.signedResources, 'id3209udsf');
    if (marketResourcePage.signedResources) {
      dispatch<ChangeAction>({
        type: 'marketResourcePage/change',
        payload: {
          signedResources: marketResourcePage.signedResources.map((sr) => ({
            ...sr,
            selected: id === sr.id,
          })),
        },
      });
      return;
    }
    dispatch<ChangeAction>({
      type: 'marketResourcePage/change',
      payload: {
        signResources: marketResourcePage.signResources.map((sr) => ({
          ...sr,
          selected: id === sr.id,
        }))
      }
    });
  }

  return (<>
    <div style={{height: 7}}/>
    <div className={styles.signLeftNav}>选择主资源授权策略</div>
    {
      showResource
        .filter((r: any, i: number) => i === 0)
        .map((r: any) => (<a
          key={r.id}
          className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
          onClick={() => onChangeSelected(r.id)}
        >
          <FTitleText
            type="h5"
            text={r.name}
            singleRow
          />
          <div style={{height: 5}}/>
          <FContentText
            type="additional2"
            text={r.type}
          />
          <div style={{height: 5}}/>
          <div className={styles.policeTags}>
            {
              r.policies?.filter((p: any) => p.checked)
                .map((p: any) => (<label key={p.id}>{p.name}</label>))
            }
            {
              r.contracts?.map((c: any) => (<label key={c.id}>{c.name}</label>))
            }
          </div>
        </a>))
    }

    {
      showResource.length > 1 && (<div className={styles.signLeftNav}>选择基础上抛授权策略</div>)
    }

    {
      showResource
        .filter((r: any, i: number) => i !== 0)
        .map((r: any) => (
          <a
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            key={r.id}
            onClick={() => onChangeSelected(r.id)}
          >
            <FTitleText
              type="h5"
              text={r.name}
              singleRow
            />
            <div style={{height: 5}}/>
            <FContentText
              type="additional2"
              text={r.type}
            />
            <div style={{height: 5}}/>
            <div className={styles.policeTags}>
              {
                r.policies?.filter((p: any) => p.checked)
                  .map((p: any) => (<label key={p.id}>{p.name}</label>))
              }
              {
                r.contracts?.map((c: any) => (<label key={c.id}>{c.name}</label>))
              }
            </div>
          </a>))
    }
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Resources);
