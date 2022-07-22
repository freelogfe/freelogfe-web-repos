import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { connect, Dispatch } from 'dva';
import {
  ConnectState,
  SettingPageModelState,
  UserModelState,
} from '@/models/connect';
import FRadio from '@/components/FRadio';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { Cascader, DatePicker, message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import {
  OnChange_Birthday_Action,
  OnChange_Career_Action,
  OnChange_Gender_Action,
  OnChange_ProfileText_Action,
  OnChange_Residence_Action,
  OnClick_SubmitUserInfoBtn_Action,
  ChangeAction as SettingPageChangeAction,
} from '@/models/settingPage';
import { FetchInfoAction, ChangeAction as UserChangeAction } from '@/models/user';
import { Moment } from 'moment';
import { FServiceAPI } from '@freelog/tools-lib';
const DatePickerAsAnyType: any = DatePicker;
import FComponentsLib from '@freelog/components-lib';

interface ProfileProps {
  dispatch: Dispatch;
  user: UserModelState;
  settingPage: SettingPageModelState;
}


function Profile({ dispatch, user, settingPage }: ProfileProps) {
  // FServiceAPI.User.uploadHeadImg({
  //   file: File,
  // })
  const [loading, setLoading] = React.useState(false);

  const handleChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // console.log(info.file.originFileObj);
      await FServiceAPI.User.uploadHeadImg({
        // @ts-ignore
        file: info.file.originFileObj,
      });
      dispatch<FetchInfoAction>({
        type: 'user/fetchInfo',
      });

      setLoading(false);
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj as RcFile, (url) => {
      //   setLoading(false);
      //   setImageUrl(url);
      // });
    }
  };

  async function beforeUpload(file: RcFile) {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif';
    if (!isJpgOrPng) {
      return message.error('You can only upload JPG/PNG/gif file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return message.error('Image must smaller than 2MB!');
    }

    // return isJpgOrPng && isLt2M;
    const { data } = await FServiceAPI.User.uploadHeadImg({
      file: file,
    });

    const nowTime: number = Date.now();

    dispatch<SettingPageChangeAction>({
      type: 'settingPage/change',
      payload: {
        avatar: data + '&' + nowTime,
      },
    });
    // console.log(data, '0983ioslkdfsldkjflsdkj');

    dispatch<UserChangeAction>({
      type: 'user/change',
      payload: {
        // @ts-ignore
        userInfo: {
          ...(user?.userInfo || {}),
          headImage: data + '&' + nowTime,
        }
      }
    });
    // setTimeout(() => {
    //   dispatch<FetchInfoAction>({
    //     type: 'user/fetchInfo',
    //   });
    // }, 1000);


    return false;
  }

  return (
    <>
      <div className={styles.avatar + ' flex-row-center'}>
        <div
          className={'container over-h flex-column-center ' + styles.container}
        >
          <Upload
            name='avatar'
            className='avatar-uploader'
            showUploadList={false}
            beforeUpload={beforeUpload}
            // onChange={handleChange}
          >
            <div
              // src={settingPage.avatar}
              // alt="avatar"
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${settingPage.avatar})`,
                width: 130,
                height: 130,
                borderRadius: '50%',
              }}
            />
            <div
              className={styles.hoverDiv}
              style={loading ? { display: 'flex' } : {}}
            >
              {loading ? <LoadingOutlined /> : '修改头像'}
            </div>
          </Upload>
        </div>
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
                <FRadio
                  checked={settingPage.gender === 'male'}
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
                  checked={settingPage.gender === 'female'}
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
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'个人简介'} type='normal' />
              </div>
              <div className={styles.right}>
                <FInput
                  value={settingPage.profileText}
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
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'出生年月'} type='normal' />
              </div>
              <div className={styles.right}>
                <DatePickerAsAnyType
                  allowClear={false}
                  value={settingPage.birthday}
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
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'居住地'} type='normal' />
              </div>
              <div className={styles.right}>
                <Cascader
                  allowClear={false}
                  className={styles.Cascader}
                  options={settingPage.residenceOptions}
                  value={settingPage.residence}
                  placeholder='常驻城市'
                  onChange={(value) => {
                    dispatch<OnChange_Residence_Action>({
                      type: 'settingPage/onChange_Residence',
                      payload: {
                        value: value,
                      },
                    });
                  }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'职业'} type='normal' />
              </div>
              <div className={styles.right}>
                <FInput
                  value={settingPage.career}
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
                />
              </div>
            </div>
          </Space>
          <div style={{ height: 40 }} />
          <div className={styles.submit}>
            <FComponentsLib.FRectBtn
              type='primary'
              onClick={() => {
                dispatch<OnClick_SubmitUserInfoBtn_Action>({
                  type: 'settingPage/onClick_SubmitUserInfoBtn',
                });
              }}
            >
              提交修改
            </FComponentsLib.FRectBtn>
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
