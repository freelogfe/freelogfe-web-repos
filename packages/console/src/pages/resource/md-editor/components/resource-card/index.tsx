/** 资源卡片组件 */

import FCoverImage from '@/components/FCoverImage';
import { FI18n, FUtil } from '@freelog/tools-lib';
import './index.less';

interface Props {
  data: any;
  editor: any;
}

export const ResourceCard = (props: Props) => {
  const { data, editor } = props;
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
  const defaultCover = `${FUtil.Format.completeUrlByDomain(
    'static',
  )}/static/default_cover.png`;

  return (
    <div
      className="resource-card-wrapper"
      key={resourceId}
      onClick={() => {
        editor.insertNode({
          ...data,
          type: 'resource',
          children: [{ text: '' }],
          isAuth: true,
        });
        editor.insertBreak();
        editor.setDrawerType('');
      }}
    >
      <FCoverImage
        src={coverImages[0] || defaultCover}
        width={280}
        style={{ borderRadius: 4 }}
      />
      <div className="name">111{resourceName}</div>
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
