import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import img_markdown from '@/assets/cartoon-editor-icons.png';
import FComponentsLib from '@freelog/components-lib';

interface CartoonEditorProps {
  onClickBtn?(): void;
}

function CartoonEditor({ onClickBtn }: CartoonEditorProps) {
  return (<div className={styles.cartoonEditor}>
    <img
      src={img_markdown}
      alt={''}
      style={{ width: 190, height: 20 }}
    />
    <div style={{ height: 40 }} />
    <FComponentsLib.FContentText text={'Online Comic Formatter'} type={'highlight'} />
    <div style={{ height: 10 }} />
    <FComponentsLib.FContentText text={'在线上传、排版、一键切图，快速发布漫画'} type={'additional2'} />
    <div style={{ height: 40 }} />
    <FComponentsLib.FRectBtn
      type={'primary'}
      onClick={() => {
        onClickBtn && onClickBtn();
      }}
    >立即体验</FComponentsLib.FRectBtn>
  </div>);
}

export default CartoonEditor;
