import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';

interface TaskListProps {

}

function TaskList({}: TaskListProps) {

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.statisticRewardRecords({ codes: [] });
    console.log(data, 'TaskList dataw8eiojsdflk ');

  });

  return (<div>

  </div>);
}

export default TaskList;
