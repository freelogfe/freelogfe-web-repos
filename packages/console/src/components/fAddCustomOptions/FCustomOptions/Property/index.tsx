import * as React from 'react';
import styles from './index.less';
import { Col, Row, Space } from 'antd';
import FInput from '../../../FInput';
// import FSelect from '../../../FSelect';
import { Data } from '../index';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface PropertyProps {
  data: Data;
  hideTypeSelect?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
}

function Property({ data, hideTypeSelect = false, onChange }: PropertyProps) {

  function onChangeData(kv: Partial<PropertyProps['data']>) {
    return onChange && onChange({
      ...data,
      ...kv,
    });
  }

  return (<div className={styles.option}>
    <Row gutter={10}>
      <Col span={24}>
        <Space size={5}>
          <i className={styles.dot} />
          {/*<FComponentsLib.FTitleText type='h4' text={'属性名称'} />*/}
          <FComponentsLib.FTitleText type='h4' text={'配置名称'} />
        </Space>
        <div style={{ height: 5 }} />
        <FInput
          className={styles.input}
          wrapClassName={styles.input}
          placeholder={'输入配置名称'}
          value={data.name}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入配置名称';
            } else if (value.length > 50) {
              errorText = '不超过50个字符';
            }
            // else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
            //   errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
            // }

            onChangeData({
              name: value,
              nameError: errorText,
            });
          }}

        />

        {
          data.nameError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{data.nameError}</div>
          </>)
        }
      </Col>
    </Row>
    <Row gutter={10}>
      <Col span={12}>
        <Space size={5}>
          <i className={styles.dot} />
          {/*<FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('key')} />*/}
          <FComponentsLib.FTitleText type='h4' text={'key'} />
        </Space>
        <div style={{ height: 5 }} />
        <FInput
          className={styles.input}
          wrapClassName={styles.input}
          placeholder={'输入key'}
          value={data.key}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入key';
            } else if (value.length > 20) {
              errorText = '不超过20个字符';
            } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
              errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
            }

            onChangeData({
              key: value,
              keyError: errorText,
            });
          }}
        />

        {
          data.keyError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{data.keyError}</div>
          </>)
        }
      </Col>
      <Col span={12}>
        <Space size={5}>
          {/*<FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('property_remark')} />*/}
          <FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('配置说明')} />
        </Space>
        <div style={{ height: 5 }} />
        <FInput
          className={styles.input}
          wrapClassName={styles.input}
          placeholder={'输入配置说明'}
          value={data.description}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value.length > 50) {
              errorText = '不超过50个字符';
            }

            onChangeData({
              description: value,
              descriptionError: errorText,
            });
          }}
        />
        {
          data.descriptionError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{data.descriptionError}</div>
          </>)
        }
      </Col>
    </Row>
    <div style={{ height: 10 }} />
    <Row gutter={10}>
      {
        !hideTypeSelect && (<Col span={12}>
          <Space size={5}>
            {/*<i className={styles.dot} />*/}
            {/*<FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('value_input_mode')} />*/}
            <FComponentsLib.FTitleText type='h4' text={'配置方式'} />
          </Space>
          <div style={{ height: 5 }} />

          <div className={styles.typeSelect}>
            <div
              className={[styles.typeSelect_option, data.type === 'input' ? styles.active : ''].join(' ')}
              onClick={() => {
                // set_typeSelect('input');
                onChangeData({ type: 'input' });
              }}
            >输入框
            </div>
            <div
              className={[styles.typeSelect_option, data.type === 'select' ? styles.active : ''].join(' ')}
              onClick={() => {
                // set_typeSelect('select');
                onChangeData({ type: 'select' });
              }}
            >下拉选择器
            </div>
          </div>
        </Col>)
      }
    </Row>
    <div style={{ height: 10 }} />
    <Row gutter={24}>
      {
        data.type === 'input' ? (<Col span={18}>
            <Space size={5}>
              {/*<i className={styles.dot} />*/}
              {/*<FTitleText type='h4' text={'自定义选项(填写一个默认值)'} />*/}
              {/*<FComponentsLib.FTitleText type='h4' text={'自定义选项'} />*/}
              <FComponentsLib.FTitleText type='h4' text={'默认值'} />
            </Space>
            <div style={{ height: 5 }} />
            <FInput
              className={styles.input}
              wrapClassName={styles.input}
              // placeholder={'输入自定义选项'}
              placeholder={'输入value'}
              value={data.input}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                // if (value === '') {
                //   errorText = '请输入';
                // } else
                if (value.length > 140) {
                  errorText = '不超过140个字符';
                }
                onChangeData({
                  input: value,
                  inputError: errorText,
                });
              }}
            />
            {
              data.inputError && (<>
                <div style={{ height: 5 }} />
                <div className={styles.errorTip}>{data.inputError}</div>
              </>)
            }
          </Col>)
          : (<Col span={18}>
            <Space size={5}>
              <i className={styles.dot} />
              {/*<FComponentsLib.FTitleText type='h4' text={'自定义选项(首个选项为默认值)'} />*/}
              <FComponentsLib.FTitleText type='h4' text={'下拉选择器中的配置值'} />
            </Space>
            <div style={{ height: 5 }} />

            <Space size={8} direction={'vertical'} style={{ width: '100%' }}>
              {
                data.select.map((si, i) => {
                  return (<div key={i}>
                    <Space size={12}>
                      <FInput
                        value={si.value}
                        // className={styles.input}
                        style={{ width: 480 }}
                        onChange={(e) => {
                          const value: string = e.target.value;
                          let errorText: string = '';
                          if (value === '') {
                            errorText = '输入配置值';
                          } else if (value.length > 500) {
                            errorText = '不超过500个字符';
                          }
                          onChangeData({
                            select: data.select.map((sss, iii) => {
                              if (iii !== i) {
                                return sss;
                              }
                              return {
                                value: value,
                                error: errorText,
                              };
                            }),
                          });
                        }}
                        placeholder={'输入配置值'}
                      />
                      <FComponentsLib.FCircleBtn
                        type={'danger'}
                        onClick={() => {
                          onChangeData({
                            select: data.select.filter((a, b) => {
                              return b !== i;
                            }),
                          });
                        }}
                      />
                    </Space>
                    {si.error && (<>
                      <div style={{ height: 5 }} />
                      <div className={styles.errorTip}>{si.error}</div>
                    </>)}
                  </div>);
                })
              }
            </Space>
            <div style={{ height: 10 }} />
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
              onClick={() => {
                onChangeData({
                  select: [
                    ...data.select,
                    {
                      value: '',
                      error: '',
                    },
                  ],
                });
              }}
            >
              <FComponentsLib.FCircleBtn type={'primary'} size={'small'} />
              <span style={{ color: '#2784FF', fontSize: 12 }}>增加配置选项</span>
            </div>
          </Col>)
      }

    </Row>
  </div>);
}

export default Property;
