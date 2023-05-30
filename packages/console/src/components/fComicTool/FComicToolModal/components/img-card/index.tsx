/** 图片组件 */

import './index.less';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { Popconfirm, Progress, Tooltip } from 'antd';
import { useContext } from 'react';
import { comicToolContext } from '../..';
import { ImgInComicTool } from '../../core/interface';
import { MAX_IMG_SIZE } from '../../core/assets';

interface Props {
  index: number;
  data: ImgInComicTool;
}

export const ImgCard = (props: Props) => {
  const { imgList, setImgList } = useContext(comicToolContext);
  const { index, data } = props;

  /** 删除图片 */
  const deleteImg = (index: number) => {
    const list = [...imgList];
    list.splice(index, 1);
    console.error(list);
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

  /** 换算图片大小 */
  const conversionSize = (size: number) => {
    if (size < 1024) return `${size}B`;

    if (size >= 1024 * 1024) {
      return `${Math.floor((size / 1024 / 1024) * 100) / 100}MB`;
    } else {
      return `${Math.floor((size / 1024) * 100) / 100}KB`;
    }
  };

  return (
    <div className="img-card-wrapper">
      <div className="card-main">
        <div
          className={`card-header ${data.size > MAX_IMG_SIZE && 'oversize'}`}
        >
          <div className="order">{index + 1}</div>
          <div className="size">{conversionSize(data.size)}</div>
          <i className="freelog fl-icon-tuodong dragger" />
          <div className="drag-tip">{FI18n.i18nNext.t('按住可拖拽排序')}</div>
        </div>
        <div className="card-body">
          {data.size <= MAX_IMG_SIZE ? (
            <img className="img" src={data.base64} />
          ) : (
            <div className="oversize-box">
              <img className="oversize-img" src={data.base64} />
              <div className="oversize-tip">
                {FI18n.i18nNext.t('单张图片不超过20MB')}
              </div>
            </div>
          )}

          <div className="cut-mark">
            <i className="freelog fl-icon-jiandao" />
            {FI18n.i18nNext.t('已切图')}
          </div>
          <div className="operate-btns">
            <div className="btn">
              <i className="freelog fl-icon-jiandao" />
              <div className="btn-name">{FI18n.i18nNext.t('切图')}</div>
            </div>
            {/* <div className="btn">
            <i className="freelog fl-icon-jiandao" />
            <div className="btn-name">
              {FI18n.i18nNext.t('查看切图详情')}
            </div>
          </div> */}
            <div className="btn" onClick={() => deleteImg(index)}>
              <i className="freelog fl-icon-shanchu" />
              <div className="btn-name">{FI18n.i18nNext.t('删除')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="name">{formatName(data.name)}</div>
      <div className="insert-btn pre">
        <i className="freelog fl-icon-tianjia" />
        <div className="insert-tip">{FI18n.i18nNext.t('向左侧插入图片')}</div>
      </div>
      <div className="insert-btn next">
        <i className="freelog fl-icon-tianjia" />
        <div className="insert-tip">{FI18n.i18nNext.t('向右侧插入图片')}</div>
      </div>
    </div>
  );
};
