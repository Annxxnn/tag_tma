import { Address } from 'ton-core';
import { useState, useEffect } from 'react';
import { useGameContract } from '../../hooks/useGameContract';
import { FlexBoxCol, Card } from '../../components/styled/styled';

export const BattleInitiation = ({ styles }: { styles: any }) => {
  const [opponentAddress, setOpponentAddress] = useState<Address | null>(null);
  const [loadingOpponent, setLoadingOpponent] = useState(true);
  const [opponentError, setOpponentError] = useState('');
  const { getPlayerAddress, initiateBattle } = useGameContract();

  useEffect(() => {
    const fetchOpponentAddress = async () => {
      const address = await getPlayerAddress(1);
      console.log('对手地址:', address);
      setOpponentAddress(address);
      setLoadingOpponent(false);
    };
    fetchOpponentAddress();
  }, [getPlayerAddress]);

  const handleInitiateBattle = async () => {
    if (opponentAddress != null) {
      await initiateBattle(opponentAddress);
      alert('战斗已成功发起！');
    }
  };

  return (
    <Card className={styles.actionCard}>
      <FlexBoxCol>
        {loadingOpponent ? (
          <p className={styles.loading}>加载对手信息中...</p>
        ) : opponentError ? (
          <p className={styles.error}>{opponentError}</p>
        ) : (
          <button
            className={styles.battleButton}
            onClick={handleInitiateBattle}
            disabled={!opponentAddress}
          >
            开始战斗
          </button>
        )}
      </FlexBoxCol>
    </Card>
  );
};