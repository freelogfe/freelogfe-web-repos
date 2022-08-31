import './index.less';
import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './html2md';
import { toolbarConfig, editorConfig } from './editorConfig';
import { Drawer, Tabs } from 'antd';

const { TabPane } = Tabs;

const HomeScreen = () => {
  return (
    <div>
      <iframe frameBorder="0">
        <video src="http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61b9a82f2ae3ac002eb7993a" />
      </iframe>
      <MarkdownEditor />
    </div>
  );
};

/** 编辑器 */
const MarkdownEditor = () => {
  const [editor, setEditor] = useState<any>(null);
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [drawerType, setDrawerType] = useState('');

  /** 输出 markdown */
  const outputMarkdown = () => {
    editor.setHtml(
      `123
      <video src="http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61b9a82f2ae3ac002eb7993a" />
      <audio src="http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61d56c677841ed002e5d3302" />
      123
      `,
    );

    // const video: any = {
    //   type: 'video',
    //   src: 'http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61b9a82f2ae3ac002eb7993a',
    //   poster: '1',
    //   children: [{ text: '1' }], // 【注意】void node 需要一个空 text 作为 children
    // };
    // editor.insertHTML(
    //   '<video controls><source src="http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61b9a82f2ae3ac002eb7993a"></video>',
    // );

    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  /** 切换 tab */
  const changeTab = (key: string) => {
    console.error(key);
  };

  useEffect(() => {
    if (editor) {
      editor.openDrawer = (type: string) => {
        setDrawerType(type);
      };

      // setHtml(
      //   '<video controls src="http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61b9a82f2ae3ac002eb7993a" />',
      // );

      // editor.insertHTML(
      //   `<video poster="" controls=""><source src="http://qi.testfreelog.com/v2/auths/exhibits/80000069/62270eb5f670b2002e80021d/fileStream?parentNid=62270eb5f670&amp;subArticleIdOrName=61b9a82f2ae3ac002eb7993a" type="video/mp4"></video>`,
      // );
    }

    return () => {
      if (!editor) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    setMarkdown(html2md(html));
  }, [html]);

  return (
    <div className="markdown-editor-wrapper">
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={(editor) => setHtml(editor.getHtml())}
        mode="default"
      />
      <button onClick={outputMarkdown}>输出markdown</button>

      <Drawer
        width={500}
        title={`插入${drawerType}`}
        placement="right"
        visible={!!drawerType}
        onClose={() => {
          setDrawerType('');
        }}
      >
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="资源市场" key="1">
            资源市场
          </TabPane>
          <TabPane tab="存储空间" key="2">
            存储空间
          </TabPane>
          <TabPane tab="URL" key="3">
            URL
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

export default connect(() => ({}))(HomeScreen);
