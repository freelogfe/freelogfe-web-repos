import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  SettingPageModelState,
  UserModelState,
} from '@/models/connect';
import FRadio from '@/components/FRadio';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { Cascader, DatePicker, message, Upload } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';
import {
  OnChange_Birthday_Action,
  OnChange_Career_Action,
  OnChange_Gender_Action,
  OnChange_ProfileText_Action,
  OnChange_Residence_Action,
  OnClick_SubmitUserInfoBtn_Action,
  ChangeAction as SettingPageChangeAction, OnClick_EditUserInfoBtn_Action, OnClick_CancelEditUserInfoBtn_Action,
} from '@/models/settingPage';
import { ChangeAction as UserChangeAction } from '@/models/user';
import { Moment } from 'moment';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FUploadAvatar from '@/components/FUploadAvatar';
import fMessage from '@/components/fMessage';
import moment from 'moment';
import * as AHooks from 'ahooks';

interface ProfileProps {
  dispatch: Dispatch;
  user: UserModelState;
  settingPage: SettingPageModelState;
}


function Profile({ dispatch, user, settingPage }: ProfileProps) {

  // AHooks.useMount(() => {
  //   console.log(moment().startOf('hour').format('YYYY-MM-DD HH:mm:ss'), '******');
  // });


  return (
    <>
      <div className={styles.avatar}>
        <FUploadAvatar
          onError={(error) => {
            fMessage(error, 'error');
          }}
          onUploadSuccess={(data) => {
            fMessage(FI18n.i18nNext.t('saved_successfully'), 'success');
            const avatar: string = `${FUtil.Format.completeUrlByDomain('image')}/headImage/${FUtil.Tool.getUserIDByCookies()}` + '?t=' + Date.now();
            dispatch<SettingPageChangeAction>({
              type: 'settingPage/change',
              payload: {
                profile_avatar: data,
              },
            });

            if (user?.userInfo) {
              dispatch<UserChangeAction>({
                type: 'user/change',
                payload: {
                  userInfo: {
                    ...user.userInfo,
                    headImage: data,
                  },
                },
              });
            }
          }}
        >
          <div
            className={styles.container}
          >
            <div
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${settingPage.profile_avatar})`,
                width: 130,
                height: 130,
                borderRadius: '50%',
              }}
            />
            <div
              className={styles.hoverDiv}
              style={{}}
            >修改头像
            </div>
          </div>
        </FUploadAvatar>
      </div>
      <div style={{ height: 30 }} />
      <FFormLayout>
        <FFormLayout.FBlock title={'基本信息'}>
          <Space size={10} direction='vertical' className={styles.info}>
            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'性别'} type='normal' />
              </div>
              <div className={styles.right}>
                {
                  settingPage.profile_state === 'editing' && (<><FRadio
                    checked={settingPage.profile_gender === 'male'}
                    onClick={() => {
                      dispatch<OnChange_Gender_Action>({
                        type: 'settingPage/onChange_Gender',
                        payload: {
                          value: 'male',
                        },
                      });
                    }}
                  >
                    男
                  </FRadio>
                    <div style={{ width: 20 }} />
                    <FRadio
                      checked={settingPage.profile_gender === 'female'}
                      onClick={() => {
                        dispatch<OnChange_Gender_Action>({
                          type: 'settingPage/onChange_Gender',
                          payload: {
                            value: 'female',
                          },
                        });
                      }}
                    >
                      女
                    </FRadio>
                  </>)
                }

                {
                  settingPage.profile_state === 'normal' && (<>
                    {
                      settingPage.profile_gender === 'male' && (
                        <FComponentsLib.FContentText text={'男'} type={'highlight'} />)
                    }

                    {
                      settingPage.profile_gender === 'female' && (
                        <FComponentsLib.FContentText text={'女'} type={'highlight'} />)
                    }

                    {
                      settingPage.profile_gender === 'unknown' && (
                        <FComponentsLib.FContentText text={'未填写'} type={'negative'} />)
                    }
                  </>)
                }
              </div>

            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'个人简介'} type='normal' />
              </div>
              <div className={styles.right}>
                {
                  settingPage.profile_state === 'editing' && (<FInput
                    value={settingPage.profile_profileText}
                    className={styles.blockInput}
                    wrapClassName={styles.blockInput}
                    placeholder={'一句话介绍自己'}
                    lengthLimit={40}
                    errorText={''}
                    onChange={(e) => {
                      dispatch<OnChange_ProfileText_Action>({
                        type: 'settingPage/onChange_ProfileText',
                        payload: {
                          value: e.target.value,
                        },
                      });
                    }}
                  />)
                }

                {
                  settingPage.profile_state === 'normal' && (
                    <FComponentsLib.FContentText
                      text={settingPage.profile_profileText || '未填写'}
                      type={settingPage.profile_profileText === '' ? 'negative' : 'highlight'}
                    />)
                }

              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'出生年月'} type='normal' />
              </div>
              <div className={styles.right}>
                {
                  settingPage.profile_state === 'editing' && (<DatePicker
                    allowClear={false}
                    value={settingPage.profile_birthday}
                    style={{ width: 220, height: 38 }}
                    placeholder={'出生年月日'}
                    onChange={(value: Moment | null, dateString: string) => {
                      dispatch<OnChange_Birthday_Action>({
                        type: 'settingPage/onChange_Birthday',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                    disabledDate={(current) => {
                      // Can not select days before today and today
                      // return current && current >= moment().endOf('day');
                      return current && current > moment().endOf('day');
                    }}
                  />)
                }

                {
                  settingPage.profile_state === 'normal' && (
                    <FComponentsLib.FContentText
                      text={settingPage.profile_birthday?.format(FUtil.Predefined.momentDateFormat) || '未填写'}
                      type={!settingPage.profile_birthday ? 'negative' : 'highlight'}
                    />)
                }

              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'居住地'} type='normal' />
              </div>
              <div className={styles.right}>
                {
                  settingPage.profile_state === 'editing' && (<Cascader
                    allowClear={false}
                    className={styles.Cascader}
                    options={settingPage.profile_residenceOptions}
                    value={settingPage.profile_residence}
                    placeholder='常驻城市'
                    onChange={(value, selectedOptions) => {
                      // console.log(value, selectedOptions, 'selectedOptionssdfjlkfjsdlkfjlksdjljl');
                      dispatch<OnChange_Residence_Action>({
                        type: 'settingPage/onChange_Residence',
                        payload: {
                          value: value,
                          text: selectedOptions
                            .map((o) => {
                              return o.label;
                            })
                            .join(''),
                        },
                      });
                    }}
                  />)
                }

                {
                  settingPage.profile_state === 'normal' && (<FComponentsLib.FContentText
                    text={settingPage.profile_residenceText || '未填写'}
                    type={settingPage.profile_residenceText === '' ? 'negative' : 'highlight'}
                  />)
                }

              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'职业'} type='normal' />
              </div>
              <div className={styles.right}>
                {
                  settingPage.profile_state === 'editing' && (<>
                    <FInput
                      value={settingPage.profile_career}
                      onChange={(e) => {
                        dispatch<OnChange_Career_Action>({
                          type: 'settingPage/onChange_Career',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      placeholder='职位名称'
                      className={styles.widthInput}
                      wrapClassName={styles.widthInput}
                      // errorText={settingPage.profile_careerError}
                      lengthLimit={20}
                    />
                  </>)
                }

                {
                  settingPage.profile_state === 'normal' && (<FComponentsLib.FContentText
                    text={settingPage.profile_career || '未填写'}
                    type={settingPage.profile_career === '' ? 'negative' : 'highlight'}
                  />)
                }

              </div>
            </div>
          </Space>
          <div style={{ height: 40 }} />
          <div className={styles.submit}>
            {
              settingPage.profile_state === 'editing' && (<>
                <FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    dispatch<OnClick_CancelEditUserInfoBtn_Action>({
                      type: 'settingPage/onClick_CancelEditUserInfoBtn',
                    });
                  }}
                >取消</FComponentsLib.FTextBtn>
                <FComponentsLib.FRectBtn
                  type='primary'
                  onClick={() => {
                    dispatch<OnClick_SubmitUserInfoBtn_Action>({
                      type: 'settingPage/onClick_SubmitUserInfoBtn',
                    });
                  }}
                  disabled={settingPage.profile_career.length > 20 || settingPage.profile_profileText.length > 40}
                >
                  保存
                </FComponentsLib.FRectBtn>
              </>)
            }

            {
              settingPage.profile_state === 'normal' && (<FComponentsLib.FRectBtn
                type='primary'
                onClick={() => {
                  dispatch<OnClick_EditUserInfoBtn_Action>({
                    type: 'settingPage/onClick_EditUserInfoBtn',
                  });
                }}
              >
                编辑
              </FComponentsLib.FRectBtn>)
            }

          </div>
        </FFormLayout.FBlock>
      </FFormLayout>
    </>
  );
}

export default connect(({ user, settingPage }: ConnectState) => ({
  user,
  settingPage,
}))(Profile);
