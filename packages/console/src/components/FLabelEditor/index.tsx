import * as React from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';
import * as AHooks from 'ahooks';

interface FLabelEditor {
  values?: string[];
  resourceType?: string;
  onChange?: (values: string[]) => void;
}

function FLabelEditor({ values = [], resourceType = '', onChange }: FLabelEditor) {

  const inputElementRef = React.useRef<HTMLInputElement>(null);
  const [input, set_input] = React.useState<string>('');
  const [errorText, set_errorText] = React.useState<string>('');
  const [recommendations, set_recommendations] = React.useState<string[]>([]);

  AHooks.useMount(async () => {
    if (resourceType !== '') {
      const { data }: {
        data: {
          tagType: 1 | 2;
          tagName: string;
        }[];
      } = await FServiceAPI.Resource.availableTags({
        resourceType: resourceType,
      });
      // console.log(data, '*****LJLKJLKJ');
      set_recommendations(data.filter((d) => {
        return d.tagType === 2;
      }).map((d) => {
        return d.tagName;
      }));
    }
  });

  function onPressEnter(e: any) {
    const v = e.target.value;
    if (errorText) {
      return;
    }
    if (input === '') {
      // onChangeInput('');
      // onChangeErrorText('');
      inputElementRef.current?.blur();
      return;
    }
    if (!input) {
      set_errorText('不能为空');
      return;
    }
    set_input('');
    return onChange && onChange([...values, e.target.value.replace(new RegExp(/#/, 'g'), '')]);
  }

  function onChangeInputText(value1: string) {
    const value = value1.replaceAll('#', '');
    set_input(value);

    let errorText: string = '';
    // if (!value) {
    //   errorText = '不能为空';
    // } else
    if (value.length > 20) {
      errorText = '不超过20个字符';
    } else if (values.includes(value)) {
      errorText = '不能有重复';
    }
    set_errorText(errorText);
  }

  function onRemove(index: number) {
    set_errorText('');
    return onChange && onChange(values?.filter((i, j) => j !== index));
  }

  return (<div className={styles.styles}>
    {
      values?.length < 20 && (<div className={styles.InputWrap}>
        <div className={styles.InputRow}>
          <Input
            className={[styles.Input, errorText ? styles.InputError : ''].join(' ')}
            placeholder={FI18n.i18nNext.t('hint_add_resource_tag')}
            ref={inputElementRef as any}
            value={input}
            onChange={(e) => {
              onChangeInputText(e.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                set_input('');
                set_errorText('');
                inputElementRef.current?.blur();
              }
            }}
            onPressEnter={onPressEnter}
          />
          {
            recommendations.length > 0 && (<>
              <div style={{ width: 20 }} />
              <FComponentsLib.FContentText type={'additional2'} text={'推荐标签 :'} />
              {
                recommendations.map((r) => {
                  // console.log(values, r, 'iosdjflkjsdlfjsdlkjlk');
                  const disabled: boolean = values?.includes(r) || false;
                  return (<React.Fragment key={r}>
                    <div style={{ width: 15 }} />
                    <FTooltip title={'参与即赢2000元现金奖励'} placement={'top'}>
                      <a
                        className={[styles.recommendation, disabled ? styles.disabled : ''].join(' ')}
                        onClick={() => {
                          if (disabled) {
                            return;
                          }
                          onChange && onChange([...values, r]);
                          // onChangeInputText(r);
                          // inputElementRef.current?.focus();
                        }}
                      >#{r}#</a>
                    </FTooltip>
                  </React.Fragment>);
                })
              }
            </>)
          }

        </div>
        <div>
          {errorText && <label>{errorText}</label>}
        </div>
      </div>)
    }

    {
      values && values.length > 0 && (<>
        {
          values.length < 20 && (<div style={{ height: 20 }} />)
        }

        <div className={styles.labels}>
          {
            values.map((i: string, j: number) => (<label key={i} className={styles.label}>
              <span>{i}</span>
              <a onClick={() => onRemove(j)}><FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} /></a>
            </label>))
          }
        </div>
      </>)
    }

  </div>);
}

export default FLabelEditor;
