import * as React from 'react';
import styles from './index.less';
import { FServiceAPI } from '@freelog/tools-lib';
import BoardCard1 from './_components/BoardCard1'
import BoardCard2 from './_components/BoardCard2'
import BoardCard3 from './_components/BoardCard3'

interface BoardCardProps {}

function BoardCard({}: BoardCardProps) {
  const [unfoldIndex, setUnfoldIndex] = React.useState<0 | 1 | 2>(0);
  const [datas, setDatas] = React.useState<any>([]);
  const getData = async () => {
    Promise.all([
      FServiceAPI.Activity.getBaseTaskInfo(),
      FServiceAPI.Activity.getResourceTaskInfo(),
      FServiceAPI.Activity.getNodeTaskInfo(),
    ]).then((res) => {
      setDatas(res.map((data) => data.data));
    });
  };
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.boards}>
      <BoardCard1
        unfold={unfoldIndex === 0}
        data={datas[0] || []}
        onMouseEnter={() => {
          setUnfoldIndex(0);
        }}
      />
      <BoardCard2
        data={datas[1] || []}
        unfold={unfoldIndex === 1}
        onMouseEnter={() => {
          setUnfoldIndex(1);
        }}
      />
      <BoardCard3
        data={datas[2] || []}
        unfold={unfoldIndex === 2}
        onMouseEnter={() => {
          setUnfoldIndex(2);
        }}
      />
    </div>
  );
}

export default BoardCard;

