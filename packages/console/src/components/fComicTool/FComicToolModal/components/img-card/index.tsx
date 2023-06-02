/** 图片组件 */

import './index.less';
import { FI18n } from '@freelog/tools-lib';
import { useContext, useState } from 'react';
import { comicToolContext } from '../..';
import { ImgInComicTool } from '../../utils/interface';
import { MAX_IMG_SIZE } from '../../utils/assets';
import { CutDrawer } from '../cut-drawer';
import { conversionSize } from '../../utils/common';

interface Props {
  index: number;
  data: ImgInComicTool;
  setInsertIndex: (index: number) => void;
  cutImage: (item: ImgInComicTool) => void;
}

export const ImgCard = (props: Props) => {
  const { imgList, setImgList } = useContext(comicToolContext);
  const { index, data, setInsertIndex, cutImage } = props;

  const [cutDrawerShow, setCutDrawerShow] = useState(false);

  /** 删除图片 */
  const deleteImg = (index: number) => {
    const list = [...imgList];
    list.splice(index, 1);
    setImgList(list);
  };

  /** 格式化图片名称（超长时中间部分省略，并保证尾部显示不含后缀名至少四位字符） */
  const formatName = (name: string) => {
    const _div = document.createElement('div');
    _div.innerText = name;
    _div.style.fontSize = '12px';
    _div.style.position = 'absolute';
    document.body.appendChild(_div);
    if (_div.clientWidth < 200) {
      return name;
    } else {
      const [filename, suffix] = name.split('.');
      const lastWords = '...' + filename.slice(-4) + '.' + suffix;
      for (let i = 0; i < filename.length; i++) {
        const newName = filename.slice(0, i + 1) + lastWords;
        _div.innerText = newName;
        if (_div.clientWidth > 200) return filename.slice(0, i) + lastWords;
      }
    }
    document.body.removeChild(_div);
  };

  /** 插入图片 */
  const insert = (i: number) => {
    setInsertIndex(i);
    document.getElementById('uploadLocalImg')?.click();
  };

  return (
    <div className="img-card-wrapper">
      <div className="card-main">
        <div
          className={`card-header ${data.size > MAX_IMG_SIZE && 'oversize'}`}
        >
          <div className="order">{index + 1}</div>
          <div className="size">
            {data.children && data.size < MAX_IMG_SIZE
              ? FI18n.i18nNext.t('cbformatter_slice_qty', {
                  imageQty: data.children.length,
                })
              : conversionSize(data.size)}
          </div>
          <i className="freelog fl-icon-tuodong dragger" />
          <div className="drag-tip">
            {FI18n.i18nNext.t('cbformatter_dragtoreorder_tooltips')}
          </div>
        </div>
        <div className="card-body">
          {data.size <= MAX_IMG_SIZE ? (
            data.children ? (
              <>
                <div className="cut-img" />
                <div className="cut-img" />
                <div className="cut-img" />
                <img className="cut-img" src={data.base64} loading="lazy" />
              </>
            ) : (
              <img className="img" src={data.base64} loading="lazy" />
            )
          ) : (
            <div className="oversize-box">
              <img className="oversize-img" src={data.base64} loading="lazy" />
              <div className="oversize-tip">
                {FI18n.i18nNext.t(
                  data.children
                    ? 'cbformatter_err_filesize_sliced'
                    : 'cbformatter_err_filesize',
                )}
              </div>
            </div>
          )}

          {data.children && (
            <div className="cut-mark">
              <i className="freelog fl-icon-jiandao" />
              {FI18n.i18nNext.t('cbformatter_slice_state_done')}
            </div>
          )}
          <div className="operate-btns">
            {data.size < MAX_IMG_SIZE &&
              (!data.children ? (
                <div className="btn" onClick={() => cutImage(data)}>
                  <i className="freelog fl-icon-jiandao" />
                  <div className="btn-name">
                    {FI18n.i18nNext.t('cbformatter_slice_btn')}
                  </div>
                </div>
              ) : (
                <div className="btn" onClick={() => setCutDrawerShow(true)}>
                  <i className="freelog fl-icon-jiandao" />
                  <div className="btn-name">
                    {FI18n.i18nNext.t('cbformatter_slice_preview')}
                  </div>
                </div>
              ))}
            <div className="btn" onClick={() => deleteImg(index)}>
              <i className="freelog fl-icon-shanchu" />
              <div className="btn-name">
                {FI18n.i18nNext.t('cbformatter_delete_btn')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="name">{formatName(data.name)}</div>
      <div className="insert-btn pre" onClick={() => insert(index)}>
        <i className="freelog fl-icon-tianjia" />
        <div className="insert-tip">
          {FI18n.i18nNext.t('cbformatter_insert_tooltips')}
        </div>
      </div>
      <div className="insert-btn next" onClick={() => insert(index + 1)}>
        <i className="freelog fl-icon-tianjia" />
        <div className="insert-tip">
          {FI18n.i18nNext.t('cbformatter_insert_tooltips')}
        </div>
      </div>

      <CutDrawer
        show={cutDrawerShow}
        close={() => setCutDrawerShow(false)}
        data={data.children || []}
      />
    </div>
  );
};
