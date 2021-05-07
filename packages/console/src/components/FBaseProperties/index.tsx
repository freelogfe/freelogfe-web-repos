import * as React from 'react';
import styles from './index.less';
import FBasePropertiesCards from "@/components/FBasePropertiesCards";

interface FBasePropertiesProps {
  basics: {
    key: string;
    value: string;
  }[];
  additions: {
    key: string;
    value: string;
    description: string;
  }[];

  rightTop?: React.ReactNode;

  onChangeAdditions?(value: FBasePropertiesProps['additions']): void;
}

function FBaseProperties({basics, additions, rightTop, onChangeAdditions}: FBasePropertiesProps) {

  return (<div className={styles.attributes}>
      <div className={styles.attributesHeader}>
        <span>基础属性</span>
        <div>{rightTop}</div>
      </div>

      <FBasePropertiesCards
        rawProperties={basics.map((b) => {
          return {
            theKey: b.key,
            value: b.value,
          };
        })}
        baseProperties={additions.map((a) => {
          return {
            theKey: a.key,
            description: a.description,
            value: a.value,
          };
        })}
        // onEdit={(theKey) => {
        //
        // }}
        onDelete={(theKey) => {
          onChangeAdditions && onChangeAdditions(additions.filter((a) => {
            return a.key !== theKey;
          }));
        }}
      />
      <div style={{height: 10}}/>

    </div>
  );
}

export default FBaseProperties;
