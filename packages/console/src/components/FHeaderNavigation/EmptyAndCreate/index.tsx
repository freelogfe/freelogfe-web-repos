import * as React from 'react';
import styles from './index.less';
import { FContentText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
import { ChangeAction } from '@/models/storageHomePage';
import { Link, router } from 'umi';
import { FUtil } from '@freelog/tools-lib';

interface EmptyAndCreateProps {
  tipText: string;
  btnText: string;
  btnHref: string;
  target?: '_self' | '_blank';
}

function EmptyAndCreate({ tipText, btnText, btnHref, target }: EmptyAndCreateProps) {
  return (<div className={styles.emptyDropdown}>
    <FContentText text={tipText} />
    <div style={{ height: 30 }} />
    {
      btnHref.startsWith('http')
        ? (<a className={styles.Link} href={btnHref}>{btnText}</a>)
        : (<Link className={styles.Link} target={'_blank'} to={btnHref}>{btnText}</Link>)
    }

    {/*<FRectBtn*/}
    {/*  onClick={() => {*/}

    {/*  }}*/}
    {/*  size='small'*/}
    {/*>{btnText}</FRectBtn>*/}
  </div>);
}

export default EmptyAndCreate;
