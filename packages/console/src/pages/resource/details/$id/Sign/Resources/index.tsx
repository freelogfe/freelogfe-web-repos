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
        sign_SignResources: resourceDetailPage.sign_SignResources.map((sr) => ({
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
      resourceDetailPage.sign_SignResources
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
              text={FUtil.Format.resourceTypeKeyArrToResourceType(r.type)}
            />
            <div style={{ height: 5 }} />
            <FComponentsLib.F_Contract_And_Policy_Labels
              data={
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
              }
            />
          </div>);
        })
    }

    {
      resourceDetailPage.sign_SignResources.length > 1 && (<div className={styles.signLeftNav}>选择基础上抛授权策略</div>)
    }

    {
      resourceDetailPage.sign_SignResources
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
              text={FUtil.Format.resourceTypeKeyArrToResourceType(r.type)}
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
          </div>);
        })
    }
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Resources);
