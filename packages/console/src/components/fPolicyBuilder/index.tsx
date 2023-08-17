import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FPolicyBuilderDrawer from '../FPolicyBuilderDrawer';

interface fPolicyBuilderProps {
  alreadyUsedTitles?: string[];
  alreadyUsedTexts?: string[];

  targetType: 'resource' | 'presentable';
  defaultValue?: { title: string, text: string };
}

type ReturnData = { title: string; text: string; } | null;

function fPolicyBuilder({
                          alreadyUsedTitles,
                          alreadyUsedTexts,
                          targetType,
                          defaultValue,
                        }: fPolicyBuilderProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<Temp
      alreadyUsedTitles={alreadyUsedTitles}
      alreadyUsedTexts={alreadyUsedTexts}
      targetType={targetType}
      defaultValue={defaultValue}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
      onConfirm={(value: { title: string, text: string }) => {
        resolve(value);
      }}
    />);
  });
}

export default fPolicyBuilder;

interface TempProps {
  alreadyUsedTitles?: string[];
  alreadyUsedTexts?: string[];

  targetType: 'resource' | 'presentable';

  defaultValue?: { title: string, text: string };

  onConfirm?({ title, text }: { title: string, text: string }): void;

  onClose?(): void;
}

function Temp({ alreadyUsedTitles, alreadyUsedTexts, targetType, defaultValue, onConfirm, onClose }: TempProps) {

  const [visible, set_visible] = React.useState<boolean>(true);

  return (<FPolicyBuilderDrawer
    visible={visible}
    alreadyUsedTitles={alreadyUsedTitles}
    alreadyUsedTexts={alreadyUsedTexts}
    targetType={targetType}
    defaultValue={defaultValue}
    onConfirm={(value) => {
      onConfirm && onConfirm(value);
      set_visible(false);
    }}
    onCancel={() => {
      set_visible(false);
    }}
    afterVisibleChange={(visible) => {
      if (!visible) {
        onClose && onClose();
      }
    }}
  />);
}
