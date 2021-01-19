import * as React from 'react';
import styles from './index.less';
import {Modal} from "antd";
import {router} from "umi";
import FNoDataTip from "@/components/FNoDataTip";

interface Error404Props {

}

function Error404({}: Error404Props) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 70);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 70);
  }


  return (<div>
    <FNoDataTip
      height={minHeight}
      tipText={'404,页面不见了'}
      btnText={'将前往首页'}
      onClick={() => {
        router.replace('/');
      }}
    />
  </div>);
}

export default Error404;
