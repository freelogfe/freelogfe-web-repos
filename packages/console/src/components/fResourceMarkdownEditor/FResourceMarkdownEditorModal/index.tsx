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
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { formatDate } from './core/common';
import FResourceAuthorizationProcessor from '@/components/FResourceAuthorizationProcessor';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import fMessage from '@/components/fMessage';
import { CustomResource } from './core/interface';
import {
  getDependencesByContent,
  importDoc,
} from './custom/dom/resource/utils';

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
  const policyProcessor = useRef<any>(null);

  const [editor, setEditor] = useState<any>(null);
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [drawerType, setDrawerType] = useState('');
  const [importDrawer, setImportDrawer] = useState(false);
  const [policyDrawer, setPolicyDrawer] = useState(false);
  const [depTargets, setDepTargets] = useState([]);
  const [edited, setEdited] = useState(false);
  const [saveType, setSaveType] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);

  /** 退出 */
  const exit = async () => {
    close && close();
  };

  /** 获取资源数据 */
  const getResourceData = async () => {
    const res = await FServiceAPI.Resource.info({
      resourceIdOrName: resourceId,
    });
    editor.resourceData = res.data;
  };

  /** 获取草稿数据 */
  const getDraftData = async () => {
    const res = await FServiceAPI.Resource.lookDraft({ resourceId });
    if (res.errCode !== 0) {
      fMessage(res.msg);
      return;
    }
    editor.draftData = res.data.draftData as IResourceCreateVersionDraft;
    const { selectedFileInfo, directDependencies = [] } = editor.draftData;
    const targets = [...directDependencies];
    let dependencesByIdentify: string[] = [];
    if (selectedFileInfo) {
      const content = await FUtil.Request({
        method: 'GET',
        url: `/v2/storages/files/${selectedFileInfo.sha1}/download`,
      });
      const contentStr = String(content);
      const html = await importDoc(
        { content: contentStr, type: 'draft' },
        editor,
      );
      setHtml(html);
      dependencesByIdentify = getDependencesByContent(contentStr);
    }
    if (dependencesByIdentify.length) {
      const depsData = await FServiceAPI.Resource.batchInfo({
        resourceNames: dependencesByIdentify.join(),
      });
      depsData.data.forEach(async (dep: any) => {
        if (!dep) return;

        const index = targets.findIndex(
          (item: { name: string }) => dep.resourceName === item.name,
        );
        if (index === -1) {
          // 识别出的依赖不在依赖树中，需添加进依赖树
          const { resourceId, resourceName, latestVersion } = dep;
          targets.push({
            id: resourceId,
            name: resourceName,
            type: 'resource',
            versionRange: latestVersion,
          });
        }
      });
    }
    editor.draftData.directDependencies = [...targets];
    policyProcessor.current.clear();
    policyProcessor.current.addTargets(targets);
  };

  /** 关闭授权弹窗 */
  const closePolicyDrawer = () => {
    getDraftData();
    setPolicyDrawer(false);
    editor.focus();
  };

  /** 保存 */
  const save = async () => {
    if (!editor.draftData) return;

    setSaveType(1);
    const saveTime = new Date().getTime();
    let fileName = editor.draftData.selectedFileInfo?.name;
    if (!fileName) {
      // 草稿数据中没有文件名称，说明是新建文件，文件名称命名规则为{资源名称 最后保存时间}
      fileName =
        editor.resourceData.resourceName.split('/')[1] +
        formatDate(saveTime, 'YYYYMMDDhhmm').substring(2) + '.md';
    }
    const params = new FormData();
    params.append('file', new File([markdownRef.current], fileName));
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

    editor.draftData.selectedFileInfo = {
      name: fileName,
      sha1: res.data.sha1,
      from: `最近编辑时间 ${formatDate(saveTime)}`,
    };
    const targets = await policyProcessor.current.getAllTargets();
    const dependencesByIdentify = getDependencesByContent(markdownRef.current);
    if (dependencesByIdentify.length) {
      const newDep: string[] = [];
      dependencesByIdentify.forEach((depName) => {
        const index = targets.findIndex((item: any) => item.name === depName);
        if (index === -1) newDep.push(depName);
      });
      const depsData = await FServiceAPI.Resource.batchInfo({
        resourceNames: newDep.join(),
      });
      depsData.data.forEach(async (dep: any) => {
        const { resourceId, resourceName, latestVersion } = dep;
        const target = {
          id: resourceId,
          name: resourceName,
          type: 'resource',
          versionRange: latestVersion,
        };
        targets.push(target);
        policyProcessor.current.addTargets([target]);
      });
    }
    editor.draftData.directDependencies = [...targets];
    const saveDraftRes = await FServiceAPI.Resource.saveVersionsDraft({
      resourceId,
      draftData: editor.draftData,
    });
    if (saveDraftRes.errCode !== 0) {
      fMessage(saveDraftRes.msg);
      return;
    }

    setSaveType(2);
    setLastSaveTime(saveTime);
    setEdited(false);
    if (inputTimer.current) {
      clearTimeout(inputTimer.current);
      inputTimer.current = null;
    }
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
  };

  /** 依赖授权队列变化 */
  const depChange = async () => {
    const targets = await policyProcessor.current.getAllTargets();
    setDepTargets(targets);
    editor.draftData.directDependencies = [...targets];
    await FServiceAPI.Resource.saveVersionsDraft({
      resourceId,
      draftData: editor.draftData,
    });
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
    if (show) {
      document.body.style.overflowY = 'hidden';
      editor && editor.focus();
      getResourceData();

      setTimeout(() => {
        getDraftData();
      }, 400);
    }
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [show]);

  useEffect(() => {
    if (editor) {
      /** 初始化编辑器一些方法 */
      editor.resourceId = resourceId;
      // 控制资源弹窗
      editor.setDrawerType = async (type: string) => {
        setDrawerType(type);
      };
      // 控制导入弹窗
      editor.openUploadDrawer = async () => {
        setImportDrawer(true);
      };
      // 控制依赖授权弹窗
      editor.openPolicyDrawer = async (data?: CustomResource) => {
        if (data) {
          // 在授权队列中选中对应资源
          policyProcessor.current.activeTarget({
            id: data.resourceId,
            name: data.resourceName,
            type: 'resource',
          });
        }
        const targets = await policyProcessor.current.getAllTargets();
        setDepTargets(targets);
        setPolicyDrawer(true);
      };
      // 依赖授权组件实例
      editor.policyProcessor = policyProcessor.current;
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
    setSaved && setSaved(!edited);
  }, [edited]);

  return (
    <editorContext.Provider value={{ editor, resourceId }}>
      <div className={`markdown-editor-wrapper ${show && 'show'}`}>
        <div className="header">
          <div className="title">
            <span>{FI18n.i18nNext.t('title_edit_post')}</span>
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

        <div className={`policy-drawer ${policyDrawer && 'show'}`}>
          <div className="policy-header">
            <div className="header-box">
              <div className="title">
                {FI18n.i18nNext.t('title_posteditor_getauth')}
              </div>
              <i
                className="freelog fl-icon-guanbi close-btn"
                onClick={closePolicyDrawer}
              />
            </div>
          </div>

          <div className="authorization-processor-box">
            <FResourceAuthorizationProcessor
              resourceID={resourceId}
              width={1100}
              onMount={async (processor) => {
                policyProcessor.current = processor;
              }}
              onChanged={depChange}
            />
          </div>

          {!depTargets.length && (
            <div className="no-dep-box">
              <div className="title">
                {FI18n.i18nNext.t('posteditor_authlist_empty')}
              </div>
              <div className="desc">
                {FI18n.i18nNext.t('posteditor_authlist_empty_desc')}
              </div>
              <div
                className="close-btn"
                onClick={() => {
                  setPolicyDrawer(false);
                  editor.focus();
                }}
              >
                {FI18n.i18nNext.t('posteditor_authlist_empty_btn_back')}
              </div>
            </div>
          )}
        </div>
      </div>
    </editorContext.Provider>
  );
};
