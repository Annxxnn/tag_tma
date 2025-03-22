import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.css';

export function MainPage() {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      onClick={() => navigate('/register-player')}
    >
      <h1 className={styles.title}>
        <span className={styles.ton}>ton</span>
        <span className={styles.attack}>attack</span>
        <span className={styles.game}>game</span>
      </h1>
      <p className={styles.description}>点击任意位置开始</p>
    </div>
  );
}