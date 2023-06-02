/** 预览组件 */

import './index.less';
import { FI18n } from '@freelog/tools-lib';
import { useContext, useEffect, useRef, useState } from 'react';
import { comicToolContext } from '../..';
import { ImgInComicTool } from '../../utils/interface';
import LeftToRight from '../../images/left-to-right.png';
import RightToLeft from '../../images/right-to-left.png';
import { Timeout } from 'ahooks/lib/useRequest/src/types';

type modeType = 'paging' | 'scroll' | 'single' | 'double' | 'normal' | 'manga';

export const PreviewBox = (props: { show: boolean; close: () => void }) => {
  const { show, close } = props;
  const { imgList } = useContext(comicToolContext);

  const tipTimer = useRef<Timeout | null>(null);
  const pagePointList = useRef<number[]>([]);

  const [previewList, setPreviewList] = useState<ImgInComicTool[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState(1);
  const [mode, setMode] = useState(['paging', 'single', 'normal']);
  const [modeMenuShow, setModeMenuShow] = useState(false);
  const [directionTipShow, setDirectionTipShow] = useState(false);

  /** 阅读模式菜单 */
  const modeMenu: {
    title: string;
    btns: { label: string; value: modeType }[];
  }[] = [
    {
      title: FI18n.i18nNext.t('cbformatter_preview_readingmode'),
      btns: [
        {
          label: FI18n.i18nNext.t('cbformatter_preview_readingmode_flipping'),
          value: 'paging',
        },
        {
          label: FI18n.i18nNext.t('cbformatter_preview_readingmode_scrolling'),
          value: 'scroll',
        },
      ],
    },
    {
      title: FI18n.i18nNext.t('cbformatter_preview_pagestyle'),
      btns: [
        {
          label: FI18n.i18nNext.t('cbformatter_preview_pagestyle_single'),
          value: 'single',
        },
        {
          label: FI18n.i18nNext.t('cbformatter_preview_pagestyle_double'),
          value: 'double',
        },
      ],
    },
    {
      title: FI18n.i18nNext.t('cbformatter_preview_fliptype'),
      btns: [
        {
          label: FI18n.i18nNext.t('cbformatter_preview_fliptype_normal'),
          value: 'normal',
        },
        {
          label: FI18n.i18nNext.t('cbformatter_preview_fliptype_manga'),
          value: 'manga',
        },
      ],
    },
  ];

  /** 输入跳转页数 */
  const changeJumpPage = (value: string) => {
    let jumpNumber = Number(value.replace(/[^0-9]/g, '')) || 0;
    if (jumpNumber < 1) {
      jumpNumber = 1;
    } else if (jumpNumber > previewList.length) {
      jumpNumber = previewList.length;
    }
    setJumpPage(jumpNumber);
  };

  /** 切换阅读模式 */
  const changeMode = (value: modeType, index: number) => {
    if (mode.includes(value)) return;

    mode[index] = value;
    setMode([...mode]);

    localStorage.setItem('comicReadMode', JSON.stringify(mode));

    if (value === 'scroll') {
      getPointInScroll();
    } else if (index === 2) {
      showDirectionTip();
    }
  };

  /** 显示翻页方向提示 */
  const showDirectionTip = () => {
    if (tipTimer.current) {
      clearTimeout(tipTimer.current);
      setDirectionTipShow(false);
    }

    setTimeout(() => {
      setDirectionTipShow(true);
      tipTimer.current = setTimeout(() => {
        setDirectionTipShow(false);
        tipTimer.current = null;
      }, 1600);
    }, 50);
  };

  /** 上一页 */
  const prePage = () => {
    const [, type, direction] = mode;
    const offset = type === 'single' ? 1 : 2;
    const page =
      direction === 'normal' ? currentPage - offset : currentPage + offset;
    setCurrentPage(page);
    setJumpPage(page);
  };

  /** 下一页 */
  const nextPage = () => {
    const [, type, direction] = mode;
    const offset = type === 'single' ? 1 : 2;
    const page =
      direction === 'normal' ? currentPage + offset : currentPage - offset;
    setCurrentPage(page);
    setJumpPage(page);
  };

  /** 跳转 */
  const jump = () => {
    setCurrentPage(jumpPage);
    if (mode[0] === 'scroll') {
      const scrollArea = document.getElementById('scrollArea');
      scrollArea?.scrollTo({ top: pagePointList.current[jumpPage - 1] });
    }
  };

  /** 滚动模式下获取每页的位置 */
  const getPointInScroll = () => {
    setTimeout(() => {
      pagePointList.current = [];
      const elems = document.getElementsByClassName('scroll-img');
      [...elems].forEach((item: any) => {
        pagePointList.current.push(item.offsetTop);
      });
      jump();
    }, 0);
  };

  /** 滚动页面 */
  const scrollPage = (e: any) => {
    const scrollArea = document.getElementById('scrollArea');
    const height = scrollArea?.clientHeight || 0;
    const offset = height * 0.3;
    let page = 1;
    const { scrollTop } = e.target;
    for (let i = 0; i < pagePointList.current.length; i++) {
      if (scrollTop + offset >= pagePointList.current[i]) {
        page = i + 1;
      } else {
        break;
      }
    }
    if (page !== currentPage) {
      setCurrentPage(page);
      setJumpPage(page);
    }
  };

  useEffect(() => {
    return () => {
      if (tipTimer.current) {
        clearTimeout(tipTimer.current);
        setDirectionTipShow(false);
      }

      setCurrentPage(1);
      setJumpPage(1);
      setModeMenuShow(false);

      const comicReadMode = localStorage.getItem('comicReadMode');
      if (comicReadMode) setMode(JSON.parse(comicReadMode));
    };
  }, [show]);

  useEffect(() => {
    if (imgList.length === 0) {
      setPreviewList([]);
      return;
    }

    const list: ImgInComicTool[] = [];
    imgList.forEach((item: ImgInComicTool) => {
      list.push(...(item.children ? item.children : [item]));
    });
    setPreviewList(list);
  }, [imgList]);

  return show ? (
    <div className="preview-box-wrapper">
      {mode[0] === 'paging' ? (
        <div className="content-paging-area">
          {mode[1] === 'double' &&
            mode[2] === 'manga' &&
            previewList[currentPage] && (
              <img
                className="content-img"
                src={previewList[currentPage].base64}
                loading="lazy"
              />
            )}
          <img
            className="content-img"
            src={previewList[currentPage - 1].base64}
            loading="lazy"
          />
          {mode[1] === 'double' &&
            mode[2] === 'normal' &&
            previewList[currentPage] && (
              <img
                className="content-img"
                src={previewList[currentPage].base64}
                loading="lazy"
              />
            )}

          {((currentPage !== 1 && mode[2] === 'normal') ||
            (currentPage <
              previewList.length - (mode[1] === 'single' ? 0 : 1) &&
              mode[2] === 'manga')) && (
            <div className="pre-btn" onClick={prePage}></div>
          )}
          {((currentPage <
            previewList.length - (mode[1] === 'single' ? 0 : 1) &&
            mode[2] === 'normal') ||
            (currentPage !== 1 && mode[2] === 'manga')) && (
            <div className="next-btn" onClick={nextPage}></div>
          )}
        </div>
      ) : (
        <div
          id="scrollArea"
          className="content-scroll-area"
          onScroll={(e) => scrollPage(e)}
        >
          {previewList.map((img: ImgInComicTool, index: number) => (
            <img
              className="scroll-img"
              src={img.base64}
              loading="lazy"
              key={img.name + index}
            />
          ))}
        </div>
      )}

      <div className="footer">
        <div className="pager">
          {FI18n.i18nNext.t('cbformatter_preview_currentpage')}
          <span className="page-number">{currentPage}</span>
          {mode[0] === 'paging' &&
            mode[1] === 'double' &&
            currentPage + 1 <= previewList.length && (
              <span className="page-number">{currentPage + 1}</span>
            )}
        </div>
        <div className="jumper">
          <input
            className="page-number"
            value={jumpPage}
            onChange={(e) => changeJumpPage(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && jump()}
          />
          <div className="page-total">/ {previewList.length}</div>
          <div className="jump-btn" onClick={jump}>
            {FI18n.i18nNext.t('cbformatter_preview_pagenation_jumpto')}
          </div>
        </div>
        <div className="btn-box">
          <div
            className="mode-btn"
            onClick={() => setModeMenuShow(!modeMenuShow)}
          >
            <i className="freelog fl-icon-shujia1" />
            {FI18n.i18nNext.t('cbformatter_preview_changemode')}
          </div>
          <div className="exit-btn" onClick={close}>
            {FI18n.i18nNext.t('cbformatter_preview_quit')}
          </div>
        </div>

        {modeMenuShow && (
          <div className="mode-menu">
            {(mode[0] === 'paging' ? modeMenu : [modeMenu[0]]).map(
              (group, index) => (
                <div className="group" key={group.title}>
                  <div className="title">{group.title}</div>
                  <div className="btns">
                    {group.btns.map((btn) => (
                      <div
                        className={`btn ${
                          mode.includes(btn.value) && 'active'
                        }`}
                        onClick={() => changeMode(btn.value, index)}
                        key={btn.value}
                      >
                        {btn.label}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {directionTipShow && (
        <div className="paging-tip">
          <img
            className="img"
            src={mode[2] === 'normal' ? LeftToRight : RightToLeft}
          />
          <div className="desc">
            {FI18n.i18nNext.t('cbformatter_preview_fliptype_current')}
          </div>
          <div className="direction">
            {FI18n.i18nNext.t(
              mode[2] === 'normal'
                ? 'cbformatter_preview_normal_msg'
                : 'cbformatter_preview_manga_msg',
            )}
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};
