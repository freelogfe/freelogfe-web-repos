/** 资源卡片组件 */

import FCoverImage from '@/components/FCoverImage';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { useContext } from 'react';
import { editorContext } from '../..';
import { defaultCover } from '../../core/assets';
import { CustomResource } from '../../core/interface';
import { insertResource } from '../../custom/dom/resource/utils';
import './index.less';

interface Props {
  data: CustomResource;
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

  return (
    <div
      className="resource-card-wrapper"
      key={resourceId}
      onClick={() => {
        // TODO authType 目前写死
        insertResource({ ...data, authType: 4 }, editor);
        editor.setDrawerType('');
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
        <div>
          {latestVersion
            ? FI18n.i18nNext.t('latest_version') + ' ' + latestVersion
            : '暂无版本'}
        </div>
      </div>
      {onlinePolicies.length ? (
        <div className="policy-tags">
          {onlinePolicies.map(
            (policy: { policyName: string; policyId: string }) => (
              <div className="tag" key={policy.policyId}>
                {policy.policyId}
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="no-policy">暂无策略…</div>
      )}
    </div>
  );
};
