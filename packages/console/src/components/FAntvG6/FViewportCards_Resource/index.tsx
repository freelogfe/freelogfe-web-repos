import * as React from 'react';
import styles from './index.less';
import FGraph_Tree_Relationship_Resource from '@/components/FAntvG6/FGraph_Tree_Relationship_Resource';
// import { ChangeAction } from '@/models/resourceVersionEditorPage';
import FComponentsLib from '@freelog/components-lib';
import fGraphTree_Relationship_Resource from '@/components/FAntvG6/fGraphTree_Relationship_Resource';
import FGraph_Tree_Authorization_Resource from '@/components/FAntvG6/FGraph_Tree_Authorization_Resource';
import fGraphTree_Authorization_Resource from '@/components/FAntvG6/fGraphTree_Authorization_Resource';
import FGraph_Tree_Dependency_Resource from '@/components/FAntvG6/FGraph_Tree_Dependency_Resource';
import fGraphTree_Dependency_Resource from '@/components/FAntvG6/fGraphTree_Dependency_Resource';

interface FViewportCards_Resource_Props {
  graphShow: Array<'relationship' | 'authorization' | 'dependency'>;
  resourceID: string;
  version: string;

  onMount?({ hasData }: { hasData: boolean }): void;
}

function FViewportCards_Resource({
                                   graphShow,
                                   resourceID,
                                   version,
                                   onMount,
                                 }: FViewportCards_Resource_Props) {

  const refArr = React.useRef<boolean[]>([]);

  return (<div className={styles.ViewportCards}>
    {
      graphShow.includes('relationship') && (<div className={styles.ViewportCard}>
        <div className={styles.Viewport}>
          <FGraph_Tree_Relationship_Resource
            resourceID={resourceID}
            version={version}
            width={270}
            height={180}
            fit={true}
            onMount={async ({ hasData }) => {
              refArr.current.push(hasData);
              if (refArr.current.length === graphShow.length) {
                onMount && onMount({ hasData: refArr.current.includes(true) });
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
              await fGraphTree_Relationship_Resource({
                resourceID: resourceID,
                version: version,
              });
            }}
          >点击全屏查看</a>
        </div>
      </div>)
    }

    {
      graphShow.includes('authorization') && (<div className={styles.ViewportCard}>
        <div className={styles.Viewport}>
          <FGraph_Tree_Authorization_Resource
            resourceID={resourceID}
            version={version}
            width={270}
            height={180}
            fit={true}
            onMount={async ({ hasData }) => {
              refArr.current.push(hasData);
              if (refArr.current.length === graphShow.length) {
                onMount && onMount({ hasData: refArr.current.includes(true) });
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
              await fGraphTree_Authorization_Resource({
                resourceID: resourceID,
                version: version,
              });
            }}
          >点击全屏查看</a>
        </div>
      </div>)
    }

    {
      graphShow.includes('dependency') && (<div className={styles.ViewportCard}>
        <div className={styles.Viewport}>
          <FGraph_Tree_Dependency_Resource
            resourceID={resourceID}
            version={version}
            width={270}
            height={180}
            fit={true}
            onMount={async ({ hasData }) => {
              refArr.current.push(hasData);
              if (refArr.current.length === graphShow.length) {
                onMount && onMount({ hasData: refArr.current.includes(true) });
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
              await fGraphTree_Dependency_Resource({
                resourceID: resourceID,
                version: version,
              });
            }}
          >点击全屏查看</a>
        </div>
      </div>)
    }
  </div>);
}

export default FViewportCards_Resource;
