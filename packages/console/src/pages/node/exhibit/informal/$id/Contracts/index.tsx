import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FFullScreen from '@/components/FIcons/FFullScreen';
import FModal from '@/components/FModal';
import { FRectBtn } from '@/components/FButton';
import FExhibitAuthorizedContracts from '@/components/FExhibitAuthorizedContracts';
import { OnChanged_ExhibitAuthorized_Action } from '@/models/informExhibitInfoPage';

interface ContractsProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Contracts({ dispatch, informExhibitInfoPage }: ContractsProps) {

  return (<div>
    <FTitleText
      text={'关联合约'}
      type='h3'
    />

    <div style={{ height: 20 }} />
    <FExhibitAuthorizedContracts
      exhibitID={informExhibitInfoPage.exhibit_ID}
      onChangeAuthorize={() => {
        dispatch<OnChanged_ExhibitAuthorized_Action>({
          type: 'informExhibitInfoPage/onChanged_ExhibitAuthorized',
        });
      }}
    />
  </div>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Contracts);

// interface SinglePolicyProps {
//   name: string;
//   text: string;
//
//   onClickSign?(): void;
// }
//
// function SinglePolicy({ name, text, onClickSign }: SinglePolicyProps) {
//
//   const [fullScreenVisible, setFullScreenVisible] = React.useState<boolean>(false);
//
//   return (<div className={styles.singPolicy}>
//     <div className={styles.singPolicyHeader}>
//       {/*<span>{name}</span>*/}
//       <FContentText type='highlight' text={name} />
//       <FRectBtn
//         style={{ height: 26, padding: '0 15px' }}
//         // className={styles.singPolicyHeaderBtn}
//         size='small'
//         onClick={() => {
//           onClickSign && onClickSign();
//         }}
//       >签约</FRectBtn>
//     </div>
//     <div style={{ height: 10 }} />
//     <div style={{ padding: '0 20px' }}>
//       <FPolicyDisplay
//         code={text}
//       />
//     </div>
//     <a
//       className={styles.PolicyFullScreenBtn}
//       onClick={() => {
//         setFullScreenVisible(true);
//       }}
//     ><FFullScreen style={{ fontSize: 12 }} /></a>
//
//     <FModal
//       title={null}
//       visible={fullScreenVisible}
//       onCancel={() => {
//         setFullScreenVisible(false);
//       }}
//       width={1240}
//       footer={null}
//       centered
//     >
//       <div className={styles.ModalTile}>
//         <FTitleText text={name} type='h2' />
//         <div style={{ width: 20 }} />
//         <a
//           className={styles.singPolicyHeaderBtn}
//           onClick={() => {
//             onClickSign && onClickSign();
//           }}
//         >签约</a>
//       </div>
//       <div style={{ padding: '0 20px' }}>
//         <FPolicyDisplay
//           containerHeight={770}
//           code={text}
//         />
//       </div>
//     </FModal>
//
//   </div>);
// }
