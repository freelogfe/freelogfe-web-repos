import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import {FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import Sider from './Sider';
import Content from './Content';

interface StorageProps {

}

function Storage({}: StorageProps) {
  return (<FSiderLayout sider={<Sider/>}><Content/></FSiderLayout>);
}

export default Storage;
