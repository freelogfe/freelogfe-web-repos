import styles from './index.less';

interface HomePageProps {

}

function HomePage({}: HomePageProps) {
  return (<div>
    <div className={styles.banner0}>
      <span className={styles.banner0White}>3000元现金奖励等你赢取！内测期间参与</span>
      <a className={styles.banner0Red}>资源创作大赛</a>
      <span className={styles.banner0White}>，最低可领15元现金奖励，参与排名更有机会赢取3000元现金奖励！</span>
    </div>
    <div className={styles.banner1}>

    </div>

    <div className={styles.banner2}>

    </div>
    <div className={styles.banner3}>

    </div>
    <div className={styles.banner4}>

    </div>

  </div>);
}

export default HomePage;
