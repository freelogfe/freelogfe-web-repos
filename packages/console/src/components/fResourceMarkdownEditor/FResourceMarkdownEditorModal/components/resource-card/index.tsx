/** 资源卡片组件 */

import FCoverImage from '@/components/FCoverImage';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { useContext } from 'react';
import { editorContext } from '../..';
import { defaultCover } from '../../core/assets';
import { ResourceInEditor } from '../../core/interface';
import { insertResource } from '../../custom/dom/resource/utils';
import './index.less';

interface Props {
  data: ResourceInEditor;
}

export const ResourceCard = (props: Props) => {
  const { editor } = useContext(editorContext);
  const { data } = props;
  const {
    resourceId,
    coverImages,
    resourceName,
    resourceType,
    latestVersion,
    policies,
  } = data;
  const onlinePolicies = policies.filter(
    (item: { status: number }) => item.status === 1,
  );

  /** 插入资源 */
  const insert = () => {
    insertResource(data, editor);
    editor.setDrawerType('');
  };

  return (
    <div
      className="resource-card-wrapper"
      key={resourceId}
      onClick={() => {
        insert();
      }}
    >
      <FCoverImage
        src={coverImages[0] || defaultCover}
        width={280}
        style={{ borderRadius: 4 }}
      />
      <div className="name">{resourceName}</div>
      <div className="info">
        <div>{FUtil.Format.resourceTypeKeyArrToResourceType(resourceType)}</div>
        <div>{FI18n.i18nNext.t('latest_version') + ' ' + latestVersion}</div>
      </div>
      {onlinePolicies.length ? (
        <div className="policy-tags">
          {onlinePolicies.map(
            (policy: { policyName: string; policyId: string }) => (
              <div className="tag" key={policy.policyId}>
                {policy.policyName}
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="no-policy">
          {FI18n.i18nNext.t('msg_no_authplan_active')}
        </div>
      )}
    </div>
  );
};
