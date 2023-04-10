import * as React from 'react';
import styles from './index.less';
import FBasePropertiesCards from '../FBasePropertiesCards';
import FResourceProperties from '@/components/FResourceProperties';

interface FBasePropertiesProps {
  basics: {
    key: string;
    value: string;
  }[];
  additions: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  rightTop?: React.ReactNode;

  onChangeAdditions?(value: FBasePropertiesProps['additions']): void;

  onClickEdit?(theKey: string): void;
}

function FBaseProperties({ basics, additions, rightTop, onChangeAdditions, onClickEdit }: FBasePropertiesProps) {

  return (<div/>);
}

export default FBaseProperties;
