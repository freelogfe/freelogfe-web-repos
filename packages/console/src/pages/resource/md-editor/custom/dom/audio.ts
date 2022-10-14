/** 编辑器自定义元素-音频 */

import { IDomEditor } from '@wangeditor/editor';
import { h, VNode } from 'snabbdom';

const renderAudio = (
  elem: any,
  children: VNode[] | null,
  editor: IDomEditor,
): VNode => {
  const { fileName = '', link = '' } = elem;

  const source = h('source', {
    props: { src: link },
  });

  const audio = h(
    'audio',
    {
      props: { controls: true },
    },
    [
      source,
      "Sorry, your browser doesn't support embedded videos. 抱歉，浏览器不支持 audio 音频",
    ],
  );

  const audioNode = h(
    'div',
    {
      props: { contentEditable: false },
    },
    [audio, fileName],
  );

  return audioNode;
};

export const audioDomConfig = {
  type: 'audio',
  renderElem: renderAudio,
};
