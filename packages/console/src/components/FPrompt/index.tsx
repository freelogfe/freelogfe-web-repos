import * as React from 'react';
import styles from './index.less';
import fConfirmModal from '@/components/fConfirmModal';
import { Prompt } from 'umi';
import * as H from 'history';
import { history } from '@@/core/history';

interface FPromptProps {
  when: boolean;
  messageText: string;
}

interface FPromptStates {
  promptLeavePath: string;
}

const initStates: FPromptStates = {
  promptLeavePath: '',
};

function FPrompt({ when, messageText }: FPromptProps) {

  const [promptLeavePath, set_promptLeavePath] = React.useState<FPromptStates['promptLeavePath']>(initStates['promptLeavePath']);

  return (<Prompt
    when={promptLeavePath === '' && when}
    message={(location: H.Location, action: H.Action) => {
      const locationHref: string = location.pathname + location.search;
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
