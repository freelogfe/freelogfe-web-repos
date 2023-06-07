import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import * as AHooks from 'ahooks';
import { InputRef } from 'antd';
import { Ref } from 'react';

// import { KeyboardEventHandler } from 'react';

interface FResourceLabelEditorProps {
  value: string[];
  resourceType: string;
  onChange?: (value: string[]) => void;
}

interface FResourceLabelEditorStates {
  labels1: {
    id: string;
    name: string;
    description: string;
  }[];
  labels2: {
    id: string;
    name: string;
    description: string;
  }[];

  input: string;
  inputError: string;
}

const initState: FResourceLabelEditorStates = {
  labels1: [],
  labels2: [],

  input: '',
  inputError: '',
};

function FResourceLabelEditor($prop: FResourceLabelEditorProps) {

  const inputElementRef = React.useRef<InputRef>(null);

  const [$state, $setState] = AHooks.useSetState<FResourceLabelEditorStates>(initState);

  AHooks.useMount(async () => {
    if ($prop.resourceType === '') {
      return;
    }
    const { data: data_availableTags }: {
      data: {
        tagId: string;
        tagType: 1 | 2;
        tagName: string;
      }[];
    } = await FServiceAPI.Resource.availableTags({
      resourceType: $prop.resourceType,
    });
    // console.log(data, '*****LJLKJLKJ');
    $setState({
      labels1: data_availableTags
        .filter((d) => {
          return d.tagType === 1;
        })
        .map((d) => {
          return {
            id: d.tagId,
            name: d.tagName,
            description: '',
          };
        }),
      labels2: data_availableTags
        .filter((d) => {
          return d.tagType === 2;
        })
        .map((d) => {
          return {
            id: d.tagId,
            name: d.tagName,
            description: '',
          };
        }),
    });
  });

  if ($prop.value.length >= 20) {
    return (<div>
      <div className={styles.selectedLabels}>
        {
          $prop.value.map((v, w) => {
            return (<label key={v} className={styles.selectedLabel}>
              <span>{v}</span>
              <FComponentsLib.FIcons.FClose
                style={{ fontSize: 12 }}
                onClick={() => {
                  // set_errorText('');
                  $prop.onChange && $prop.onChange($prop.value.filter((i, j) => j !== w));
                  $setState({
                    inputError: $prop.value.includes($state.input) ? '不能有重复' : '',
                  });
                }}
              />
            </label>);
          })
        }

      </div>
    </div>);
  }

  return (<div>
    <FComponentsLib.FInput.FSingleLine
      ref={inputElementRef}
      lengthLimit={-1}
      value={$state.input}
      placeholder={FI18n.i18nNext.t('hint_add_resource_tag')}
      className={[styles.Input].join(' ')}
      onChange={(e) => {
        const value = e.target.value.replaceAll('#', '');
        // set_input(value);
        $setState({
          input: value,
        });

        let errorText: string = '';
        // if (!value) {
        //   errorText = '不能为空';
        // } else
        if (value.length > 20) {
          errorText = '不超过20个字符';
        } else if ($prop.value.includes(value)) {
          errorText = '不能有重复';
        }
        // set_errorText(errorText);
        $setState({
          inputError: errorText,
        });
      }}
      onPressEnter={() => {
        if ($state.inputError) {
          return;
        }
        if ($state.input === '') {
          // onChangeInput('');
          // onChangeErrorText('');
          inputElementRef.current?.blur();
          return;
        }
        if (!$state.input) {
          $setState({
            inputError: '不能为空',
          });
          return;
        }
        $setState({
          input: '',
        });
        $prop.onChange && $prop.onChange([
          ...$prop.value,
          $state.input.replace(new RegExp(/#/, 'g'), ''),
        ]);
      }}
      onKeyUp={(event) => {
        if (event.key === 'Escape') {
          // set_input('');
          // set_errorText('');
          $setState({
            input: '',
            inputError: '',
          });
          inputElementRef.current?.blur();
        }
      }}
    />
    {
      $state.inputError !== '' && (<>
        <div style={{ height: 5 }} />
        <div className={styles.errorTip}>{$state.inputError}</div>
      </>)
    }

    <div style={{ height: 20 }} />
    <div className={styles.selectedLabels}>
      {
        $prop.value.map((v, w) => {
          return (<label key={v} className={styles.selectedLabel}>
            <span>{v}</span>
            <FComponentsLib.FIcons.FClose
              style={{
                fontSize: 12,
                transform: 'scale(.8)',
              }}
              onClick={() => {
                // set_errorText('');
                $prop.onChange && $prop.onChange($prop.value.filter((i, j) => j !== w));
                $setState({
                  inputError: $prop.value.includes($state.input) ? '不能有重复' : '',
                });
              }}
            />
          </label>);
        })
      }

    </div>

    <div style={{ height: 25 }} />

    <FComponentsLib.FContentText text={'推荐标签:'} type={'additional2'} />
    <div style={{ height: 10 }} />
    <div className={styles.Labels}>
      {
        $state.labels1.map((l) => {
          const selected: boolean = $prop.value.includes(l.name);
          return (<FTooltip
            title={l.description}
            placement={'top'}
            key={l.id}
            open={l.description === '' ? false : undefined}
          >
            <label
              onClick={() => {
                if (selected) {
                  $prop.onChange && $prop.onChange($prop.value.filter((v) => {
                    return v !== l.name;
                  }));
                } else {
                  $prop.onChange && $prop.onChange([...$prop.value, l.name]);
                }
              }}
              className={[styles.Label, $prop.value.includes(l.name) ? styles.selected : ''].join(' ')}>{l.name}</label>
          </FTooltip>);
        })
      }
    </div>

    <div style={{ height: 25 }} />

    <FComponentsLib.FContentText text={'推荐活动:'} type={'additional2'} />
    <div style={{ height: 10 }} />
    <div className={styles.Labels}>
      {
        $state.labels2.map((l) => {
          const selected: boolean = $prop.value.includes(l.name);
          return (<FTooltip
            title={l.description}
            placement={'top'}
            key={l.id}
            open={l.description === '' ? false : undefined}
          >
            <label
              onClick={() => {
                if (selected) {
                  $prop.onChange && $prop.onChange($prop.value.filter((v) => {
                    return v !== l.name;
                  }));
                } else {
                  $prop.onChange && $prop.onChange([...$prop.value, l.name]);
                }
              }}
              className={[styles.Label, $prop.value.includes(l.name) ? styles.selected : ''].join(' ')}>{l.name}</label>
          </FTooltip>);
        })
      }
    </div>
  </div>);
}

export default FResourceLabelEditor;
