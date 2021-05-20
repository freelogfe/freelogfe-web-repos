import styles from './index.less';
import {Button} from 'antd';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Button type="primary">1234</Button>
    </div>
  );
}
