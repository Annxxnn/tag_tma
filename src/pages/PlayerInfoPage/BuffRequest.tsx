import { useState } from 'react';
import { useGameContract } from '../../hooks/useGameContract';
import { FlexBoxCol, Card } from '../../components/styled/styled';

export const BuffRequest = ({ styles, onBuffSuccess }: { styles: any, onBuffSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { requestBuff } = useGameContract();

  const handleRequestBuff = async () => {
    try {
      setLoading(true);
      await requestBuff(true);
      onBuffSuccess();
    } catch (error) {
      alert('增益请求失败: ' + (error instanceof Error ? error.message : '未知错误'));
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
            onClick={handleRequestBuff}
            disabled={loading}
          ><span className={styles.icon}>🐱‍🏍</span>
            请求增益
          </button>
        )}
      </FlexBoxCol>
    </Card>
  );
};