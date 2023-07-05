import * as React from 'react';
import * as AHooks from 'ahooks';
import styles from './form.less';
import { FServiceAPI } from '@freelog/tools-lib';
// import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
// import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FComponentsLib from '@freelog/components-lib';

interface FormProps {
  finished: any;
}

function Form({ finished }: FormProps) {
  const [areaData, setAreaData] = React.useState<Array<any>>([]);
  const [cityData, setCityData] = React.useState<Map<string, any>>();
  const [province, setProvince] = React.useState<string>('0');
  const [city, setCity] = React.useState<string>('0');
  const [occupation, setOccupation] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [userData, setUserData] = React.useState<any>({});
  AHooks.useMount(async () => {
    const res = await FServiceAPI.User.currentUserInfo();
    const userData = res.data;
    setUserData(userData);
    const { ret, errCode, data } = await FServiceAPI.User.areasProvinces();
    const cities = new Map<string, any>();
    data.some((province: any) => {
      return province.children.some((city: any) => {
        if (userData.userDetail.areaCode === city.code) {
          setProvince(province.code);
          setCity(city.code);
          return true;
        }
      });
    });
    setOccupation(userData.userDetail.occupation);
    setAreaData([
      { value: '0', title: '请选择省', disabled: false },
      ...data.map((item: any) => {
        cities.set(
          item.code,
          item.children.map((city: any) => {
            return { value: city.code, title: city.name, disabled: false };
          }),
        );
        return { value: item.code, title: item.name, disabled: false, children: item.children };
      }),
    ]);
    setCityData(cities);
  });

  function submit() {
    return FServiceAPI.TestQualification.betaApply({
      areaCode: city,
      occupation,
      description,
    });
  }

  const { loading, data, error, run } = AHooks.useRequest(submit, {
    loadingDelay: 400,
    manual: true,
  });
  React.useEffect(() => {
    // console.log(data)
    if (data && data.errcode === 0) {
      // console.log(data);
      finished && finished(10);
    }
  }, [data]);

  return (
    <div className={'flex-column flex-1 w-100x align-center ' + styles.style}>
      <div className='flex-1 flex-column'>
        <div className='flex-3'></div>
        <div className='shrink-0 flex-column align-center'>
          <div className={styles.title}>内测资格申请</div>
        </div>
        <div className='flex-2'></div>
      </div>
      <div className='shrink-0 flex-column  w-900'>
        <div className={styles.title2 + ' mb-10'}>用户名</div>
        <div className={styles.title3 + ' mb-30'}>{userData.username}</div>
        <div className={styles.title2 + ' mb-10'}>申请结果通知方式</div>
        <div className={styles.title3 + ' mb-20'}>{userData.mobile || userData.email}</div>
        <div className='flex-row align-center mb-5'>
          <span className={styles.must}></span>
          <span className={styles.title4}>职业</span>
        </div>
        {/*<FInput*/}
        {/*  placeholder='请输入您的职业'*/}
        {/*  className='w-400'*/}
        {/*  wrapClassName={styles.input}*/}
        {/*  value={occupation}*/}
        {/*  onChange={(e) => {*/}
        {/*    setOccupation(e.currentTarget.value);*/}
        {/*  }}*/}
        {/*/>*/}
        <FComponentsLib.FInput.FSingleLine
          lengthLimit={-1}
          placeholder='请输入您的职业'
          // className='w-400'
          // wrapClassName={styles.input}
          style={{width: 400}}
          value={occupation}
          onChange={(e) => {
            setOccupation(e.currentTarget.value);
          }}
        />
        <div className='flex-row align-center mt-20 mb-5'>
          <span className={styles.must}/>
          <span className={styles.title4}>所在区域</span>
        </div>
        <div className='flex-row align-center'>
          <FSelect
            className='w-190 mr-20'
            value={province}
            dataSource={[...areaData]}
            onChange={(value: string) => {
              setCity('0');
              setProvince(value);
            }}
          />
          <FSelect
            className='w-190'
            value={city}
            onChange={(value: string) => {
              setCity(value);
            }}
            dataSource={[
              { value: '0', title: '请选择城市', disabled: false },
              ...(cityData?.get(province) || []),
            ]}
          />
        </div>
        <div className='flex-row align-center mt-20 mb-5'>
          <span className={styles.must}></span>
          <span className={styles.title4}>
            请留下您常用的创作平台或社区的个人主页网址，或者微信公众号ID
          </span>
        </div>
        <FComponentsLib.FInput.FMultiLine
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value);
          }}
          lengthLimit={1000}
        />
        {/*<FIntroductionEditor*/}
        {/*  value={description}*/}
        {/*  onChange={(e) => {*/}
        {/*    setDescription(e.currentTarget.value);*/}
        {/*  }}*/}
        {/*/>*/}
        <div className='flex-row-center'>
          <FComponentsLib.FRectBtn
            className='mt-40 '
            disabled={city === '0' || !occupation || !description}
            onClick={() => {
              run();
            }}
          >
            提交申请
          </FComponentsLib.FRectBtn>
        </div>
      </div>
      <div className='flex-1'></div>
      {loading && (
        <div className={styles.loading + ' flex-column-center'}>
          <div className={'flex-column-center ' + styles.box}>
            <span className={styles.text}>提交中</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
