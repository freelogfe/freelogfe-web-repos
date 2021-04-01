import * as React from 'react';
import styles from './index.less';

const {FullScreen, useFullScreenHandle} = require('react-full-screen');


interface FFullScreenProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

function FFullScreen({children, fullScreen = false}: FFullScreenProps) {
  const screen = useFullScreenHandle();

  React.useEffect(() => {
    if (fullScreen) {
      screen.enter();
    } else {
      screen.exit();
    }
  }, [fullScreen]);

  return (<FullScreen handle={screen}>
    {children}
  </FullScreen>);
}

export default FFullScreen;
