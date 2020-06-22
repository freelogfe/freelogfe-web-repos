import * as React from 'react';
import {Input} from 'antd';
import {InputProps} from "antd/lib/input";

export default function (props: InputProps) {
  return (<Input {...props}/>);
}
