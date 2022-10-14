/** 编辑器自定义元素-视频 */

import { IDomEditor } from '@wangeditor/editor';
import { h, VNode } from 'snabbdom';

const renderVideo = (
  elem: any,
  children: VNode[] | null,
  editor: IDomEditor,
): VNode => {
  const { fileName = '', link = '' } = elem;

  const source = h('source', {
    props: { src: link },
  });

  const video = h(
    'video',
    {
      props: { poster: true, controls: true },
    },
    [
      source,
      "Sorry, your browser doesn't support embedded videos. 抱歉，浏览器不支持 video 视频",
    ],
  );

  const videoNode = h(
    'div',
    {
      props: { contentEditable: false },
      //   on: {
      //     click() {
      //       window.open(link);
      //     },
      //   },
    },
    [video, fileName],
  );

  return videoNode;
};

export const videoDomConfig = {
  type: 'video',
  renderElem: renderVideo,
};
