import * as React from 'react';
import styles from './index.less';
import {FDown} from "@/components/FIcons";
import {FTextBtn} from "@/components/FButton";
import FUp from "@/components/FIcons/FUp";

interface FExpandableProps {
  children: React.ReactNode;
}

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
          expandable === true && (<FTextBtn
            type="primary"
            onClick={() => {
              setExpandable(false);
            }}
          ><span>收起全部 <FUp/></span></FTextBtn>)
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


    {expandable !== null && (<div
      className={styles.closeButton}
      // style={{}}
    >
      {
        expandable === false && (<FTextBtn
          type="primary"
          onClick={() => {
            setExpandable(true);
          }}
        ><span>展开查看全部 <FDown/></span></FTextBtn>)
      }
    </div>)}
  </div>);
}

export default FExpandable;
