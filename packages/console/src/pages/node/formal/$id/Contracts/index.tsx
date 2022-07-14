import * as React from 'react';
import styles from './index.less';
import Sider from '@/pages/node/formal/$id/Sider';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import { Helmet } from 'react-helmet';

interface ContractsProps {

}

function Contracts({}: ContractsProps) {
  return (<FLeftSiderLayout
    type={'table'}
    sider={<Sider />}
    header={<div />}
  >
    <div />
  </FLeftSiderLayout>);
}

export default Contracts;
