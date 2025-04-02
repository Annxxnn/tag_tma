import { useGameContract } from '../../hooks/useGameContract';
import { Address } from 'ton-core';
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WinnerPage.module.css';
import { TonConnectButton } from "@tonconnect/ui-react";
export const WinnerPage = () => {
  const { getBattle, getPlayer, getBattleIdCounter } = useGameContract();
  const [winnerAddress, setWinnerAddress] = useState<string>('');
  const [winnerName, setWinnerName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const wallet = useTonWallet();

  const loadWinnerInfo = async () => {
    let isMounted = true;
    try {
      const battleIdCounter = await getBattleIdCounter();
      if (battleIdCounter !== undefined && isMounted) {
        const battle = await getBattle(BigInt(battleIdCounter));
        if (!battle) {
          setError('未找到战斗信息');
          return;
        }
        const winnerAddr = battle.winner.toString();
        setWinnerAddress(winnerAddr);
        const winner = await getPlayer(Address.parse(winnerAddr));
        setWinnerName(winner?.name.toString() || '未知玩家');
      }
    } catch (err) {
      console.error('获取胜利者信息失败:', err);
      setError('获取胜利者信息失败，请重试');
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadWinnerInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  loadWinnerInfo();

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <TonConnectButton />

      </div>
      {isLoading ? (
        <div className={styles.infoCard}>
          <h1 style={{ textAlign: 'center' }}>🎉 战斗结束 🎉</h1>
          <p>加载中...</p>
        </div>
      ) : error ? (
        <div className={styles.infoCard}>
          <h1 style={{ textAlign: 'center' }}>🎉 战斗结束 🎉</h1>
          <p className={styles.error}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.refreshButton}
          >
            重试
          </button>
        </div>
      ) : (
        <div className={styles.infoCard}>
          <h1 style={{ textAlign: 'center', color: '#666' }}>🎉 战斗结束 🎉</h1>
          <h2 style={{ textAlign: 'center' }}>胜利者: {winnerName}</h2>
          <p style={{ textAlign: 'center' }}>地址: {winnerAddress}</p>
          <p style={{ fontStyle: 'italic', color: '#666', margin: '1rem 0', textAlign: 'center', fontSize: '2.5rem' }}>
            🎉 {winnerName} 展现了非凡的实力，成为了这场史诗级战斗的最终赢家！🎉
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '10rem' }}>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                loadWinnerInfo();
              }}
              className={styles.refreshButton}
            >
              刷新
            </button>
            <button
              onClick={() => navigate('/player-Info')}
              className={styles.refreshButton}
            >
              返回主页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};