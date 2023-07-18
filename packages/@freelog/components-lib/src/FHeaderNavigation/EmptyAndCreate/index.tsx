import * as React from 'react';
import styles from './index.less';
// import { Link } from 'umi';
import FComponentsLib from '../../';
import AOrLink from '../AOrLink';

interface EmptyAndCreateProps {
    tipText: string;
    btnText: string;
    btnHref: string;
    target?: '_self' | '_blank';

    UmiLinkPatch?: any;

    onSelect?(): void;
}

function EmptyAndCreate({tipText, btnText, btnHref, target = '_self', UmiLinkPatch, onSelect}: EmptyAndCreateProps) {

    return (<div className={styles.emptyDropdown}>
        <FComponentsLib.FContentText text={tipText}/>
        <div style={{height: 30}}/>
        <div onClick={() => {
            // console.log('*******()(/sdlfjlsdfljjl')
            onSelect && onSelect();
        }}>
            <AOrLink
                className={styles.Link}
                href={btnHref}
                target={target}
                UmiLinkPatch={UmiLinkPatch}
            >{btnText}</AOrLink>
        </div>
        {/*{*/}
        {/*    btnHref.startsWith('http')*/}
        {/*        ? (<a className={styles.Link} href={btnHref} target={target}>{btnText}</a>)*/}
        {/*        : (<Link className={styles.Link} to={btnHref} target={target}>{btnText}</Link>)*/}
        {/*}*/}
    </div>);
}

export default EmptyAndCreate;
