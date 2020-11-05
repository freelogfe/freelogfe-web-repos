import * as React from 'react';
import styles from './index.less';
import {FDown} from "@/components/FIcons";
import {FTextButton} from "@/components/FButton";
import FUp from "@/components/FIcons/FUp";
import {ChangeAction} from "@/models/marketResourcePage";

interface FExpandableProps {
  children: React.ReactNode;
}

// let refContent: null | HTMLDivElement = null;

function FExpandable({children}: FExpandableProps) {
  const refContent = React.useRef<any>();
  const [expandable, setExpandable] = React.useState<boolean | null>(false);

  React.useEffect(() => {
    if (refContent.current.clientHeight > 300) {
      setExpandable(false);
    } else {
      setExpandable(null);
    }
  }, [children]);

  return (<div className={styles.styles}>
    {
      expandable !== null && (<div className={styles.button}>
        {
          !expandable && (<FTextButton
            theme="primary"
            onClick={() => {
              setExpandable(true);
            }}
          ><span>展开查看全部 <FDown/></span></FTextButton>)
        }
        {
          expandable && (<FTextButton
            theme="primary"
            onClick={() => {
              setExpandable(false);
            }}
          ><span>收起全部 <FUp/></span></FTextButton>)
        }
      </div>)
    }

    <div
      className={styles.content}
      style={expandable == false ? {height: 300} : {}}
    >
      <div ref={refContent}>
        {children}
      </div>
    </div>

    {
      expandable === false && (<div className={styles.mask}/>)
    }


    {expandable !== null && (<div style={{height: 30}}/>)}
  </div>);
}

export default FExpandable;
