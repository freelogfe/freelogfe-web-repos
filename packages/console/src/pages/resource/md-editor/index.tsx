/** markdown 编辑器 */

import './index.less';
import { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './core/html2md';
import { toolbarConfig, editorConfig } from './core/editor-config';
import { ImportDocDrawer } from './components/import-doc-drawer';
import { InsertResourceDrawer } from './components/insert-resource-drawer';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { Prompt, history } from 'umi';
import fConfirmModal from '@/components/fConfirmModal';
import { FI18n } from '@freelog/tools-lib';

/** 编辑器 */
const MarkdownEditor = () => {
  const inputTimer = useRef<Timeout | null>(null);
  const stopTimer = useRef<Timeout | null>(null);

  const [editor, setEditor] = useState<any>(null);
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [drawerType, setDrawerType] = useState('');
  const [importDrawer, setImportDrawer] = useState(false);
  const [edited, setEdited] = useState(false);
  const [saveType, setSaveType] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [promptShow, setPromptShow] = useState(false);

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
    setSaveType(1);
    setTimeout(() => {
      const saveTime = new Date().getTime();
      setSaveType(2);
      setLastSaveTime(saveTime);
    }, 500);
    setEdited(false);
  };

  /**
   * 格式化日期
   * @param time 时间戳、字符串日期等等
   * @param format 自定义输出结果格式（YYYY:年，MM:月，DD:日，hh:时，mm:分，ss:秒）
   */
  const formatDate = (time: number, format = 'YYYY-MM-DD hh:mm:ss') => {
    if (!time) return '';

    const date = new Date(time);

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const result = format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('hh', hour)
      .replace('mm', minutes)
      .replace('ss', seconds);
    return result;
  };

  useEffect(() => {
    if (editor) {
      editor.openDrawer = async (type: string) => {
        setDrawerType(type);
      };
      editor.openUploadDrawer = async () => {
        setImportDrawer(true);
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
    const newMarkdown = html2md(html);
    const edited = markdown !== newMarkdown;
    setEdited(edited);
    setMarkdown(newMarkdown);

    if (edited) {
      if (!inputTimer.current) {
        inputTimer.current = setTimeout(() => {
          save();
          inputTimer.current = null;
        }, 15000);
      }

      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
      }
      stopTimer.current = setTimeout(() => {
        save();
        stopTimer.current = null;
        if (inputTimer.current) {
          clearTimeout(inputTimer.current);
          inputTimer.current = null;
        }
      }, 3000);
    }
  }, [html]);

  useEffect(() => {
    if (edited) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [edited]);

  return (
    <div className="markdown-editor-wrapper">
      <Prompt
        when={!promptShow && edited}
        message={(location: any) => {
          setPromptShow(true);
          fConfirmModal({
            message: FI18n.i18nNext.t('alarm_leave_page'),
            onOk() {
              history.push(location);
            },
            onCancel() {
              setPromptShow(false);
            },
          });
          return false;
        }}
      />

      <div className="header">
        <div className="title" onClick={outputMarkdown}>
          {FI18n.i18nNext.t('title_edit_post')}
        </div>
        <div className="article-info">
          <span>
            {`${FI18n.i18nNext.t('title_edit_post')} ${markdown.length}`}
          </span>
          {saveType === 1 && (
            <span>{FI18n.i18nNext.t('posteditor_state_saving')}</span>
          )}
          {saveType === 2 && (
            <span>
              {FI18n.i18nNext.t('posteditor_state_saved', {
                LastEditTime: formatDate(lastSaveTime),
              })}
            </span>
          )}
          {saveType === 3 && (
            <span>
              {FI18n.i18nNext.t('posteditor_state_networkabnormal', {
                LastEditTime: formatDate(lastSaveTime),
              })}
            </span>
          )}
        </div>
        <div className="btns">
          <div className={`save-btn ${!edited && 'disabled'}`} onClick={save}>
            {FI18n.i18nNext.t('btn_save_post')}
          </div>
          <div className="exit-btn" onClick={exit}>
            {FI18n.i18nNext.t('btn_quit_editor')}
          </div>
        </div>
      </div>

      <div className="editor-toolbar">
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
        setHtml={setHtml}
        editor={editor}
      />

      <InsertResourceDrawer
        show={!!drawerType}
        close={() => setDrawerType('')}
        drawerType={drawerType}
        editor={editor}
      />
    </div>
  );
};

export default connect(() => ({}))(MarkdownEditor);
