import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlexBoxCol, Card } from '../../components/styled/styled';

export const LeaderboardView = ({ styles }: { styles: any }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleViewLeaderboard = async () => {
    try {
      setLoading(true);
      // 创建一个新的排行榜页面并导航到该页面
      navigate('/leaderboard');
    } catch (error) {
      alert('查看排行榜失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.actionCard}>
      <FlexBoxCol>
        {loading ? (
          <p className={styles.loading}>处理中...</p>
        ) : (
          <button
            className={styles.battleButton}
            onClick={handleViewLeaderboard}
            disabled={loading}
          ><span className={styles.icon}>📊</span>
            查看排行榜
          </button>
        )}
      </FlexBoxCol>
    </Card>
  );
};