import * as React from 'react';
import styles from './index.less';
import AOrLink from '../AOrLink';
import FComponentsLib from '../../';

interface NavListProps {
    items: {
        id: string;
        text: string;
        href: string;
        target?: '_self' | '_blank';
    }[];
    createBtn?: {
        href: string;
        target?: '_self' | '_blank';
    } | null;
    activeID?: string;

    UmiLinkPatch?: any;

    onSelect?(): void;
}

function NavList({items, createBtn = null, activeID = '', UmiLinkPatch, onSelect}: NavListProps) {
    return (<div
        className={styles.NavList}
    >
        <div style={{height: 10}}/>
        {
            items.map((i) => {
                return (<div key={i.id} onClick={() => {
                    // console.log('*****9989888sdfsdfdsf');
                    onSelect && onSelect()
                }}>
                    <AOrLink
                        className={[styles.NavItem, i.id === activeID ? styles.active : ''].join(' ')}
                        href={i.href}
                        UmiLinkPatch={UmiLinkPatch}
                    >{i.text}</AOrLink>
                </div>);
            })
        }
        <div style={{height: 10}}/>
        {
            createBtn && (<div onClick={() => {
                onSelect && onSelect();
            }}>
                <AOrLink
                    className={styles.newButton}
                    href={createBtn.href}
                    target={createBtn.target}
                    UmiLinkPatch={UmiLinkPatch}
                >
                    <FComponentsLib.FIcons.FPlus style={{fontSize: 14}}/>
                </AOrLink>
            </div>)
        }

    </div>);
}

export default NavList;
