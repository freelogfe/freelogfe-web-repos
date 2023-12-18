import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
interface fOnOffFeedbackProps {
  state: 'on' | 'off';
  message: string;
}

export function fOnOffFeedback({ ...props }: fOnOffFeedbackProps): void {
  const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
  setTimeout(() => {
    root.unmount();
  }, 1000);

  return root.render(<FOnOffFeedback
    {...props}
  />);
}


interface FOnOffFeedbackProps {
  state: 'on' | 'off';
  message: string;
}

function FOnOffFeedback({ state, message }: FOnOffFeedbackProps) {
  return (<div className={styles.resultModal}>
    <div className={styles.resultPopup}>
      {/*{loading ? (*/}
      {/*  <div className={styles['loader']}>*/}
      {/*    <LoadingOutlined className={styles['loader-icon']} />*/}
      {/*    <div className={styles['loader-text']}>*/}
      {/*      /!*正在{resultPopupType === 1 ? '上架' : '下架'}*!/*/}
      {/*      {resultPopupType === 1*/}
      {/*        ? FI18n.i18nNext.t(*/}
      {/*          'set_resource_available_for_auth_msg_processing',*/}
      {/*        )*/}
      {/*        : FI18n.i18nNext.t(*/}
      {/*          'remove_resource_from_auth_msg_processing',*/}
      {/*        )}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  */}
      {/*)}*/}

      <div className={styles.result}>
        <i
          className={['freelog fl-icon-shangpao', styles.resultIcon, state === 'on' ? styles.up : styles.down].join(' ')} />
        <div style={{ height: 20 }} />
        <div className={styles.resultText}>
          {message}
        </div>
      </div>
    </div>
  </div>);
}

export default FOnOffFeedback;
