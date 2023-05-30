import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
// import { useGetState } from '@/utils/hooks';
import FGraph_Tree_Relationship_Exhibit from '@/components/FAntvG6/FGraph_Tree_Relationship_Exhibit';
import fGraphTree_Relationship_Exhibit from '@/components/FAntvG6/fGraphTree_Relationship_Exhibit';
import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';
import fGraphTree_Authorization_Exhibit from '@/components/FAntvG6/fGraphTree_Authorization_Exhibit';
import FGraph_Tree_Dependency_Exhibit from '@/components/FAntvG6/FGraph_Tree_Dependency_Exhibit';
import fGraphTree_Dependency_Exhibit from '@/components/FAntvG6/fGraphTree_Dependency_Exhibit';
import * as AHooks from 'ahooks';

interface FViewportCards_Exhibit_Props {
  graphShow: Array<'relationship' | 'authorization' | 'dependency'>;
  exhibitID: string;
  version: string;

  onMount?({ hasData }: { hasData: boolean }): void;
}

function FViewportCards_Exhibit({
                                  graphShow,
                                  exhibitID,
                                  version,
                                  onMount,
                                }: FViewportCards_Exhibit_Props) {

  const [show, set_show, get_show] = AHooks.useGetState<Array<'relationship' | 'authorization' | 'dependency'>>(graphShow);

  const [showRelationship, set_showRelationship] = React.useState<boolean>(true);
  const [showAuthorization, set_showAuthorization] = React.useState<boolean>(true);
  const [showDependency, set_showDependency] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (get_show().length === 0) {
      onMount && onMount({ hasData: false });
    }
  }, [show]);

  return (<div className={styles.ViewportCards}>
    {
      show.includes('relationship') && (
        <div className={styles.ViewportCard} style={{ display: showRelationship ? 'block' : 'none' }}>
          <div className={styles.Viewport}>
            <FGraph_Tree_Relationship_Exhibit
              exhibitID={exhibitID}
              version={version}
              width={270}
              height={180}
              fit={true}
              onMount={({ hasData }) => {
                set_showRelationship(hasData);
                if (!hasData) {
                  set_show(get_show().filter((s) => {
                    return s !== 'relationship';
                  }));
                }
              }}
            />
          </div>

          <div className={styles.ViewportCardBottom}>
            <FComponentsLib.FContentText text={'关系树'} type={'normal'} />
          </div>

          <div className={styles.ViewportCardMask}>
            <a
              onClick={async () => {
                await fGraphTree_Relationship_Exhibit({
                  exhibitID: exhibitID,
                  version: version,
                });
              }}
            >点击全屏查看</a>
          </div>
        </div>)
    }

    {
      graphShow.includes('authorization') && (
        <div className={styles.ViewportCard} style={{ display: showAuthorization ? 'block' : 'none' }}>
          <div className={styles.Viewport}>
            <FGraph_Tree_Authorization_Exhibit
              exhibitID={exhibitID}
              version={version}
              width={270}
              height={180}
              fit={true}
              onMount={({ hasData }) => {
                set_showAuthorization(hasData);
                if (!hasData) {
                  set_show(get_show().filter((s) => {
                    return s !== 'authorization';
                  }));
                }
              }}
            />
          </div>

          <div className={styles.ViewportCardBottom}>
            <FComponentsLib.FContentText text={'授权树'} type={'normal'} />
          </div>

          <div className={styles.ViewportCardMask}>
            <a
              onClick={async () => {
                await fGraphTree_Authorization_Exhibit({
                  exhibitID: exhibitID,
                  version: version,
                });
              }}
            >点击全屏查看</a>
          </div>
        </div>)
    }

    {
      graphShow.includes('dependency') && (
        <div className={styles.ViewportCard} style={{ display: showDependency ? 'block' : 'none' }}>
          <div className={styles.Viewport}>
            <FGraph_Tree_Dependency_Exhibit
              exhibitID={exhibitID}
              version={version}
              width={270}
              height={180}
              fit={true}
              onMount={({ hasData }) => {
                set_showDependency(hasData);
                if (!hasData) {
                  set_show(get_show().filter((s) => {
                    return s !== 'dependency';
                  }));
                }
              }}
            />
          </div>

          <div className={styles.ViewportCardBottom}>
            <FComponentsLib.FContentText text={'依赖树'} type={'normal'} />
          </div>

          <div className={styles.ViewportCardMask}>
            <a
              onClick={async () => {
                await fGraphTree_Dependency_Exhibit({
                  exhibitID: exhibitID,
                  version: version,
                });
              }}
            >点击全屏查看</a>
          </div>
        </div>)
    }
  </div>);
}

export default FViewportCards_Exhibit;
