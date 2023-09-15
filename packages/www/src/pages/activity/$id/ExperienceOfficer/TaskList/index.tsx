import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';

interface TaskListProps {

}

function TaskList({}: TaskListProps) {

  AHooks.useMount(async () => {
    await FServiceAPI.Activity.statisticRewardRecords({ codes: [] });
  });

  return (<div>__Template</div>);
}

export default TaskList;
