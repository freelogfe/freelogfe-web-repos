/** 图片组件 */

import './index.less';
import { FI18n } from '@freelog/tools-lib';
import { useContext, useState } from 'react';
import { comicToolContext } from '../..';
import { ImgInComicTool } from '../../utils/interface';
import { MAX_IMG_SIZE } from '../../utils/assets';
import { CutDrawer } from '../cut-drawer';
import { conversionSize, formatCardName, getExt } from '../../utils/common';
import OversizeImg from '../../images/oversize.png';
import { Skeleton } from 'antd';

interface Props {
  index: number;
  data: ImgInComicTool;
  visible: boolean;
  setInsertIndex: (index: number) => void;
  cutImage: (item: ImgInComicTool) => void;
}

export const ImgCard = (props: Props) => {
  const { comicMode, setDeleteItem, setDeleteConfirmShow, dragging } =
    useContext(comicToolContext);
  const { index, data, visible, setInsertIndex, cutImage } = props;

  const [cutDrawerShow, setCutDrawerShow] = useState(false);

  /** 删除图片 */
  const deleteImg = () => {
    setDeleteItem({ ...data, index });
    setDeleteConfirmShow(true);
  };

  /** 插入图片 */
  const insert = (i: number) => {
    setInsertIndex(i);
    document.getElementById('uploadLocalImg')?.click();
  };

  return (
    <div className={`img-card-wrapper ${dragging && 'dragging'}`}>
      {visible ? (
        <>
          <div className="card-main">
            {/* 主体区域 */}
            <div
              className={`main-body ${
                data.size <= MAX_IMG_SIZE ? 'drag-handle' : 'no-drag'
              }`}
            >
              {/* 卡片头部 */}
              <div
                className={`card-header ${
                  data.size > MAX_IMG_SIZE && 'oversize'
                }`}
              >
                <div className="order">{index + 1}</div>
                <div className="header-center">
                  {data.children && data.size < MAX_IMG_SIZE
                    ? FI18n.i18nNext.t('cbformatter_slice_qty', {
                        imageQty: data.children.length,
                      })
                    : conversionSize(data.size)}
                </div>
              </div>
              {/* 卡片身体（图片区域） */}
              <div className="card-body">
                {data.size <= MAX_IMG_SIZE ? (
                  data.base64 ? (
                    data.children ? (
                      <>
                        <div className="cut-img" />
                        <div className="cut-img" />
                        <div className="cut-img" />
                        <img className="cut-img" src={data.base64} />
                      </>
                    ) : (
                      <img className="img" src={data.base64} />
                    )
                  ) : (
                    <Skeleton.Image className="skeleton-image" active={true} />
                  )
                ) : (
                  <div className="oversize-box">
                    <img className="oversize-img" src={OversizeImg} />
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
              </div>
            </div>

            {/* 拖拽提示 */}
            <div className="drag-tip">
              {FI18n.i18nNext.t('cbformatter_dragtoreorder_tooltips')}
            </div>

            {/* 插入按钮 */}
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

            {/* 底部操作按钮 */}
            <div className="operate-btns">
              {comicMode === 1 &&
                ['png', 'jpg', 'jpeg'].includes(getExt(data.name)) && (
                  <>
                    {data.size < MAX_IMG_SIZE &&
                      (!data.children ? (
                        <div
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            cutImage(data);
                          }}
                        >
                          <i className="freelog fl-icon-jiandao" />
                          <div className="btn-name">
                            {FI18n.i18nNext.t('cbformatter_slice_btn')}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="btn"
                          onClick={() => setCutDrawerShow(true)}
                        >
                          <i className="freelog fl-icon-jiandao" />
                          <div className="btn-name">
                            {FI18n.i18nNext.t('cbformatter_slice_preview')}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              <div className="btn" onClick={() => deleteImg()}>
                <i className="freelog fl-icon-shanchu" />
                <div className="btn-name">
                  {FI18n.i18nNext.t('cbformatter_delete_btn')}
                </div>
              </div>
            </div>
          </div>

          {/* 图片名称 */}
          <div className="name">{formatCardName(data.name)}</div>

          <CutDrawer
            show={cutDrawerShow}
            close={() => setCutDrawerShow(false)}
            data={data.children || []}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
