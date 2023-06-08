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
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import fMessage from '@/components/fMessage';
import { CustomResource } from './core/interface';
import {
  getDependencesByContent,
  importDoc,
} from './custom/dom/resource/utils';
import { Modal } from 'antd';
import showdown from 'showdown';
import { i18nChangeLanguage } from '@wangeditor/editor';

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

showdown.setOption('tables', true);
showdown.setOption('tasklists', true);
showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('backslashEscapesHTMLTags', true);
showdown.setOption('emoji', true);

export const editorContext = React.createContext<any>({});

const { confirm } = Modal;

/** 编辑器 */
export const MarkdownEditor = (props: EditorProps) => {
  const { resourceId, show, close, setSaved } = props;

  const inputTimer = useRef<Timeout | null>(null);
  const stopTimer = useRef<Timeout | null>(null);
  const markdownRef = useRef('');
  const policyProcessor = useRef<any>(null);
  // const relyChanged = useRef(false);
  const statementRely = useRef<string[]>([]);

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

  /** 输出 markdown */
  const outputMarkdown = () => {
    console.log('原HTML文本===>\n', html);
    console.log('markdown文本===>\n', markdown);
  };

  /** 退出 */
  const exit = async () => {
    if (edited) {
      confirm({
        content: FI18n.i18nNext.t('alarm_leave_page'),
        okText: FI18n.i18nNext.t('btn_leave'),
        cancelText: FI18n.i18nNext.t('btn_cancel'),
        onOk() {
          close && close();
        },
      });
    } else {
      close && close();
    }
  };

  /** 创建编辑器 */
  const createEditor = (editor: any) => {
    let language = '';
    const currentLanguage = FI18n.i18nNext.getCurrentLanguage();
    if (currentLanguage === 'zh_CN') {
      language = 'zh-CN';
    } else if (currentLanguage === 'en_US') {
      language = 'en';
    }
    i18nChangeLanguage(language);
    setEditor(editor);
  };

  /** 获取资源与草稿数据 */
  const getData = async () => {
    const resourceRes = await FServiceAPI.Resource.info({
      resourceIdOrName: resourceId,
    });
    editor.resourceData = resourceRes.data;

    const draftRes = await FServiceAPI.Resource.lookDraft({ resourceId });
    if (draftRes.errCode !== 0) {
      fMessage(draftRes.msg);
      return;
    }
    editor.draftData = draftRes.data.draftData as IResourceCreateVersionDraftType;
    const {
      selectedFileInfo,
      directDependencies = [],
      baseUpcastResources = [],
    } = editor.draftData;
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
    targets.forEach((item) => {
      if (!dependencesByIdentify.includes(item.name)) {
        statementRely.current.push(item.name);
      }
    });
    // if (dependencesByIdentify.length) {
    //   const depsData = await FServiceAPI.Resource.batchInfo({
    //     resourceNames: dependencesByIdentify.join(),
    //   });
    //   depsData.data.forEach(async (dep: any) => {
    //     if (!dep) return;

    //     const index = targets.findIndex(
    //       (item: { name: string }) => dep.resourceName === item.name,
    //     );
    //     if (index === -1) {
    //       // 识别出的依赖不在依赖树中，需添加进依赖树
    //       const { resourceId, resourceName, latestVersion } = dep;
    //       targets.push({
    //         id: resourceId,
    //         name: resourceName,
    //         type: 'resource',
    //         versionRange: latestVersion,
    //       });
    //     }
    //   });
    // }
    editor.draftData.directDependencies = targets;
    policyProcessor.current.clear();
    policyProcessor.current.addTargets(targets);
    policyProcessor.current.setBaseUpcastResources(baseUpcastResources);
    setDepTargets(editor.draftData.directDependencies);
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
        formatDate(saveTime, 'YYYYMMDDhhmm').substring(2) +
        '.md';
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

  /** 添加依赖 */
  const addRely = async (target: any) => {
    const index = statementRely.current.findIndex(
      (item) => item === target.name,
    );
    // 申明类的依赖被插入内容中，该依赖不再视为申明类依赖，不再被保护
    if (index !== -1) statementRely.current.splice(index, 1);
    editor.policyProcessor.addTargets([target]);
    const targets = await policyProcessor.current.getAllTargets();
    editor.draftData.directDependencies = targets;
    setDepTargets(targets);
  };

  /** 更新依赖队列 */
  const updateRely = async () => {
    const targets = await policyProcessor.current.getAllTargets();
    const dependencesByIdentify = getDependencesByContent(markdownRef.current);
    if (dependencesByIdentify.length < targets.length) {
      /** 只处理删除的情况 */
      for (let i = targets.length - 1; i >= 0; i--) {
        if (
          !dependencesByIdentify.includes(targets[i].name) &&
          !statementRely.current.includes(targets[i].name)
        ) {
          // 识别出申明的依赖与内容的依赖中不包含之前依赖队列中的此依赖，视为从已内容中删除
          policyProcessor.current.removeTarget(targets[i]);
          targets.splice(i, 1);
        }
      }
      editor.draftData.directDependencies = targets;
    }
    setDepTargets(targets);
  };

  /** 关闭授权弹窗 */
  const closePolicyDrawer = async () => {
    // if (relyChanged.current) {
    const upcastResources =
      await policyProcessor.current.getBaseUpcastResources();
    editor.draftData.baseUpcastResources = [...upcastResources];
    editor.draftData.directDependencies = [...depTargets];
    await FServiceAPI.Resource.saveVersionsDraft({
      resourceId,
      draftData: editor.draftData,
    });
    const html = await importDoc({ content: markdown, type: 'draft' }, editor);
    setHtml(html);
    // relyChanged.current = false;
    // }
    setPolicyDrawer(false);
    editor.focus();
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

  /** 快捷键 */
  const keyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeAllPopup();
  };

  /** 关闭所有弹窗 */
  const closeAllPopup = () => {
    setDrawerType('');
    setImportDrawer(false);
    setPolicyDrawer(false);
  };

  useEffect(() => {
    if (show) {
      window.addEventListener('keyup', keyup);
      document.body.style.overflowY = 'hidden';
      editor && editor.focus();

      setTimeout(() => {
        getData();
      }, 400);
    }
    return () => {
      window.removeEventListener('keyup', keyup);
      document.body.style.overflowY = 'auto';
    };
  }, [show]);

  useEffect(() => {
    if (editor) {
      /** 初始化编辑器一些方法 */
      editor.resourceId = resourceId;
      // 控制资源弹窗
      editor.setDrawerType = (type: string) => {
        setDrawerType(type);
      };
      // 控制导入弹窗
      editor.openUploadDrawer = () => {
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
        updateRely();
        setPolicyDrawer(true);
      };
      // 添加依赖
      editor.addRely = addRely;
      // markdown 转换器
      editor.converter = new showdown.Converter();
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
    if (markdown !== newMarkdown) {
      setEdited(true);
      markdownRef.current = newMarkdown;
      setMarkdown(newMarkdown);

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
      <div
        className={`markdown-editor-wrapper ${show && 'show'}`}
        onClick={() => editor.focus()}
      >
        <div className="header">
          <div className="title" onClick={outputMarkdown}>
            <span>{FI18n.i18nNext.t('title_edit_post')}</span>
          </div>
          <div className="article-info">
            <div></div>
            <div>
              {`${FI18n.i18nNext.t('label_wordscounter')} ${markdown.length}`}
            </div>
            <div>
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
            onCreated={createEditor}
            onChange={(editor) => setHtml(editor.getHtml())}
            mode="default"
          />
        </div>

        <ImportDocDrawer
          show={importDrawer}
          close={() => setImportDrawer(false)}
          setHtml={setHtml}
        />

        <InsertResourceDrawer show={!!drawerType} drawerType={drawerType} />

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

          <div className="authorization-processor-box" style={{height: !depTargets.length ? 'auto' : '80%'}}>
            <FResourceAuthorizationProcessor
              resourceID={resourceId}
              // width={1100}
              onMount={async (processor) => {
                policyProcessor.current = processor;
              }}
              onChanged={async () => {
                // relyChanged.current = true;
                const targets = await policyProcessor.current.getAllTargets();
                setDepTargets(targets);
              }}
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
