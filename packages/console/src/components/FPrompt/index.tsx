import * as React from 'react';
import styles from './index.less';
import fConfirmModal from '@/components/fConfirmModal';
import { Prompt, history } from 'umi';
import * as AHooks from 'ahooks';
import { FI18n } from '@freelog/tools-lib';

interface FPromptProps {
  watch: boolean;
  messageText: string;
  okText?: string;
  cancelText?: string;

  onOk?(locationHref: string): void;

  onCancel?(locationHref: string): void;
}

function FPrompt($prop: FPromptProps) {

  const prompting = React.useRef<boolean>(false);

  React.useEffect(() => {
    if ($prop.watch) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [$prop.watch]);

  AHooks.useUnmount(() => {
    window.onbeforeunload = null;
  });

  return (<Prompt
    // when={$state.promptLeavePath === '' && $prop.watch}
    when={true}
    message={(location, action) => {
      // return false;
      if ($prop.watch && !prompting.current) {
        prompting.current = true;
        const locationHref: string = location.pathname + location.search + location.hash;
        fConfirmModal({
          message: $prop.messageText,
          okText: $prop.okText || FI18n.i18nNext.t('btn_leave'),
          cancelText: $prop.cancelText || FI18n.i18nNext.t('btn_cancel'),
          onOk() {
            if ($prop.onOk) {
              $prop.onOk(locationHref);
            } else {
              history.push(locationHref);
            }
            prompting.current = false;
          },
          onCancel() {
            if ($prop.onCancel) {
              $prop.onCancel(locationHref);
            }
            prompting.current = false;
          },
        });
        return false;
      } else {
        return true;
      }
    }}
  />);
}

export default FPrompt;
