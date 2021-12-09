import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, MarketResourcePageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/marketResourcePage';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { FTextBtn } from '@/components/FButton';
import { FUtil } from '@freelog/tools-lib';

interface ResourcesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Resources({ dispatch, marketResourcePage }: ResourcesProps) {

  function onChangeSelected(id: string) {
    dispatch<ChangeAction>({
      type: 'marketResourcePage/change',
      payload: {
        signResources: marketResourcePage.signResources.map((sr) => ({
          ...sr,
          selected: id === sr.id,
        })),
      },
    });
  }

  return (<>
    <div style={{ height: 7 }} />
    <div className={styles.signLeftNav}>选择主资源授权策略</div>
    {
      marketResourcePage.signResources
        .filter((r: any, i: number) => i === 0)
        .map((r: any) => {
          return (<div
            key={r.id}
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            onClick={() => onChangeSelected(r.id)}
          >
            <div className={styles.title}>
              <FContentText
                type='highlight'
                text={r.name}
                singleRow
                className={styles.titleText}
                style={{ maxWidth: r.status === 0 ? 170 : '100%' }}
              />

              {
                r.status === 0 && (<>
                  <FResourceStatusBadge status={'offline'} />
                  <div style={{ width: 5 }} />
                </>)
              }

            </div>
            <div style={{ height: 5 }} />
            <FContentText
              type='additional2'
              text={r.type}
            />
            <div style={{ height: 5 }} />
            <div className={styles.policeTags}>
              {
                r.policies?.filter((p: any) => p.checked)
                  .map((p: any) => (<div key={p.id}>{p.name}</div>))
              }
              {
                r.contracts?.map((c: any) => (<div key={c.id}>
                  <span>{c.name}</span>
                  <div style={{ width: 5 }} />
                  <label style={{
                    backgroundColor: c.status === 'terminal'
                      ? '#999' :
                      c.status === 'inactive'
                        ? '#E9A923' : '#42C28C',
                  }} />
                </div>))
              }
            </div>
          </div>);
        })
    }

    {
      marketResourcePage.signResources.length > 1 && (<div className={styles.signLeftNav}>选择基础上抛授权策略</div>)
    }

    {
      marketResourcePage.signResources
        .filter((r, i: number) => i !== 0)
        .map((r) => {
          // console.log(r, '####902j3l42k3jl');
          return (<div
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            key={r.id}
            onClick={() => onChangeSelected(r.id)}
          >
            <div className={styles.title}>
              <FTextBtn
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(FUtil.LinkTo.resourceDetails({
                    resourceID: r.id,
                  }));
                }}>
                <FContentText
                  type='highlight'
                  text={r.name}
                  singleRow
                  className={styles.titleText}
                  style={{ maxWidth: r.status === 0 ? 170 : 225 }}
                />
              </FTextBtn>
              {
                r.status === 0 && (<>
                  <FResourceStatusBadge status={'offline'} />
                  <div style={{ width: 5 }} />
                </>)
              }

            </div>
            <div style={{ height: 5 }} />
            <FContentText
              type='additional2'
              text={r.type}
            />
            <div style={{ height: 5 }} />
            <div className={styles.policeTags}>
              {
                r.contracts
                  .filter((c) => {
                    return c.checked;
                  })
                  .map((c) => {
                    // console.log(c, 'cCCCCC89ulik');
                    return (<div key={c.id}>
                      <span>{c.name}</span>
                      <div style={{ width: 5 }} />
                      <label style={{
                        backgroundColor: c.status === 'terminal'
                          ? '#999' :
                          c.status === 'inactive'
                            ? '#E9A923' : '#42C28C',
                      }} />
                    </div>);
                  })
              }
              {
                r.policies
                  .filter((p: any) => {
                    return p.checked;
                  })
                  .map((p: any) => {
                    return (<div key={p.id}>{p.name}</div>);
                  })
              }
            </div>
          </div>);
        })
    }
  </>);
}

export default connect(({ marketResourcePage }: ConnectState) => ({ marketResourcePage }))(Resources);
