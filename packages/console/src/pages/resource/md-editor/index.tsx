/** markdown 编辑器 */

import './index.less';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { html2md } from './core/html2md';
import { toolbarConfig, editorConfig } from './core/editor-config';
import { ImportDocDrawer } from './components/import-doc-drawer';
import { InsertResourceDrawer } from './components/insert-resource-drawer';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { formatDate } from './core/common';

// TODO 授权完成需要删除
import { Select } from 'antd';
import fMessage from '@/components/fMessage';
const { Option } = Select;

interface EditorProps {
  // 资源 id
  resourceId: string;
  // 是否显示
  show: boolean;
  // 关闭编辑器弹窗
  close: () => void;
  // 设置是否已保存
  setSaved: (saved: boolean) => void;
}

export const editorContext = React.createContext<any>({});

/** 编辑器 */
export const MarkdownEditor = (props: EditorProps) => {
  const { resourceId, show, close, setSaved } = props;

  const inputTimer = useRef<Timeout | null>(null);
  const stopTimer = useRef<Timeout | null>(null);
  const markdownRef = useRef('');

  const [editor, setEditor] = useState<any>(null);
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [drawerType, setDrawerType] = useState('');
  const [importDrawer, setImportDrawer] = useState(false);
  const [edited, setEdited] = useState(false);
  const [saveType, setSaveType] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);

  // TODO 授权完成需要删除
  const [authorizeType, setAuthorizeType] = useState(1);
  const changeAuthorizeType = (e: number) => {
    setAuthorizeType(e);
    sessionStorage.setItem('authorizeType', String(e));
  };
  useEffect(() => {
    const type = sessionStorage.getItem('authorizeType') || 1;
    setAuthorizeType(Number(type));
  }, []);

  /** 输出 markdown */
  const outputMarkdown = () => {
    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  /** 退出 */
  const exit = () => {
    close();
  };

  /** 保存 */
  const save = async () => {
    setSaveType(1);
    const params = new FormData();
    params.append('file', new File([markdownRef.current], 'newMD.md'));
    const res = await FUtil.Request({
      headers: { 'Content-Type': 'multipart/form-data' },
      method: 'POST',
      url: `/v2/storages/files/upload`,
      data: params,
    });
    if (res.errCode !== 0) {
      fMessage(res.msg);
      return;
    }

    // const result = await FUtil.Request({
    //   method: 'GET',
    //   url: `/v2/storages/files/${res.data.sha1}/download`,
    // });

    const saveTime = new Date().getTime();
    setSaveType(2);
    setLastSaveTime(saveTime);
    setEdited(false);
  };

  /** 禁止编辑器内的资源内容保存（禁止右键菜单） */
  const preventSaveResource = () => {
    /** 禁止图片右键菜单 */
    const imgs = document.getElementsByClassName('image-area');
    for (const item of imgs) {
      (item as any).oncontextmenu = () => {
        return false;
      };
    }

    /** 禁止视频右键菜单 */
    const videos = document.getElementsByClassName('video-area');
    for (const item of videos) {
      (item as any).oncontextmenu = () => {
        return false;
      };
    }

    /** 禁止音频右键菜单 */
    const audios = document.getElementsByClassName('audio-area');
    for (const item of audios) {
      (item as any).oncontextmenu = () => {
        return false;
      };
    }
  };

  useEffect(() => {
    console.error(resourceId);
    if (show) document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [show]);

  useEffect(() => {
    if (editor) {
      editor.setDrawerType = async (type: string) => {
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
    preventSaveResource();

    const newMarkdown = html2md(html);
    const edited = markdown !== newMarkdown;
    setEdited(edited);
    markdownRef.current = newMarkdown;
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
    setSaved(edited);
  }, [edited]);

  return (
    <editorContext.Provider value={{ editor }}>
      <div className={`markdown-editor-wrapper ${show && 'show'}`}>
        <div className="header">
          <div className="title">
            {FI18n.i18nNext.t('title_edit_post')}

            {/* TODO 授权完成需要删除 */}
            <Select
              style={{
                position: 'absolute',
                width: '200px',
                top: '23px',
                left: '120px',
              }}
              value={authorizeType}
              placeholder="请选择模拟的授权状态"
              onChange={changeAuthorizeType}
            >
              {[
                { value: 1, label: '未签约' },
                { value: 2, label: '已签约未授权' },
                { value: 3, label: '已授权' },
                { value: 4, label: '上抛' },
              ].map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
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
        />

        <InsertResourceDrawer
          show={!!drawerType}
          close={() => setDrawerType('')}
          drawerType={drawerType}
        />
      </div>
    </editorContext.Provider>
  );
};
