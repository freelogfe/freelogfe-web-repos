import './index.less';
import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './html2md';
import { toolbarConfig, editorConfig } from './editorConfig';
import { Drawer, Tabs } from 'antd';
import { FServiceAPI } from '@freelog/tools-lib';

const { TabPane } = Tabs;

const HomeScreen = () => {
  return (
    <div>
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
    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  /** 切换 tab */
  const changeTab = async (key: string = 'market') => {
    console.error(key);
    switch (key) {
      case 'market':
        const params = {
          skip: 0,
          limit: 20,
          keywords: '',
          resourceType: drawerType,
        };
        const res = await FServiceAPI.Resource.list(params);
        console.error(res);
        break;
      case 'object':
        break;
      case 'url':
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (editor) {
      editor.openDrawer = async (type: string) => {
        setDrawerType(type);
        changeTab();
      };
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
          <TabPane tab="资源市场" key="market">
            资源市场
          </TabPane>
          <TabPane tab="存储空间" key="object">
            存储空间
          </TabPane>
          <TabPane tab="URL" key="url">
            URL
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

export default connect(() => ({}))(HomeScreen);
