/** 预览组件 */

import './index.less';
import { FI18n } from '@freelog/tools-lib';
import { useContext, useEffect, useRef, useState } from 'react';
import { comicToolContext } from '../..';
import { ImgInComicTool } from '../../utils/interface';
import LeftToRight from '../../images/left-to-right.png';
import RightToLeft from '../../images/right-to-left.png';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { MAX_IMG_SIZE } from '../../utils/assets';

type modeType = 'paging' | 'scroll' | 'single' | 'double' | 'normal' | 'manga';

export const PreviewBox = (props: { show: boolean; close: () => void }) => {
  const { show, close } = props;
  const { comicMode, imgList } = useContext(comicToolContext);

  const tipTimer = useRef<Timeout | null>(null);
  const pagePointList = useRef<number[]>([]);

  const [previewList, setPreviewList] = useState<ImgInComicTool[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState<string | number>(1);
  const [amend, setAmend] = useState(false);
  const [mode, setMode] = useState(['', 'double', 'normal']);
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

  /** 切换阅读模式 */
  const changeMode = (value: modeType, index: number) => {
    if (mode.includes(value)) return;

    mode[index] = value;
    setMode([...mode]);

    if (mode[0] === 'paging') {
      // 页漫时，将选择的模式保存在本地
      localStorage.setItem('comicReadMode', JSON.stringify(mode));
    }

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

  /** 左侧切换页面 */
  const leftSwitchPage = () => {
    mode[2] === 'normal' ? pageForward() : pageBackward();
  };

  /** 右侧切换页面 */
  const rightSwitchPage = () => {
    mode[2] === 'normal' ? pageBackward() : pageForward();
  };

  /** 向前翻页 */
  const pageForward = () => {
    const pageType = mode[1];
    let offset = pageType === 'single' ? 1 : 2;
    if (!amend && pageType === 'double' && currentPage === 2) {
      // 非跨页匹配、双页模式、当前页为第二页时，仅向前一页
      offset = 1;
    }
    const page = currentPage - offset;
    setCurrentPage(page);
    setJumpPage(page);
  };

  /** 向后翻页 */
  const pageBackward = () => {
    const pageType = mode[1];
    let offset = pageType === 'single' ? 1 : 2;
    if (!amend && pageType === 'double' && currentPage === 1) {
      // 非跨页匹配、双页模式、当前页为第一页时，仅向后一页
      offset = 1;
    }
    const page = currentPage + offset;
    setCurrentPage(page);
    setJumpPage(page);
  };

  /** 更改跨页匹配 */
  const changeAmend = (value: boolean) => {
    let page;
    if (currentPage === 1) {
      page = 1;
    } else if (value) {
      page =
        currentPage === previewList.length ? currentPage - 1 : currentPage + 1;
    } else {
      page = currentPage - 1;
    }
    setCurrentPage(page);
    setJumpPage(page);
    setAmend(value);
  };

  /** 跳转 */
  const jump = () => {
    let jumpPageNum = Number(String(jumpPage).replace(/[^0-9]/g, ''));
    if (jumpPageNum < 1) {
      jumpPageNum = 1;
    } else if (jumpPageNum > previewList.length) {
      jumpPageNum = previewList.length;
    }
    let page = jumpPageNum;

    if (page === 1 && mode[0] === 'paging') {
      setCurrentPage(page);
      setJumpPage(page);
      return;
    }

    if (mode[0] === 'paging' && mode[1] === 'double') {
      // 翻页模式、双页模式下，需对跳转页码进行修正
      if (amend) {
        // 跨页匹配时，页码显示双页的奇数页码
        page = jumpPageNum % 2 ? jumpPageNum : jumpPageNum - 1;
      } else {
        // 非跨页匹配时，页码显示双页的偶数页码
        page = jumpPageNum % 2 ? jumpPageNum - 1 : jumpPageNum;
      }
    } else if (mode[0] === 'scroll') {
      const scrollArea = document.getElementById('scrollArea');
      scrollArea?.scrollTo({ top: pagePointList.current[page - 1] });
    }
    setCurrentPage(page);
    setJumpPage(page);
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
    if (show) {
      if (comicMode === 1) {
        // 条漫时，自动选择滚动模式
        getPointInScroll();
        setMode((pre) => {
          pre[0] = 'scroll';
          return [...pre];
        });
      } else if ([2, 3].includes(comicMode)) {
        // 页漫/日漫时，自动选择翻页模式（如本地有记录翻页模式的选择，优先取本地记录的模式）
        const comicReadMode = localStorage.getItem('comicReadMode');
        if (comicReadMode) {
          setMode(JSON.parse(comicReadMode));
        } else {
          setMode((pre) => {
            pre[0] = 'paging';
            return [...pre];
          });
        }
      }
    } else {
      if (tipTimer.current) {
        clearTimeout(tipTimer.current);
        setDirectionTipShow(false);
      }
      setCurrentPage(1);
      setJumpPage(1);
      setModeMenuShow(false);
    }
  }, [show]);

  useEffect(() => {
    if (imgList.length === 0) {
      setPreviewList([]);
      return;
    }

    const list: ImgInComicTool[] = [];
    imgList.forEach((item: ImgInComicTool) => {
      const { size, children } = item;
      if (size > MAX_IMG_SIZE) return;
      list.push(...(children ? children : [item]));
    });
    setPreviewList(list);
  }, [imgList]);

  return show ? (
    <div className="preview-box-wrapper">
      {mode[0] === 'paging' ? (
        <div className="content-paging-area">
          {/* 条漫/页漫、双页模式、非跨页匹配、当前为首页时，首页左侧显示空屏 */}
          {[1, 2].includes(comicMode) &&
            mode[1] === 'double' &&
            !amend &&
            currentPage === 1 && <div className="blank-screen"></div>}
          {/* 日漫、双页模式、页数不为1且当前为尾页/页数为1且跨页修正时，尾页左侧显示空屏 */}
          {comicMode === 3 &&
            mode[1] === 'double' &&
            ((previewList.length !== 1 && currentPage === previewList.length) ||
              (previewList.length === 1 && amend)) && (
              <div className="blank-screen"></div>
            )}
          {/* 日漫、双页模式、跨页匹配/非跨页匹配且当前不为首页、当前页不为尾页时，当前页左侧显示下一页 */}
          {comicMode === 3 &&
            mode[1] === 'double' &&
            (amend || (!amend && currentPage !== 1)) &&
            currentPage !== previewList.length && (
              <div className="content-image-box">
                <img
                  className="content-img"
                  src={previewList[currentPage].base64}
                />
              </div>
            )}
          {/* 当前页 */}
          <div className={`content-image-box ${mode[1]}`}>
            <img
              className="content-img"
              src={previewList[currentPage - 1].base64}
            />
          </div>
          {/* 条漫/页漫、双页模式、跨页匹配/非跨页匹配且当前不为首页、当前页不为尾页时，当前页右侧显示下一页 */}
          {[1, 2].includes(comicMode) &&
            mode[1] === 'double' &&
            (amend || (!amend && currentPage !== 1)) &&
            currentPage !== previewList.length && (
              <div className="content-image-box">
                <img
                  className="content-img"
                  src={previewList[currentPage].base64}
                />
              </div>
            )}
          {/* 条漫/页漫、双页模式、页数不为1且当前为尾页/页数为1且跨页修正时，尾页右侧显示空屏 */}
          {[1, 2].includes(comicMode) &&
            mode[1] === 'double' &&
            ((previewList.length !== 1 && currentPage === previewList.length) ||
              (previewList.length === 1 && amend)) && (
              <div className="blank-screen"></div>
            )}
          {/* 日漫、双页模式、非跨页匹配、当前为首页时，首页右侧显示空屏 */}
          {mode[1] === 'double' &&
            comicMode === 3 &&
            !amend &&
            currentPage === 1 && <div className="blank-screen"></div>}

          {/**
           * 普通模式下：
           *  - 当前页不是第一页
           * 日漫模式下：
           *  - 单页：当前页不是最后一页
           *  - 双页：
           *    - 非跨页修正、当前页为第一页、页数大于一页时
           *    - 当前页不为倒数第二页时
           */}
          {((mode[2] === 'normal' && currentPage !== 1) ||
            (mode[2] === 'manga' &&
              ((mode[1] === 'single' && currentPage < previewList.length) ||
                (mode[1] === 'double' &&
                  ((!amend && currentPage === 1 && previewList.length > 1) ||
                    currentPage + 1 < previewList.length))))) && (
            <div className="pre-btn" onClick={leftSwitchPage}></div>
          )}
          {/**
           * 日漫模式下：
           *  - 当前页不是第一页
           * 普通模式下：
           *  - 单页：当前页不是最后一页
           *  - 双页：
           *    - 非跨页修正、当前页为第一页、页数大于一页时
           *    - 当前页不为倒数第二页时
           */}
          {((mode[2] === 'manga' && currentPage !== 1) ||
            (mode[2] === 'normal' &&
              ((mode[1] === 'single' && currentPage < previewList.length) ||
                (mode[1] === 'double' &&
                  ((!amend && currentPage === 1 && previewList.length > 1) ||
                    currentPage + 1 < previewList.length))))) && (
            <div className="next-btn" onClick={rightSwitchPage}></div>
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
              key={img.name + index}
            />
          ))}
        </div>
      )}

      <div className="footer">
        <div className="pager">
          {FI18n.i18nNext.t('cbformatter_preview_currentpage')}
          {/* 条漫/页漫、翻页模式、双页模式、非跨页匹配、当前为首页时，左侧显示空屏页码 */}
          {[1, 2].includes(comicMode) &&
            mode[0] === 'paging' &&
            mode[1] === 'double' &&
            !amend &&
            currentPage === 1 && <span className="page-number">-</span>}
          {/* 日漫、翻页模式、双页模式、当前为尾页且不为第一页时，左侧显示空屏页码 */}
          {comicMode === 3 &&
            mode[0] === 'paging' &&
            mode[1] === 'double' &&
            currentPage === previewList.length &&
            currentPage !== 1 && <span className="page-number">-</span>}
          {/* 日漫、翻页模式、双页模式、跨页匹配或非跨页匹配且当前不为首页时，左侧显示下一页页码 */}
          {comicMode === 3 &&
            mode[0] === 'paging' &&
            mode[1] === 'double' &&
            (amend || (!amend && currentPage !== 1)) &&
            currentPage + 1 <= previewList.length && (
              <span className="page-number">{currentPage + 1}</span>
            )}
          {/* 当前页页码 */}
          <span className="page-number">{currentPage}</span>
          {/* 条漫/页漫、翻页模式、双页模式、跨页匹配或非跨页匹配且当前不为首页时，右侧显示下一页页码 */}
          {[1, 2].includes(comicMode) &&
            mode[0] === 'paging' &&
            mode[1] === 'double' &&
            (amend || (!amend && currentPage !== 1)) &&
            currentPage + 1 <= previewList.length && (
              <span className="page-number">{currentPage + 1}</span>
            )}
          {/* 条漫/页漫、翻页模式、双页模式、当前为尾页且不为第一页时，右侧显示空屏页码 */}
          {[1, 2].includes(comicMode) &&
            mode[0] === 'paging' &&
            mode[1] === 'double' &&
            currentPage === previewList.length &&
            currentPage !== 1 && <span className="page-number">-</span>}
          {/* 日漫、翻页模式、双页模式、非跨页匹配、当前为首页时，右侧显示空屏页码 */}
          {comicMode === 3 &&
            mode[0] === 'paging' &&
            mode[1] === 'double' &&
            !amend &&
            currentPage === 1 && <span className="page-number">-</span>}
          {/* 翻页模式、双页模式时，显示跨页匹配按钮 */}
          {mode[0] === 'paging' && mode[1] === 'double' && (
            <div
              className="amend ghost-btn"
              onClick={() => changeAmend(!amend)}
            >
              {FI18n.i18nNext.t('cbformatter_preview_btn_changespread')}
            </div>
          )}
        </div>
        <div className="jumper">
          <input
            className="page-number"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && jump()}
          />
          <div className="page-total">/ {previewList.length}</div>
          <div className="jump ghost-btn" onClick={jump}>
            {FI18n.i18nNext.t('cbformatter_preview_pagenation_jumpto')}
          </div>
        </div>
        <div className="btn-box">
          <div
            className="mode ghost-btn"
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
