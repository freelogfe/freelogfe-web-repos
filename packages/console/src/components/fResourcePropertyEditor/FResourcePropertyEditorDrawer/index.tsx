import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { DatePicker, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import moment from 'moment';
import FLoadingTip from '@/components/FLoadingTip';
import { useGetState } from '@/utils/hooks';
import { get } from 'sortablejs';

interface FResourcePropertyEditorDrawerProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData: {
    key: string;
    name: string;
    value: string;
    description: string;
  } | null;
  noneEditableFields?: Array<'key' | 'name' | 'value' | 'description'>;
  valueAcceptNull?: boolean;

  onOk?(data: {
    key: string;
    name: string;
    value: string;
    description: string;
  }): void;

  onClose?(): void;
}

interface FResourcePropertyEditorDrawerStates {
  visible: boolean;
  pageState: 'loading' | 'loaded';
  nameInput: string;
  nameInputError: string;
  keyInput: string;
  keyInputError: string;

  valueInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
}

interface FResourcePropertyEditorDrawerStates1 {
  valueFormat: {
    format: 'textInput' | 'textArea' | 'integer' | 'decimal' | 'date' | 'dataTime';
    minLength?: number;
    maxLength?: number;
    startDate?: string;
    limitDate?: string;
    startDateTime?: string;
    limitDateTime?: string;
    min?: number;
    max?: number;
    minDecimal?: number;
    maxDecimal?: number;
    precision?: number;
  } | null;
  valueInput: string;
}

const initStates: FResourcePropertyEditorDrawerStates = {
  visible: true,
  pageState: 'loading',
  nameInput: '',
  nameInputError: '',
  keyInput: '',
  keyInputError: '',
  valueInputError: '',
  descriptionInput: '',
  descriptionInputError: '',
};

const initStates1: FResourcePropertyEditorDrawerStates1 = {
  valueFormat: null,
  valueInput: '',
};

enum FormatEnum {
  date = 4,
  dataTime = 5,
  textInput = 6,
  textArea = 7,
  integer = 8,
  decimal = 9,
}

function FResourcePropertyEditorDrawer({
                                         disabledKeys,
                                         disabledNames,
                                         defaultData,
                                         noneEditableFields = [],
                                         valueAcceptNull = false,
                                         onOk,
                                         onClose,
                                       }: FResourcePropertyEditorDrawerProps) {

  const [$state, $setState] = AHooks.useSetState<FResourcePropertyEditorDrawerStates>(initStates);
  const [$valueFormat, set$valueFormat, get$valueFormat] = useGetState<FResourcePropertyEditorDrawerStates1['valueFormat']>(initStates1['valueFormat']);
  const [$valueInput, set$valueInput, get$valueInput] = useGetState<FResourcePropertyEditorDrawerStates1['valueInput']>(initStates1['valueInput']);

  async function initData() {
    if (!defaultData) {
      $setState({
        pageState: 'loaded',
      });
      return;
    }

    const params: Parameters<typeof FServiceAPI.Resource.getAttrsInfoByKey>[0] = {
      key: defaultData.key,
    };

    const { ret, errCode, msg, data }: {
      ret: number;
      errCode: number;
      msg: string;
      data: null | {
        format: 1 | 2 | 3 | 4 | 5 | 6 | 7; //	值格式 1：文本 2：数值 3：时间 4：日期 5：日期和时间 6: 单行文本 7: 多行文本 8: 整数 9: 小数
        contentRule?:
          { startDate?: string; limitDate?: string; } // 4：日期
          | { startDateTime?: string; limitDateTime?: string; } // 5：日期和时间
          | { minLength?: number; maxLength?: number; } // 6：文本  7: 多行文本
          | { min?: number; max?: number; } // 8: 整数
          | { minDecimal?: number; maxDecimal?: number; precision?: number; }; // 9: 小数
      }
    } = await FServiceAPI.Resource.getAttrsInfoByKey(params);
    // console.log(data, 'sd9iofjsdlifjljlkjl');
    $setState({
      pageState: 'loaded',
    });
    if (!data) {
      return;
    }

    // let valueInput: string = '';
    const valueFormat: FResourcePropertyEditorDrawerStates1['valueFormat'] = {
      // 'textInput' | 'textArea' | 'integer' | 'decimal' | 'date' | 'dataTime'
      format: FormatEnum[data.format] as NonNullable<FResourcePropertyEditorDrawerStates1['valueFormat']>['format'],
      ...(data.contentRule || {}),
    };

    $setState({
      keyInput: defaultData.key,
      nameInput: defaultData.name,
      // valueInput: defaultData.value,
      descriptionInput: defaultData.description,
      // valueFormat,
    });
    set$valueFormat(valueFormat);
    set$valueInput(defaultData.value);

    if (valueFormat.format === 'textInput') {
      onVerify_textInput();
    } else if (valueFormat.format === 'textArea') {
      onVerify_textArea();
    } else if (valueFormat.format === 'integer') {
      onVerify_integer();
    } else if (valueFormat.format === 'decimal') {
      onVerify_decimal();
    } else if (valueFormat.format === 'date') {
      onVerify_date();
    } else if (valueFormat.format === 'dataTime') {
      onVerify_dataTime();
    }
  }

  function onVerify_textInput() {
    // console.log()
    const valueFormat = get$valueFormat();
    const valueInput = get$valueInput();
    let errorText: string = '';
    if (valueAcceptNull && valueInput === '') {
      return;
    } else if (valueFormat?.minLength && valueInput.length < valueFormat.minLength) {
      errorText = `不少于${valueFormat.minLength}个字符`;
    } else if (valueFormat?.maxLength && valueInput.length > valueFormat.maxLength) {
      errorText = `不超过${valueFormat.maxLength}个字符`;
    }
    $setState({
      valueInputError: errorText,
    });
  }

  function onVerify_textArea() {
    const valueFormat = get$valueFormat();
    const valueInput = get$valueInput();
    let errorText: string = '';
    if (valueAcceptNull && valueInput === '') {
      return;
    } else if (valueFormat?.minLength && valueInput.length < valueFormat.minLength) {
      errorText = `不少于${valueFormat.minLength}个字符`;
    } else if (valueFormat?.maxLength && valueInput.length > valueFormat.maxLength) {
      errorText = `不超过${valueFormat.maxLength}个字符`;
    }
    $setState({
      valueInputError: errorText,
    });
  }

  function onVerify_integer() {
    const valueFormat = get$valueFormat();
    const valueInput = get$valueInput();
    // console.log(valueInput, 'valueInputoisdjflkj sdiofjsldkfjlk;j');
    let errorText: string = '';
    let num = Number.parseInt(valueInput);
    if (valueAcceptNull && valueInput === '') {
      return;
    } else if (Number.isNaN(num)) {
      $setState({
        valueInputError: '请输入正确的整数',
      });
      return;
    } else if (valueFormat?.min !== undefined && num < valueFormat.min) {
      errorText = `不小于${valueFormat.min}`;
    } else if (valueFormat?.max && num > valueFormat.max) {
      errorText = `不大于${valueFormat.max}`;
    }
    set$valueInput(String(num));
    $setState({
      // valueInput: String(num),
      valueInputError: errorText,
    });
  }

  function onVerify_decimal() {
    const valueInput = get$valueInput();
    const valueFormat = get$valueFormat();
    let errorText: string = '';
    let num = Number.parseFloat(valueInput);
    if (valueAcceptNull && valueInput === '') {
      return;
    } else if (Number.isNaN(num)) {
      $setState({
        valueInputError: '请输入正确的小数',
      });
      return;
    } else {
      if (valueFormat?.precision !== undefined) {
        num = Math.floor(num * 10 ** valueFormat.precision || 0) / 10 ** valueFormat?.precision;
      }
      if (valueFormat?.minDecimal !== undefined && num < valueFormat.minDecimal) {
        errorText = `不小于${valueFormat.minDecimal}`;
      } else if (valueFormat?.maxDecimal !== undefined && num > valueFormat.maxDecimal) {
        errorText = `不大于${valueFormat.maxDecimal}`;
      }
    }
    set$valueInput(String(num));
    $setState({
      // valueInput: String(num),
      valueInputError: errorText,
    });
  }

  function onVerify_date() {
    const startDate = get$valueFormat()?.startDate?.split(' ')[0];
    const limitDate = get$valueFormat()?.limitDate?.split(' ')[0];
    const valueInput = get$valueInput();
    const formatString = 'YYYY-MM-DD';
    if (valueInput === '' || !checkMomentFormat(valueInput, formatString)) {
      set$valueInput('');
      $setState({
        // valueInput: '',
        valueInputError: '',
      });
    } else if (startDate && moment(valueInput, formatString).isBefore(moment(startDate + ' 00:00:00', 'YYYY-MM-DD hh:mm:ss'))) {
      $setState({
        // valueInput: valueInput,
        valueInputError: `时间不能早于 ${startDate}`,
      });
    } else if (limitDate && moment(valueInput, formatString).isAfter(moment(limitDate + ' 23:59:59', 'YYYY-MM-DD hh:mm:ss'))) {
      $setState({
        // valueInput: valueInput,
        valueInputError: `时间不能晚于 ${limitDate}`,
      });
    } else {
      $setState({
        // valueInput: valueInput,
        valueInputError: '',
      });
    }
  }

  function onVerify_dataTime() {
    const valueInput = get$valueInput();
    const formatString = 'YYYY-MM-DD hh:mm:ss';
    if (valueInput === '' || !checkMomentFormat(valueInput, formatString)) {
      set$valueInput('');
      $setState({
        // valueInput: '',
        valueInputError: '',
      });
    } else if (get$valueFormat()?.startDateTime && moment(valueInput, formatString).isBefore(moment(get$valueFormat()?.startDateTime, formatString))) {
      $setState({
        // valueInput: valueInput,
        valueInputError: `时间不能早于 ${get$valueFormat()?.startDateTime}`,
      });
    } else if (get$valueFormat()?.limitDateTime && moment(valueInput, formatString).isAfter(moment(get$valueFormat()?.limitDateTime, formatString))) {
      $setState({
        // valueInput: valueInput,
        valueInputError: `时间不能晚于 ${get$valueFormat()?.limitDateTime}`,
      });
    } else {
      $setState({
        // valueInput: valueInput,
        valueInputError: '',
      });
    }
  }

  return (<FDrawer
    // title={defaultData ? '编辑基础属性' : '补充属性'}
    title={defaultData ? FI18n.i18nNext.t('resourceinfo_edit_title') : FI18n.i18nNext.t('resourceinfo_add_title')}
    onClose={() => {
      // set_visible(false);
      $setState({
        visible: false,
      });
    }}
    open={$state.visible}
    width={580}
    afterOpenChange={(v) => {
      if (!v) {
        // $setState(initStates);
        onClose && onClose();
      } else {
        initData();
      }
    }}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          // set_visible(false);
          $setState({
            visible: false,
          });
        }}
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        type='primary'
        disabled={$state.nameInput === '' || $state.nameInputError !== ''
        || $state.keyInput === '' || $state.keyInputError !== ''
        || $state.descriptionInputError !== ''
        || (!valueAcceptNull && $valueInput === '') || $state.valueInputError !== ''}
        onClick={async () => {
          onOk && onOk({
            key: $state.keyInput,
            name: $state.nameInput,
            value: get$valueInput(),
            description: $state.descriptionInput,
          });
          // set_visible(false);
          $setState({
            visible: false,
          });
        }}
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
    </Space>}
  >

    {
      $state.pageState === 'loading' && (<FLoadingTip height={800} />)
    }

    {
      $state.pageState === 'loaded' && (<Space
        size={20}
        direction='vertical'
        style={{ width: '100%' }}
      >

        <div className={styles.input}>
          <div className={styles.title}>
            {/*<i className={styles.dot} />*/}
            {/*<FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'属性名称'} />*/}
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('resourceinfo_add_input_name')}
            />
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            placeholder={FI18n.i18nNext.t('resourceinfo_add_input_name_hint')}
            disabled={noneEditableFields.includes('name')}
            value={$state.nameInput}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value === '') {
                errorText = '输入属性名称';
              } else if (value.length > 50) {
                // errorText = '不超过50个字符';
                errorText = FI18n.i18nNext.t('alert_naming_convention_attribute_name');
              } else if (disabledNames.includes(value) && value !== defaultData?.name) {
                errorText = '名称不能重复';
              }
              $setState({
                nameInput: value,
                nameInputError: errorText,
              });
            }}
          />
          {
            $state.nameInputError && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.nameInputError}</div>
            </>)
          }
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('resourceinfo_add_input_key')}
            />
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            placeholder={FI18n.i18nNext.t('resourceinfo_add_input_key_hint')}
            value={$state.keyInput}
            disabled={noneEditableFields.includes('key')}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value === '') {
                errorText = '输入key';
              } else if (value.length > 20) {
                errorText = '不超过20个字符';
                // errorText = FI18n.i18nNext.t('alert_key_convention_key');
              } else if (disabledKeys.includes(value) && value !== defaultData?.key) {
                // errorText = '键不能重复';
                errorText = FI18n.i18nNext.t('alert_key_exist');
              } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                // console.log(FUtil.Regexp.CUSTOM_KEY, 'FUtil.Regexp.CUSTOM_KEY.test(value)')
                // errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                errorText = FI18n.i18nNext.t('alert_naming_convention_key');
              }
              $setState({
                keyInput: value,
                keyInputError: errorText,
              });
            }}
          />
          {
            $state.keyInputError && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.keyInputError}</div>
            </>)
          }
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('resourceinfo_add_input_desc')}
            />
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'additional2'}
              text={FI18n.i18nNext.t('form_input_label_optional')}
            />
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            value={$state.descriptionInput}
            className={styles.input}
            disabled={noneEditableFields.includes('description')}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value.length > 50) {
                errorText = FI18n.i18nNext.t('alert_key_remark_length');
              }
              $setState({
                descriptionInput: value,
                descriptionInputError: errorText,
              });
            }}
            placeholder={FI18n.i18nNext.t('resourceinfo_add_input_desc_hint')}
          />
          {
            $state.descriptionInputError && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.descriptionInputError}</div>
            </>)
          }
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('resourceinfo_add_input_value')}
            />
          </div>
          <div style={{ height: 5 }} />

          {
            !$valueFormat && (<FComponentsLib.FInput.FSingleLine
              lengthLimit={-1}
              value={$valueInput}
              className={styles.input}
              disabled={noneEditableFields.includes('value')}
              onChange={(e) => {
                set$valueInput(e.target.value);
                $setState({
                  // valueInput: e.target.value,
                  valueInputError: '',
                });

              }}
              onBlur={() => {
                const value: string = get$valueInput();
                let errorText: string = '';
                if (valueAcceptNull && value === '') {
                  return;
                } else if (value === '') {
                  errorText = '输入value';
                } else if (value.length > 140) {
                  // errorText = '不超过140个字符';
                  errorText = FI18n.i18nNext.t('alert_custom_option_field');
                }
                $setState({
                  valueInputError: errorText,
                });
              }}
              placeholder={FI18n.i18nNext.t('resourceinfo_add_input_value_hint')}
            />)
          }

          {
            $valueFormat?.format === 'textInput' && (<FComponentsLib.FInput.FSingleLine
              lengthLimit={-1}
              value={$valueInput}
              className={styles.input}
              disabled={noneEditableFields.includes('value')}
              onChange={(e) => {
                set$valueInput(e.target.value);
                $setState({
                  // valueInput: e.target.value,
                  valueInputError: '',
                });
              }}
              onBlur={() => {
                onVerify_textInput();
              }}
              placeholder={FI18n.i18nNext.t('resourceinfo_add_input_value_hint')}
            />)
          }

          {
            $valueFormat?.format === 'textArea' && (<FComponentsLib.FInput.FMultiLine
              lengthLimit={-1}
              value={$valueInput}
              onChange={(e) => {
                set$valueInput(e.target.value);
                $setState({
                  // valueInput: e.target.value,
                  valueInputError: '',
                });
              }}
              onBlur={() => {
                onVerify_textArea();
              }}
            />)
          }

          {/*'integer' | 'decimal' | 'date' | 'dataTime'*/}
          {
            $valueFormat?.format === 'integer' && (<FComponentsLib.FInput.FSingleLine
              lengthLimit={-1}
              value={$valueInput}
              className={styles.input}
              disabled={noneEditableFields.includes('value')}
              onChange={(e) => {
                set$valueInput(e.target.value);
                $setState({
                  // valueInput: e.target.value,
                  valueInputError: '',
                });
              }}
              onBlur={() => {
                onVerify_integer();
              }}
              placeholder={'请输入整数'}
            />)
          }
          {
            $valueFormat?.format === 'decimal' && (<FComponentsLib.FInput.FSingleLine
              lengthLimit={-1}
              value={$valueInput}
              className={styles.input}
              disabled={noneEditableFields.includes('value')}
              onChange={(e) => {
                set$valueInput(e.target.value);
                $setState({
                  // valueInput: e.target.value,
                  valueInputError: '',
                });
              }}
              onBlur={() => {
                onVerify_decimal();
              }}
              placeholder={'请输入小数'}
            />)
          }
          {
            $valueFormat?.format === 'date' && (<DatePicker
              value={$valueInput ? moment($valueInput, 'YYYY-MM-DD') : null}
              disabled={noneEditableFields.includes('value')}
              style={{ width: 280, height: 38 }}
              onChange={(value, dateString: string) => {
                set$valueInput(dateString);
                onVerify_date();
              }}
              disabledDate={(currentDate) => {
                let result: boolean = false;
                const valueFormat = get$valueFormat();
                if (valueFormat?.startDate) {
                  const startDate = valueFormat.startDate.split(' ')[0];
                  result = currentDate.isBefore(moment(startDate + ' 00:00:00', 'YYYY-MM-DD hh:mm:ss'));
                }

                if (!result && valueFormat?.limitDate) {
                  const limitDate = valueFormat.limitDate.split(' ')[0];
                  result = currentDate.isAfter(moment(limitDate + ' 23:59:59', 'YYYY-MM-DD hh:mm:ss'));
                }
                return result;
              }}
              showNow={false}
              showToday={false}
              inputReadOnly={true}
            />)
          }
          {
            $valueFormat?.format === 'dataTime' && (<DatePicker
              value={$valueInput ? moment($valueInput, 'YYYY-MM-DD hh:mm:ss') : null}
              showTime={true}
              disabled={noneEditableFields.includes('value')}
              style={{ width: 450, height: 38 }}
              onChange={(value, dateString: string) => {
                set$valueInput(dateString);
                onVerify_dataTime();
              }}
              disabledDate={(currentDate) => {
                let result: boolean = false;
                const valueFormat = get$valueFormat();
                if (valueFormat?.startDateTime) {
                  result = currentDate.isBefore(moment(valueFormat.startDateTime, 'YYYY-MM-DD hh:mm:ss'));
                }

                if (!result && valueFormat?.limitDateTime) {
                  result = currentDate.isAfter(moment(valueFormat.limitDateTime, 'YYYY-MM-DD hh:mm:ss'));
                }
                return result;
              }}
              showNow={false}
              showToday={false}
              inputReadOnly={true}
              // disabledTime={(data) => {
              //   // console.log(data, partial, 'disabledTime dsf disabledTime dsfwefwes disabledTime 0932ujrilsfdujlfkjl');
              //   return {
              //     disabledHours() {
              //       return [15, 16, 17];
              //     },
              //     disabledMinutes(selectedHour: number) {
              //
              //       return Array(60).fill(null).map((m, i) => {
              //         return i;
              //       });
              //     },
              //     disabledSeconds(selectedHour: number, selectedMinute: number) {
              //       return Array(60).fill(null).map((m, i) => {
              //         return i;
              //       });
              //     },
              //   };
              // }}
            />)
          }

          {
            $state.valueInputError && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.valueInputError}</div>
            </>)
          }
        </div>


      </Space>)
    }

  </FDrawer>);
}

export default FResourcePropertyEditorDrawer;

//功能介绍：检查是否为日期时间
// function checkDateTime(str: string){
//   var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
//   var r = str.match(reg);
//   if(r==null)return false;
//   r[2]=r[2]-1;
//   var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);
//   if(d.getFullYear()!=r[1])return false;
//   if(d.getMonth()!=r[2])return false;
//   if(d.getDate()!=r[3])return false;
//   if(d.getHours()!=r[4])return false;
//   if(d.getMinutes()!=r[5])return false;
//   if(d.getSeconds()!=r[6])return false;
//   return true;
// }


/**
 判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期
 */
// function IsDate(sm,mystring) {
//   var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
//   var str = mystring;
//   var arr = reg.exec(str);
//   if (str=="") return true;
//   if (!reg.test(str)&&RegExp.$2<=12&&RegExp.$3<=31){
//     alert("请保证"+sm+"中输入的日期格式为yyyy-mm-dd或正确的日期!");
//     return false;
//   }
//   return true;
// }

function checkMomentFormat(datetimeString: string, formatString: string) {
  return moment(datetimeString, formatString).format(formatString) === datetimeString;
}
