/** 编辑器自定义元素-资源 */

import { h, VNode } from 'snabbdom';
import { IDomEditor, SlateElement } from '@wangeditor/editor';
import { CustomResource } from '../../../core/interface';
import { ImageResource } from '../image';
import { VideoResource } from '../video';
import { AudioResource } from '../audio';
import { DocumentResource } from '../document';

/** 渲染资源元素 */
const renderResource = (
  data: CustomResource,
  children: VNode[] | null,
  editor: IDomEditor,
): VNode => {
  const resourseFirstType = data.resourceType[0];
  if (resourseFirstType === '图片') {
    return ImageResource(data, editor);
  } else if (resourseFirstType === '视频') {
    return VideoResource(data, editor);
  } else if (resourseFirstType === '音频') {
    return AudioResource(data, editor);
  } else if (resourseFirstType === '阅读') {
    return DocumentResource(data, editor);
  }
  return h('div');
};

/** 将资源元素转为 HTML */
const resourceToHtml = (data: CustomResource): string => {
  const html = `<span
  data-w-e-type="resource"
  data-w-e-is-void
  data-w-e-is-inline
  data-originType="${data.originType}"
  data-resourceId="${data.resourceId}"
  data-authType="${data.authType}"
  data-resourceName="${data.resourceName}"
  data-coverImages="${JSON.stringify(data.coverImages)}"
  data-resourceType="${JSON.stringify(data.resourceType)}"
  data-latestVersion="${data.latestVersion}"
  data-version="${data.version || data.latestVersion}"
  data-content="${data.content}"
>
  此资源来自于 freelog
</span>`;

  return html;
};

/** 将 HTML 渲染为 DOM */
const htmlToResource = (domElem: Element): SlateElement => {
  const originType = domElem.getAttribute('data-originType') || '';
  const resourceId = domElem.getAttribute('data-resourceId') || '';
  const authType = domElem.getAttribute('data-authType') || '';
  const resourceName = domElem.getAttribute('data-resourceName') || '';
  const coverImages = domElem.getAttribute('data-coverImages') || '[]';
  const resourceType = domElem.getAttribute('data-resourceType') || '[]';
  const latestVersion = domElem.getAttribute('data-latestVersion') || '';
  const version = domElem.getAttribute('data-version') || '';
  const content = domElem.getAttribute('data-content') || '';

  const data = {
    originType: Number(originType),
    resourceId,
    authType: Number(authType),
    resourceName,
    coverImages: JSON.parse(coverImages),
    resourceType: JSON.parse(resourceType),
    latestVersion,
    version,
    content,
    type: 'resource',
    children: [{ text: '' }],
  };

  return data;
};

export const renderResourceConfig = {
  type: 'resource',
  renderElem: renderResource as any,
};

export const resourceToHtmlConfig = {
  type: 'resource',
  elemToHtml: resourceToHtml as any,
};

export const htmlToResourceConfig = {
  selector: 'span[data-w-e-type="resource"]',
  parseElemHtml: htmlToResource,
};
