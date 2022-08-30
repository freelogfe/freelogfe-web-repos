import './index.less';
import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './html2md';
import { toolbarConfig, editorConfig } from './editorConfig';

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

  const outputMarkdown = () => {
    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  useEffect(() => {
    if (editor) {
      editor.test = () => {
        console.error(123123123);
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
      />
      <button onClick={outputMarkdown}>输出markdown</button>
    </div>
  );
};

export default connect(() => ({}))(HomeScreen);
