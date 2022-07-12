import * as React from 'react';

interface PolicyTagProps {
  name: string;
  className?: string;
  children?: any;
}
export default function PolicyTag(props: PolicyTagProps) {
  return (
    <div
      className={'px-6 py-3 shrink-0 mr-6 flex-row-center ' + props.className}
      style={{
        background: '#E9F2FF',
        borderRadius: '2px',
        border: '1px solid #AED0FF',
        fontSize: '12px',
        fontWeight: 400,
        color: '#2784FF',
      }}
    >
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}
