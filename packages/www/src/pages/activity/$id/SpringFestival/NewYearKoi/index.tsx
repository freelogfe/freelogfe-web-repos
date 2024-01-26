import * as React from 'react';
import styles from './index.less';
import img_koiTitle from '@/assets/activity/SpringFestival/koiTitle@2x.png';
import { Input, Modal, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import sharedStyles from '@/pages/activity/$id/SpringFestival/shared.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface NewYearKoiProps {

}

function NewYearKoi({}: NewYearKoiProps) {

  const [$isFinish, set$isFinish, get$isFinish] = FUtil.Hook.useGetState<boolean>(false);
  const [$showModal, set$showModal, get$showModal] = FUtil.Hook.useGetState<boolean>(false);
  const [$value, set$value, get$value] = FUtil.Hook.useGetState<string>('');

  AHooks.useMount(async () => {
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      return;
    }
    const { data }: {
      data: {
        completionTime: number;
      }[];
    } = await FServiceAPI.Activity.statisticTaskRecords({
      codes: ['TS000901'],
    });
    // console.log(data, 'datasdijf;lksdjflksdjlkjl');
    set$isFinish(data[0].completionTime >= 1);
  });

  return (<>
    <div className={styles.koi}>
      <img src={img_koiTitle} style={{ width: 432, opacity: .95 }} alt={''} />
      <div className={styles.textContent}>
        活动期间内，在微博或小红书参与 <strong>#freelog创作激励计划#</strong> 话题打卡，发布freelog相关笔记，内容不限于分享活动安利、创作资源推荐或节点推荐等，并提交打卡相关证明，即视为成功参与。
      </div>
      <div style={{ height: 45 }} />
      <Space size={30}>
        <FComponentsLib.FTitleText type={'h3'} text={'提交微博或小红书话题打卡记录（0/1）'} />
        <a
          className={[sharedStyles.button, sharedStyles.small, $isFinish ? sharedStyles.disabled : ''].join(' ')}
          onClick={async () => {
            if (get$isFinish()) {
              return;
            }
            await FServiceAPI.User.currentUserInfo();
            set$value('');
            set$showModal(true);
          }}
        >{$isFinish ? '已完成' : '去完成'}</a>
      </Space>
      <div style={{ height: 60 }} />
    </div>

    <Modal
      open={$showModal}
      title={null}
      footer={null}
      closable={true}
      maskClosable={true}
      // closeIcon={<span />}
      width={650}
      centered={true}
      style={{ borderRadius: 6, overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        set$showModal(false);
      }}
    >
      <div className={styles.modalContent}>
        <FComponentsLib.FTitleText type={'h3'} text={'提交打卡记录'} style={{ width: '100%', textAlign: 'center' }} />
        <div style={{ height: 30 }} />
        <FComponentsLib.FTipText text={'链接获取方法'} type={'third'} />
        <div style={{ height: 15 }} />
        <FComponentsLib.FContentText type={'additional2'} text={'小红书: 点击笔记进入详情页，点击右上角“分享”按钮，选择“复制链接”即可；'} />
        <div style={{ height: 10 }} />
        <FComponentsLib.FContentText type={'additional2'} text={'微博：进入微博详情页，点击右上角的“更多”按钮，选择“复制链接”即可。'} />
        <div style={{ height: 30 }} />
        <Input.TextArea
          className={styles.TextArea}
          autoSize={false}
          value={$value}
          onChange={(e) => {
            set$value(e.target.value);
          }}
        />
        <div style={{ height: 10 }} />
        <FComponentsLib.FContentText
          type={'additional2'}
          text={'提示：提交成功后不可修改，请仔细核对信息，确保填写无误后再进行提交。'}
          style={{
            color: '#EE4040',
          }}
        />
        <div style={{ height: 25 }} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a className={[sharedStyles.button, sharedStyles.small].join(' ')}>提交</a>
        </div>
      </div>
    </Modal>
  </>);
}

export default NewYearKoi;
