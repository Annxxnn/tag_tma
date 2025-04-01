import { useGameContract } from '../../hooks/useGameContract';
import { Address } from 'ton-core';
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🎉 战斗结束 🎉</h1>
      {isLoading ? (
        <WinnerCard>
          <p>加载中...</p>
        </WinnerCard>
      ) : error ? (
        <WinnerCard>
          <p style={{ color: 'red' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            重试
          </button>
        </WinnerCard>
      ) : (
        <WinnerCard>
          <h2>胜利者: {winnerName}</h2>
          <p>地址: {winnerAddress}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                loadWinnerInfo();
              }}
              style={{ padding: '0.5rem 1rem' }}
            >
              刷新
            </button>
            <button
              onClick={() => navigate('/player-Info')}
              style={{ padding: '0.5rem 1rem' }}
            >
              返回主页
            </button>
          </div>
        </WinnerCard>
      )}
    </div>
  );
};

const WinnerCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 700px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;