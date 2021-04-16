import * as React from 'react';
import styles from './index.less';
import FMenu from "@/components/FMenu";
import {FCircleBtn, FCircleButton} from "@/components/FButton";
import FDropdown from "@/components/FDropdown";
import {router} from "umi";
import FUtil from "@/utils";

interface CreateProps {

}

const creatorOptions = [
  {
    text: '创建资源',
    value: '1'
  },
  {
    text: '创建节点',
    value: '2'
  },
];

function Create({}: CreateProps) {
  function onCreateClick(value: string) {
    // console.log(params, 'params');
    if (value === '1') {
      return router.push(FUtil.LinkTo.resourceCreator());
    }
    if (value === '2') {
      return router.push(FUtil.LinkTo.nodeCreator());
    }
  }

  return (<FDropdown overlay={<FMenu
    onClick={onCreateClick}
    options={creatorOptions}
  />}>
    {/*<a*/}
    {/*  className={styles.create}*/}
    {/*  // onClick={() => onCreateClick('1')}*/}
    {/*>*/}
    {/*  <FCircleButton/>*/}
    {/*</a>*/}
    <FCircleBtn/>
  </FDropdown>);
}

export default Create;
