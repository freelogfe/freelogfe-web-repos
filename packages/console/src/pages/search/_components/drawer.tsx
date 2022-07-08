import { Drawer } from 'antd';
import React, { useState } from 'react';

interface ImageProps {
    className?: string;
    children?: any;
    close: any;
}
export default function Image(props: ImageProps) {
    return (
        <Drawer
            className={props.className}
            closable={false}
            onClose={props.close}
            visible={true}
            height="calc(100vh - 80px)"
            placement="bottom"
        >
            {props.children}
        </Drawer>
    );
}
