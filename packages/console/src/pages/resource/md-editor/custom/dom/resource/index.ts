/** 编辑器自定义元素-资源 */

import './index.less';
import { IDomEditor } from '@wangeditor/editor';
import { h, VNode, VNodeChildElement } from 'snabbdom';

const renderResource = (
  data: any,
  children: VNode[] | null,
  editor: IDomEditor,
): VNode => {
  const { resourceName, resourceType, version, policy, auth, coverImages } =
    data;

  const coverDom = h('img.cover', {
    props: { src: coverImages[0] },
  });

  const nameDom = h('div.name', {}, [resourceName]);

  const infoDom = h('div.info', {}, [resourceType, version]);

  const tagsDom = h('div.tags-wrapper', {}, [
    ...policy.map((policy: string) => h('div.tag', {}, [policy])),
  ]);

  const leftAreaDom = h(
    'div.left-area',
    {
      on: {
        click() {
          console.error(data);
        },
      },
    },
    [coverDom, nameDom, infoDom, tagsDom],
  );

  const node = h(
    'div.resource-wrapper',
    {
      props: { contentEditable: false },
    },
    [leftAreaDom],
  );

  return node;
};

export const resourceDomConfig = {
  type: 'resource',
  renderElem: renderResource,
};
