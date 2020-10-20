import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';
import NoContent from './NoContent';
import Exhibits from './Exhibits';
import Themes from './Themes';

interface NodeManagerProps {

}

function NodeManager({}: NodeManagerProps) {
  return (<FSiderLayout sider={<Sider/>}>
    {/*<NoContent/>*/}
    {/*<Exhibits/>*/}
    <Themes/>
  </FSiderLayout>);
}

export default NodeManager;
