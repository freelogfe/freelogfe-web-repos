import * as React from 'react';
import styles from './index.less';
import fConfirmModal from '@/components/fConfirmModal';
import { Prompt } from 'umi';
import * as H from 'history';
import { history } from '@@/core/history';

interface FPromptProps {
  watch: boolean;
  messageText: string;
}

interface FPromptStates {
  promptLeavePath: string;
}

const initStates: FPromptStates = {
  promptLeavePath: '',
};

function FPrompt({ watch, messageText }: FPromptProps) {

  const [promptLeavePath, set_promptLeavePath] = React.useState<FPromptStates['promptLeavePath']>(initStates['promptLeavePath']);

  React.useEffect(() => {
    if (watch) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [watch]);

  return (<Prompt
    when={promptLeavePath === '' && watch}
    message={(location: H.Location, action: H.Action) => {
      // console.log(location, action, 'lLLLLLLddfsido9fjsldkfjsdlfjsdlkjl');
      const locationHref: string = location.pathname + location.search + location.hash;
      set_promptLeavePath(locationHref);

      fConfirmModal({
        message: messageText,
        onOk() {
          history.push(promptLeavePath);
        },
        onCancel() {
          set_promptLeavePath(promptLeavePath);
        },
      });
      return false;
    }}
  />);
}

export default FPrompt;
