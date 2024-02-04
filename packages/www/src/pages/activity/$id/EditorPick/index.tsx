import * as React from 'react';
import './index.less';
import styles from './index.less';
import img_banner from '@/assets/activity/editorPick/banner@2x.png';
import title from '@/assets/activity/editorPick/title@2x.png';
import cartoon from '@/assets/activity/editorPick/cartoon@2x.png';
import fiction from '@/assets/activity/editorPick/fiction@2x.png';
import node from '@/assets/activity/editorPick/node@2x.png';
import picture from '@/assets/activity/editorPick/picture@2x.png';
import vedio from '@/assets/activity/editorPick/vedio@2x.png';
import voice from '@/assets/activity/editorPick/voice@2x.png';
import reward from '@/assets/activity/editorPick/reward@2x.png';
import way from '@/assets/activity/editorPick/way@2x.png';
import publish from '@/assets/activity/editorPick/publish@2x.png';
import operator from '@/assets/activity/editorPick/operator@2x.png';
import standard from '@/assets/activity/editorPick/standard@2x.png';
import full from '@/assets/activity/editorPick/full@2x.png';
import inovation from '@/assets/activity/editorPick/inovation@2x.png';
import original from '@/assets/activity/editorPick/original@2x.png';
import spread from '@/assets/activity/editorPick/spread@2x.png';
import title2 from '@/assets/activity/editorPick/title2@2x.png';
import Module from './module';
import more from '@/assets/activity/editorPick/more.png';

import FFooter from '@/components/Footer';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import AboutUsMore from '../SpringFestival/AboutUsMore';
import { FUtil, FI18n } from '@freelog/tools-lib';

interface EditorPickProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function EditorPick({ activityDetailsPage }: EditorPickProps) {
  const [modalVisible, set_ModalVisible] = React.useState<boolean>(false);

  const scrollToAnchor = (anchorName: any) => {
    let state: any = {
      behavior: 'smooth',
      block: 'start',
    };
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView(state);
      }
    }
  };
  return (
    <>
      <div className={'editor-pick w-100x h-100x flex-column align-center'}>
        <div className="editor-pick-container pb-100">
          <div className="w-100x">
            <img src={img_banner} alt="" className="w-100x" />
          </div>
          <div className="w-100x flex-column align-center mt-80 editor-pick-1">
            <div className="w-353 mb-40">
              <img src={title} alt="" className="w-100x" />
            </div>
            <div className="flex-row px-216 space-between w-100x">
              <div className="flex-column align-center">
                <span className="editor-pick-1-title">征集期</span>
                <span className="editor-pick-1-content mt-34">
                  {FI18n.i18nNext.t(
                    'event_2024monthlyeditorspick_collect_date',
                  )}
                </span>
                {/* <span className="editor-pick-1-content">截止</span> */}
              </div>
              <div className="flex-column align-center">
                <span className="editor-pick-1-title">评选期</span>
                <span className="editor-pick-1-content mt-20">
                  {FI18n.i18nNext.t(
                    'event_2024monthlyeditorspick_selection_date',
                  )}
                </span>
                {/* <span className="editor-pick-1-content my-5">~</span> */}
                {/* <span className="editor-pick-1-content">2024-04-15 00:00</span> */}
              </div>
              <div className="flex-column align-center">
                <span className="editor-pick-1-title">结果公示</span>
                <span className="editor-pick-1-content mt-48">
                  {FI18n.i18nNext.t('event_2024monthlyeditorspick_awards_date')}
                </span>
              </div>
            </div>
            <div className="flex-column px-162 align-center w-100x mt-50">
              <span className="editor-pick-1-title mb-20">奖项设置</span>
              <div className="flex-row space-between w-100x mb-20">
                <div className="w-237 over-h">
                  <img src={fiction} alt="" className="w-100x" />
                </div>
                <div className="w-237 over-h">
                  <img src={cartoon} alt="" className="w-100x" />
                </div>
                <div className="w-237 over-h">
                  <img src={picture} alt="" className="w-100x" />
                </div>
              </div>
              <div className="flex-row space-between w-100x">
                <div className="w-237 over-h">
                  <img src={vedio} alt="" className="w-100x" />
                </div>
                <div className="w-237 over-h">
                  <img src={voice} alt="" className="w-100x" />
                </div>
                <div className="w-237 over-h">
                  <img src={node} alt="" className="w-100x" />
                </div>
              </div>
              <div className="w-485 over-h mt-30 mb-50">
                <img src={reward} alt="" className="w-100x" />
              </div>
              {/* <button
                className="editor-pick-1-button flex-column-center"
                title="本期获奖结果于 2024-04-15 00:00 进行公示，敬请期待～"
              >
                查看获奖公示
              </button> */}
              <div className="editor-pick-1-tip mt-50">
                游戏、主题、插件月度精选仍在筹备中，首期暂不进行评选，但您提交的作品将自动纳入后续评选，敬请期待！
              </div>
            </div>
            <div className="flex-column px-162 align-center w-100x mt-96">
              <div className="w-151 mb-46">
                <img src={way} alt="" className="w-100x" />
              </div>
              <div className="flex-row space-between w-100x mb-40">
                <div className="w-362 flex-column align-center">
                  <img src={publish} alt="" className="w-100x" />
                  <button
                    className="editor-pick-1-button flex-column-center"
                  >
                    立即发布资源
                  </button>
                </div>
                <div className="w-362 flex-column align-center">
                  <img src={operator} alt="" className="w-100x" />
                  <button
                    className="editor-pick-1-button flex-column-center"
                  >
                    立即运营节点
                  </button>
                </div>
              </div>
              <a
                className="link"
                onClick={() => {
                  set_ModalVisible(true);
                }}
              >
                查看活动规则
              </a>
            </div>
            <div className="flex-column px-160  align-center w-100x mt-96 mb-90">
              <div className="w-151 mb-45">
                <img src={standard} alt="" className="w-100x" />
              </div>
              <div className="w-100x mb-36">
                <img src={original} alt="" className="w-100x" />
              </div>
              <div className="w-100x mb-36">
                <img src={full} alt="" className="w-100x" />
              </div>
              <div className="w-100x mb-36">
                <img src={inovation} alt="" className="w-100x" />
              </div>
              <div className="w-100x mb-36">
                <img src={spread} alt="" className="w-100x" />
              </div>
            </div>
            {/* <div className="flex-column align-center w-100x mt-101 ">
              <div className="w-427 mb-47">
                <img src={title2} alt="" className="w-100x" />
              </div>
            </div> */}
            <div className="w-151 mb-46">
              <img src={more} alt="" className="w-100x" />
            </div>
          </div>

          <AboutUsMore />
        </div>
        <Module
          activityDetailsPage={activityDetailsPage}
          visible={modalVisible}
          set_ModalVisible={set_ModalVisible}
        />
        <FFooter />
      </div>
    </>
  );
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(EditorPick);
