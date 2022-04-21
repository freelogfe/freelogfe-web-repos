import styles from './index.less';
import { FRectBtn } from '@/components/FButton';

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
      <div className={styles.banner1Content}>
        <div style={{ height: 100 }} />
        <h1 className={styles.banner1H1}>创作盛放之地</h1>
        <div style={{ height: 40 }} />
        <h2 className={styles.banner1H2}>免费专业的资源发行和运营平台</h2>
        <div style={{ height: 20 }} />
        <h3 className={styles.banner1H3}>支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类型资源</h3>
        <div style={{ height: 40 }} />
        <FRectBtn style={{ height: 60, fontSize: 22, padding: '0 50px', fontWeight: 400 }}>免费使用</FRectBtn>
      </div>
    </div>

    <div className={styles.banner2}>
      <div className={styles.banner2Content}>
        <div style={{ height: 30 }} />
        <h1 className={styles.banner2H1}>丰富的应用场景</h1>
        <div style={{ height: 20 }} />
        <h2 className={styles.banner2H2}>Freelog，基于「智能合约」的虚拟资源交易平台，支持资源授权的自动化和定制化，</h2>
        <h2 className={styles.banner2H2}>为资源的发行、再创作和推广提供多样化解决方案，助力资源作者和运营者快速变现。</h2>
        <div style={{ height: 20 }} />
        <h3 className={styles.banner2H3}>一键创建资源商店 • 收益独享 • 多渠道变现</h3>
        <div style={{ height: 60 }} />
      </div>
    </div>
    <div className={styles.banner3}>

    </div>
    <div className={styles.banner4}>

    </div>

  </div>);
}

export default HomePage;
