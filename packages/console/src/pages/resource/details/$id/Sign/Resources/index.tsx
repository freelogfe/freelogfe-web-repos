import * as React from 'react';
import styles from './index.less';
import { FContentText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceDetailPage';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { FTextBtn } from '@/components/FButton';
import { FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import { FWarning } from '@/components/FIcons';
// import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';
import FComponentsLib from '@freelog/components-lib';

interface ResourcesProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Resources({ dispatch, resourceDetailPage }: ResourcesProps) {

  function onChangeSelected(id: string) {
    dispatch<ChangeAction>({
      type: 'resourceDetailPage/change',
      payload: {
        signResources: resourceDetailPage.signResources.map((sr) => ({
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
      resourceDetailPage.signResources
        .filter((r, i: number) => i === 0)
        .map((r) => {
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

              {
                r.status === 1 && r.authProblem && (<>
                  <div style={{ width: 5 }} />
                  <FTooltip title={'存在授权问题'}><FWarning style={{ fontSize: 16 }} /></FTooltip>
                </>)
              }

            </div>
            <div style={{ height: 5 }} />
            <FContentText
              type='additional2'
              text={r.type}
            />
            <div style={{ height: 5 }} />
            <FComponentsLib.F_Contract_And_Policy_Labels data={
              [
                ...r.contracts
                  .filter((c) => {
                    return c.checked;
                  })
                  .map<{ text: string; dot: 'yellow' | 'green' }>((c) => {
                    return {
                      text: c.name,
                      dot: c.status === 'inactive' ? 'yellow' : 'green',
                    };
                  }),
                ...r.policies
                  .filter((p) => {
                    return p.checked;
                  })
                  .map<{ text: string; dot: '' }>((p) => {
                    return {
                      text: p.fullInfo.policyName,
                      dot: '',
                    };
                  }),
              ]
            } />
            {/*<div className={styles.policeTags}>*/}
            {/*  {*/}
            {/*    r.policies.filter((p) => p.checked)*/}
            {/*      .map((p) => (<div key={p.fullInfo.policyId}>{p.fullInfo.policyName}</div>))*/}
            {/*  }*/}
            {/*  {*/}
            {/*    r.contracts.map((c) => (<div key={c.id}>*/}
            {/*      <span>{c.name}</span>*/}
            {/*      <div style={{ width: 5 }} />*/}
            {/*      <label style={{*/}
            {/*        backgroundColor: c.status === 'terminal'*/}
            {/*          ? '#999' :*/}
            {/*          c.status === 'inactive'*/}
            {/*            ? '#E9A923' : '#42C28C',*/}
            {/*      }} />*/}
            {/*    </div>))*/}
            {/*  }*/}
            {/*</div>*/}
          </div>);
        })
    }

    {
      resourceDetailPage.signResources.length > 1 && (<div className={styles.signLeftNav}>选择基础上抛授权策略</div>)
    }

    {
      resourceDetailPage.signResources
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
              {/*{console.log(r, 'r903i2jrlksjdlfkjdflksdj')}*/}
              {
                r.status === 1 && r.authProblem && (<>
                  <div style={{ width: 5 }} />
                  <FTooltip title={'存在授权问题'}><FWarning style={{ fontSize: 16 }} /></FTooltip>
                </>)
              }

            </div>
            <div style={{ height: 5 }} />
            <FContentText
              type='additional2'
              text={r.type}
            />
            <div style={{ height: 5 }} />
            <FComponentsLib.F_Contract_And_Policy_Labels data={
              [
                ...r.contracts
                  .filter((c) => {
                    return c.checked;
                  })
                  .map<{ text: string; dot: 'yellow' | 'green' }>((c) => {
                    return {
                      text: c.name,
                      dot: c.status === 'inactive' ? 'yellow' : 'green',
                    };
                  }),
                ...r.policies
                  .filter((p) => {
                    return p.checked;
                  })
                  .map<{ text: string; dot: '' }>((p) => {
                    return {
                      text: p.fullInfo.policyName,
                      dot: '',
                    };
                  }),
              ]
            } />
            {/*<div className={styles.policeTags}>*/}
            {/*  {*/}
            {/*    r.contracts*/}
            {/*      .filter((c) => {*/}
            {/*        return c.checked;*/}
            {/*      })*/}
            {/*      .map((c) => {*/}
            {/*        // console.log(c, 'cCCCCC89ulik');*/}
            {/*        return (<div key={c.id}>*/}
            {/*          <span>{c.name}</span>*/}
            {/*          <div style={{ width: 5 }} />*/}
            {/*          <label style={{*/}
            {/*            backgroundColor: c.status === 'terminal'*/}
            {/*              ? '#999' :*/}
            {/*              c.status === 'inactive'*/}
            {/*                ? '#E9A923' : '#42C28C',*/}
            {/*          }} />*/}
            {/*        </div>);*/}
            {/*      })*/}
            {/*  }*/}
            {/*  {*/}
            {/*    r.policies*/}
            {/*      .filter((p) => {*/}
            {/*        return p.checked;*/}
            {/*      })*/}
            {/*      .map((p) => {*/}
            {/*        return (<div key={p.fullInfo.policyId}>{p.fullInfo.policyName}</div>);*/}
            {/*      })*/}
            {/*  }*/}
            {/*</div>*/}
          </div>);
        })
    }
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Resources);
