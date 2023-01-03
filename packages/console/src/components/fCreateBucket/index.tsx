import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FCreateBucketModal from './FCreateBucketModal';

interface fCreateBucketProps {

}

type ReturnData = string | null;

function fCreateBucket({}: fCreateBucketProps = {}): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('modal-root') as HTMLDivElement);
    return root.render(<FCreateBucketModal
      onOk={(value) => {
        // resolve(obj);
        resolve(value);
      }}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />);
  });
}

export default fCreateBucket;
