import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
// import FPolicyBuilderDrawer from '../FPolicyBuilderDrawer';
import FPolicyOperatorDrawer from '@/components/FPolicyOperatorDrawer';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

interface fPolicyOperatorProps {
  titleText: string;
  confirmText: string;
  tipText: string;
  policiesList: PolicyFullInfo_Type[];
}

type ReturnData = { policyID: string; checked: boolean; }[] | null;

function fPolicyOperator({ titleText, confirmText, tipText, policiesList }: fPolicyOperatorProps): Promise<ReturnData> {
  console.log(policiesList, 'policiesListsdflkjsdlfkjlskdj');
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<Temp
      titleText={titleText}
      confirmText={confirmText}
      tipText={tipText}
      policiesList={policiesList}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
      onConfirm={(policies: { policyID: string; checked: boolean; }[]) => {
        resolve(policies);
      }}
    />);
  });
}

export default fPolicyOperator;

interface TempProps {
  titleText: string;
  confirmText: string;
  tipText: string;
  policiesList: PolicyFullInfo_Type[];

  onConfirm?(policies: { policyID: string; checked: boolean; }[]): void;

  onClose?(): void;
}

function Temp({ titleText, confirmText, tipText, policiesList, onConfirm, onClose }: TempProps) {

  const [visible, set_visible] = React.useState<boolean>(true);

  return (<FPolicyOperatorDrawer
    visible={visible}
    titleText={titleText}
    confirmText={confirmText}
    tipText={tipText}
    policiesList={policiesList}
    onConfirm={(value) => {
      onConfirm && onConfirm(value);
      set_visible(false);
      onClose && onClose();
    }}
    onCancel={() => {
      set_visible(false);
      onClose && onClose();
    }}
    // afterVisibleChange={(visible) => {
    //   if (!visible) {
    //     onClose && onClose();
    //   }
    // }}
  />);
}
