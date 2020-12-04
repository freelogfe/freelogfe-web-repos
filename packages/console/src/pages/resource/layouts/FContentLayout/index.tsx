import * as React from 'react';

import styles from './index.less';
import {FTitleText} from "@/components/FText";
import FInfoLayout from "@/pages/resource/layouts/FInfoLayout";

interface FContentLayoutProps {
  children?: React.ReactNodeArray | React.ReactNode;
  header: React.ReactNode | React.ReactNodeArray;
}

function FContentLayout({header, children}: FContentLayoutProps) {
  return (<>
    <div className={styles.header}>{header}</div>
    <div className={styles.content}>{children}</div>
  </>)
}

export default FContentLayout;
