import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FObjectSelectorDrawer from './FObjectSelectorDrawer';

interface fObjectSelectorDrawerProps {

}

function fObjectSelectorDrawer({}: fObjectSelectorDrawerProps = {}) {
  const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
  return root.render((<FObjectSelectorDrawer
    onSelect={(obj) => {
    }}
    onClose={() => {
      setTimeout(() => {
        root.unmount();
      }, 300);
    }}
  />));
}

export default fObjectSelectorDrawer;
