import * as React from 'react';
import styles from './index.less';
interface CardContainerProps {
  onClick?: any;
  diabled?: boolean;
  className?: string;
  children?: any;
}
export default function CardContainer(props: CardContainerProps) {
  return (
    <div
      onClick={props.onClick}
      className={
        (props.diabled ? '' : styles.container) + ' flex-column over-h mb-10 w-300 h-314 p-20'
      }
      style={{
        cursor: 'pointer',
      }}
    >
      {props.children}
    </div>
  );
}
