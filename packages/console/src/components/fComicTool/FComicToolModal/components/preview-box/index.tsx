/** 预览组件 */

import './index.less';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { Popconfirm, Progress, Tooltip } from 'antd';
import { useContext, useState } from 'react';
import { comicToolContext } from '../..';
import { ImgInComicTool } from '../../core/interface';
import { MAX_IMG_SIZE } from '../../core/assets';

export const PreviewBox = () => {
  const { imgList = [] } = useContext(comicToolContext);

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="preview-box-wrapper">
      <img className="img" src={imgList[currentIndex] || '1'} />

      <div className="footer">
        <div className="pager">
          当前页<span>11</span>
        </div>
        <div className="jumper">
          <input type="number" value={11} />
          /23 跳转
        </div>
        <div className="btn-box">
          <div className="read-mode-btn">阅读模式</div>
          <div className="exit-btn">退出预览</div>
        </div>
      </div>
    </div>
  );
};
