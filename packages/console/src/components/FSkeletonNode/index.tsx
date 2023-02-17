import * as React from 'react';
import styles from './index.less';
import { Skeleton } from 'antd';

interface FSkeletonNodeProps {
  width?: number | string;
  height?: number | string;
}

function FSkeletonNode({ width = 340, height = 38 }: FSkeletonNodeProps) {
  return (<Skeleton.Node style={{ width, height }} active>
    <div />
  </Skeleton.Node>);
}

export default FSkeletonNode;
