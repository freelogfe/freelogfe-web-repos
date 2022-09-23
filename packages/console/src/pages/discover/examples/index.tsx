import React from 'react';
import styles from './index.less';
import FPlayer from '@/components/FIcons/FPlayer';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import img_blog from '@/assets/flnode_blog.jpg';
import img_comics from '@/assets/flnode_comics.jpg';
import img_docs from '@/assets/flnode_docs.jpg';
import img_reading from '@/assets/flnode_reading.jpg';
import img_stock from '@/assets/flnode_stock.jpg';

const nodeData: {
  id: string;
  cover: string;
  title: string;
  tags: string[];
  text: string;
  href: string;
}[] = [
  {
    id: '1',
    cover: img_reading,
    title: FI18n.i18nNext.t('flnode_reading'),
    tags: [],
    text: FI18n.i18nNext.t('flnode_reading_descr'),
    href: FI18n.i18nNext.t('flnode_reading_addr'),
  },
  {
    id: '2',
    cover: img_comics,
    title: FI18n.i18nNext.t('flnode_comics'),
    tags: [],
    text: FI18n.i18nNext.t('flnode_comics_descr'),
    href: FI18n.i18nNext.t('flnode_comics_addr'),
  },
  {
    id: '3',
    cover: img_blog,
    title: FI18n.i18nNext.t('flnode_blog'),
    tags: [],
    text: FI18n.i18nNext.t('flnode_blog_descr'),
    href: FI18n.i18nNext.t('flnode_blog_addr'),
  },
  {
    id: '4',
    cover: img_stock,
    title: FI18n.i18nNext.t('flnode_stock'),
    tags: [],
    text: FI18n.i18nNext.t('flnode_stock_descr'),
    href: FI18n.i18nNext.t('flnode_stock_addr'),
  },
  {
    id: '5',
    cover: img_docs,
    title: FI18n.i18nNext.t('flnode_docs'),
    tags: [],
    text: FI18n.i18nNext.t('flnode_docs_descr'),
    href: FI18n.i18nNext.t('flnode_docs_addr'),
  },
  {
    id: '6',
    cover: img_docs,
    title: FI18n.i18nNext.t('flnode_podcast'),
    tags: [],
    text: FI18n.i18nNext.t('flnode_podcast_descr'),
    href: FI18n.i18nNext.t('flnode_podcast_addr'),
  },
];

function Examples({}) {
  return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ height: 50 }} />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FComponentsLib.FContentText
        type='negative'
        text={'Freelog为用户展示了一些场景示例，用户可以根据自己的需求选择主题或创建主题来搭建自己的节点'}
      />
    </div>
    <div style={{ height: 50 }} />
    <div className={styles.nodeList}>
      {
        nodeData.map((n) => {
          return (<div key={n.id} className={styles.nodeItem}>
            <div className={styles.nodeItem_Left}>
              <img
                className={styles.cover}
                src={n.cover}
              />
              <div style={{ width: 20 }} />
              <div className={styles.content}>
                <FComponentsLib.FTitleText type='h1' text={n.title} />
                {/*<div style={{ height: 10 }} />*/}
                {/*<Space size={10}>*/}
                {/*  {*/}
                {/*    n.tags.map((t) => {*/}
                {/*      return (<label key={t} className={styles.contentLabel}>{t}</label>);*/}
                {/*    })*/}
                {/*  }*/}
                {/*</Space>*/}
                <div style={{ height: 10 }} />
                <div className={styles.contentText}>{n.text}</div>
              </div>
            </div>
            <div className={styles.nodeItem_Right}>
              <FComponentsLib.FTextBtn
                onClick={() => {
                  window.open(n.href);
                }}
              >
                <FPlayer />
                &nbsp;
                <span>浏览节点</span>
              </FComponentsLib.FTextBtn>
            </div>
          </div>);
        })
      }
    </div>
    <div style={{ height: 100 }} />
  </div>);
}

export default Examples;
