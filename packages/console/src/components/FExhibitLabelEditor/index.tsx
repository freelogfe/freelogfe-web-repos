import * as React from 'react';
import styles from './index.less';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { InputRef } from 'antd';

interface FExhibitLabelEditorProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

interface FExhibitLabelEditorStates {
  input: string;
  inputError: string;
}

const initStates: FExhibitLabelEditorStates = {
  input: '',
  inputError: '',
};

function FExhibitLabelEditor($prop: FExhibitLabelEditorProps) {

  const inputElementRef = React.useRef<InputRef>(null);
  // const [input, set_input] = React.useState<string>('');
  // const [errorText, set_errorText] = React.useState<string>('');

  const [$state, $setState] = AHooks.useSetState<FExhibitLabelEditorStates>(initStates);

  React.useEffect(() => {
    if ($state.input === '') {
      return;
    }
    $setState({
      inputError: $prop.value.includes($state.input) ? '不能有重复' : '',
    });
  }, [$prop.value]);

  return (<div>
    <FComponentsLib.FInput.FSingleLine
      ref={inputElementRef}
      size={'small'}
      lengthLimit={-1}
      value={$state.input}
      placeholder={FI18n.i18nNext.t('hint_add_resource_tag')}
      className={[styles.Input].join(' ')}
      onChange={(e) => {
        const value: string = e.target.value.replaceAll('#', '');
        // set_input(value);
        $setState({
          input: value,
        });

        let errorText: string = '';
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
        if ($state.inputError !== '') {
          return;
        }
        if ($state.input === '') {
          // onChangeInput('');
          // onChangeErrorText('');
          inputElementRef.current?.blur();
          return;
        }
        // if ($state.input === '') {
        //   $setState({
        //     inputError: '不能为空',
        //   });
        //   return;
        // }
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
                transform: 'scale(.6)',
              }}
              onClick={() => {
                // set_errorText('');
                $prop.onChange && $prop.onChange($prop.value.filter((i, j) => j !== w));
              }}
            />
          </label>);
        })
      }

    </div>
  </div>);
}

export default FExhibitLabelEditor;
