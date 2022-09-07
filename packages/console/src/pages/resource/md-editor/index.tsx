import './index.less';
import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './html2md';
import { toolbarConfig, editorConfig } from './editor-config';
import { Drawer, Tabs, Upload } from 'antd';
import { FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import fMessage from '@/components/fMessage';

const { TabPane } = Tabs;

/** 编辑器 */
const MarkdownEditor = () => {
  const [editor, setEditor] = useState<any>(null);
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [drawerType, setDrawerType] = useState('');
  const [importDrawer, setImportDrawer] = useState(false);

  /** 输出 markdown */
  const outputMarkdown = () => {
    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  /** 切换导入文档弹窗 tab */
  const changeImportTab = async (key: string = 'upload') => {
    console.error(key);
    switch (key) {
      case 'bucket':
        console.error('请求存储空间数据');
        break;
      case 'history':
        console.error('请求历史版本数据');
        break;
      default:
        break;
    }
  };

  /** 切换插入资源弹窗 tab */
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
      case 'bucket':
        break;
      case 'url':
        break;

      default:
        break;
    }
  };

  /** 上传文件 */
  const uploadFile = (info: any) => {
    console.error(info);
    const { status } = info.file;
    if (status === 'done') {
      const fileReader = new FileReader();
      fileReader.readAsText(info.file.originFileObj);
      fileReader.onload = (e: any) => {
        console.error(e.target.result);
      };
    } else if (status === 'error') {
      fMessage('上传失败', 'error');
    }
  };

  useEffect(() => {
    if (editor) {
      editor.openImportDrawer = async () => {
        setImportDrawer(true);
        changeImportTab();
      };
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
      <div className="header">
        <div className="title">编辑文章</div>
        <div className="article-info">
          <span>总字数 {'111'}</span>
          <span>{'12:32:03'} 自动保存</span>
        </div>
        <div className="btns">
          <FComponentsLib.FRectBtn size="small" onClick={outputMarkdown}>
            输出
          </FComponentsLib.FRectBtn>
          <FComponentsLib.FRectBtn size="small" onClick={outputMarkdown}>
            保存
          </FComponentsLib.FRectBtn>
          <div>退出编辑器</div>
        </div>
      </div>

      <div className="toolbar">
        <Toolbar editor={editor} defaultConfig={toolbarConfig} />
      </div>

      <div className="editor">
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
        />
      </div>

      <Drawer
        width={700}
        title="导入文档"
        closable={false}
        open={importDrawer}
        onClose={() => {
          setImportDrawer(false);
        }}
      >
        <Tabs defaultActiveKey="1" onChange={changeImportTab}>
          <TabPane tab="本地上传" key="upload">
            <div className="upload-area">
              <div className="tip">
                点击下方按钮导入文档，支持markdown、txt格式文本
              </div>
              <div className="warning">
                导入的内容将覆盖原有内容，不支持的样式将转为图片或无法展示，发布前请先确认
              </div>
              <Upload showUploadList={false} onChange={uploadFile}>
                <FComponentsLib.FRectBtn className="upload-btn">
                  上传本地文件
                </FComponentsLib.FRectBtn>
              </Upload>
            </div>
          </TabPane>
          <TabPane tab="存储空间" key="bucket">
            <div className="buckets-area">
              
            </div>
          </TabPane>
          <TabPane tab="历史版本" key="history">
            历史版本
          </TabPane>
        </Tabs>
      </Drawer>

      <Drawer
        width={700}
        title={`插入${drawerType}`}
        closable={false}
        open={!!drawerType}
        onClose={() => {
          setDrawerType('');
        }}
      >
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="资源市场" key="market">
            资源市场
          </TabPane>
          <TabPane tab="存储空间" key="bucket">
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

export default connect(() => ({}))(MarkdownEditor);
