/** markdown 编辑器 */

import './index.less';
import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './core/html2md';
import { toolbarConfig, editorConfig } from './core/editor-config';
import { ImportDocDrawer } from './components/import-doc-drawer';
import { InsertResourceDrawer } from './components/insert-resource-drawer';

/** 编辑器 */
const MarkdownEditor = () => {
  let markdown = '';

  const [editor, setEditor] = useState<any>(null);
  const [html, setHtml] = useState('');
  const [drawerType, setDrawerType] = useState('');
  const [importDrawer, setImportDrawer] = useState(false);
  const [edited, setEdited] = useState(false);

  /** 输出 markdown */
  const outputMarkdown = () => {
    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  /** 退出 */
  const exit = () => {
    console.error('退出');
  };

  /** 保存 */
  const save = () => {
    console.error('保存');
  };

  useEffect(() => {
    if (editor) {
      editor.openUploadDrawer = async () => {
        setImportDrawer(true);
      };
      editor.openDrawer = async (type: string) => {
        setDrawerType(type);
      };
    }

    return () => {
      // 销毁编辑器
      if (!editor) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    markdown = html2md(html);
    setEdited(!!markdown);
  }, [html]);

  return (
    <div className="markdown-editor-wrapper">
      <div className="header">
        <div className="title" onClick={outputMarkdown}>
          编辑文章
        </div>
        <div className="article-info">
          <span>总字数 {'111'}</span>
          <span>{'12:32:03'} 自动保存</span>
        </div>
        <div className="btns">
          <div className="exit-btn" onClick={exit}>
            退出编辑器
          </div>
          <div
            className={`save-btn ${(!html || !edited) && 'disabled'}`}
            onClick={save}
          >
            保存
          </div>
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

      <ImportDocDrawer
        show={importDrawer}
        close={() => setImportDrawer(false)}
      />

      <InsertResourceDrawer
        show={!!drawerType}
        close={() => setDrawerType('')}
        drawerType={drawerType}
      />
    </div>
  );
};

export default connect(() => ({}))(MarkdownEditor);
