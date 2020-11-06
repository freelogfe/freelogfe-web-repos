import * as React from 'react';
import styles from './index.less';
import {ChangeEvent} from "react";
import FInput from "@/components/FInput";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalSearchingModelState} from "@/models/connect";

interface SearchProps {
  dispatch: Dispatch;

  globalSearching: GlobalSearchingModelState;
}

function Search({dispatch, globalSearching}: SearchProps) {
  return (<FInput
    value={globalSearching.input}
    className={styles.FInput}
    // placeholder="Search in Freelog"
    size="small"
    theme="dark"
    onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch({
      type: 'globalSearching/onInputChange',
      payload: event.target.value,
    })}
    // disabled={true}
  />);
}

export default connect(({globalSearching}: ConnectState) => ({
  globalSearching: globalSearching,
}))(Search);
