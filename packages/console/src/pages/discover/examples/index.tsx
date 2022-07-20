import React from 'react';
import styles from './index.less';
import { FTextBtn } from '@/components/FButton';
import FPlayer from '@/components/FIcons/FPlayer';
import { FContentText, FTitleText } from '@/components/FText';
import { Space } from 'antd';

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
    cover: 'http://static.testfreelog.com/static/default_cover.png',
    title: '小说阅读',
    tags: [],
    text: '这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介',
    href: 'https://www.baidu.com',
  },
  {
    id: '2',
    cover: 'http://static.testfreelog.com/static/default_cover.png',
    title: '图片瀑布流节点',
    tags: ['瀑布流1', '瀑布流2', '瀑布流3'],
    text: '这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介',
    href: 'https://www.baidu.com',
  },
  {
    id: '3',
    cover: 'http://static.testfreelog.com/static/default_cover.png',
    title: '图片瀑布流节点',
    tags: ['瀑布流1', '瀑布流2', '瀑布流3'],
    text: '这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介',
    href: 'https://www.baidu.com',
  },
  {
    id: '4',
    cover: 'http://static.testfreelog.com/static/default_cover.png',
    title: '图片瀑布流节点',
    tags: ['瀑布流1', '瀑布流2', '瀑布流3'],
    text: '这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介这里是节点简介',
    href: 'https://www.baidu.com',
  },
];

function Examples({}) {
  return (<div>
    <div style={{ height: 30 }} />
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
                <FTitleText type='h1' text={n.title} />
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
              <FTextBtn
                onClick={() => {
                  window.open(n.href);
                }}
              >
                <FPlayer />
                &nbsp;
                <span>浏览节点</span>
              </FTextBtn>
            </div>
          </div>);
        })
      }
    </div>
    <div style={{ height: 100 }} />
  </div>);
}

export default Examples;
