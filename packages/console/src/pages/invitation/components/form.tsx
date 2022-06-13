import * as React from 'react';
import * as AHooks from 'ahooks';
import styles from './form.less';

import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { FRectBtn } from '@/components/FButton';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';

interface FormProps {}

interface FormStates {
  showPage: 'InviteCode' | 'PersonalData' | 'Result';
}

const initStates: FormStates = {
  showPage: 'InviteCode',
};

function Form({}: FormProps) {
  const [showPage, set_showPage] = React.useState<FormStates['showPage']>(initStates['showPage']);

  AHooks.useMount(async () => {
    // const { ret, errCode, data } = await FServiceAPI.User.areasProvinces();
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaCodesActivate({ codes: '' });
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaApply({
    //   areaCode: '',
    //   occupation: '',
    //   description: '',
    // });
  });

  AHooks.useUnmount(() => {});

  return (
    <div className={'flex-column flex-1 w-100x align-center ' + styles.style}>
      <div className="flex-1 flex-column">
        <div className="flex-3"></div>
        <div className="shrink-0 flex-column align-center">
          <div className={styles.title}>内测资格申请</div>
        </div>
        <div className="flex-2"></div>
      </div>
      <div className="shrink-0 flex-column  w-900">
        <div className={styles.title2 + ' mb-10'}>用户名</div>
        <div className={styles.title3 + ' mb-30'}>YANGHONGTIAN</div>
        <div className={styles.title2 + ' mb-10'}>申请结果通知方式</div>
        <div className={styles.title3 + ' mb-20'}>13487639088</div>
        <div className="flex-row align-center mb-5">
          <span className={styles.must}></span>
          <span className={styles.title4}>职业</span>
        </div>
        <FInput placeholder="请输入您的职业" wrapClassName={styles.input} />
        <div className="flex-row align-center mt-20 mb-5">
          <span className={styles.must}></span>
          <span className={styles.title4}>所在区域</span>
        </div>
        <div className="flex-row align-center">
          <FSelect dataSource={[{ value: 1, title: '请选择省', disabled: false }]} />
          <FSelect dataSource={[{ value: 1, title: '请选择城市', disabled: false }]} />
        </div>
        <div className="flex-row align-center mt-20 mb-5">
          <span className={styles.must}></span>
          <span className={styles.title4}>
            请留下您常用的创作平台或社区的个人主页网址，或者微信公众号ID
          </span>
        </div>
        <FIntroductionEditor />
        <div className="flex-row-center">
          <FRectBtn className="mt-40 ">提交申请</FRectBtn>
        </div>
      </div>
      <div className="flex-1"></div>
      <div className={styles.loading + ' flex-column-center'}>
        <div className={'flex-column-center ' + styles.box}>
          <span className={styles.text}>提交中</span>
        </div>
      </div>
    </div>
  );
}

export default Form;
