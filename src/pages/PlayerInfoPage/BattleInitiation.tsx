import { Address } from 'ton-core';
import { useState, useEffect } from 'react';
import { useGameContract } from '../../hooks/useGameContract';
import { FlexBoxCol, Card } from '../../components/styled/styled';
import { useNavigate } from 'react-router-dom';
import { useTonWallet } from "@tonconnect/ui-react";
export const BattleInitiation = ({ styles }: { styles: any }) => {
  const [opponentAddress, setOpponentAddress] = useState<Address | null>(null);
  const [loadingOpponent, setLoadingOpponent] = useState(true);
  const [opponentError, setOpponentError] = useState('');
  const { getPlayerAddress, initiateBattle, getBattle, getPlayer, getBattleIdCounter } = useGameContract();
  const navigate = useNavigate();
  const Wallet = useTonWallet();
  useEffect(() => {
    const fetchOpponentAddress = async () => {
      try {
        const address = await getPlayerAddress(1);
        setOpponentAddress(address);
      } catch (error) {
        setOpponentError('获取对手地址失败，请重试');
        console.error('获取对手地址失败:', error);
      } finally {
        setLoadingOpponent(false);
      }
    };
    fetchOpponentAddress();
  }, [getPlayerAddress]);

  const handleInitiateBattle = async () => {
    if (opponentAddress != null) {
      try {
        //获取battleIdCounter
        const battleIdCounter = await getBattleIdCounter();
        console.log('battleIdCounter:', battleIdCounter!.toString());
        //获取opponentAddress的battleId
        const opponent = await getPlayer(opponentAddress);
        const battleId = opponent!.battleId;
        console.log('对手battleId:', battleId.toString());
        //获取当前玩家的地址
        const playerAddress = Address.parse(Wallet!.account.address);
        if (battleId == 0n) {
          await initiateBattle(opponentAddress);
          console.log('战斗发起成功');
          //设置battleId
          // await setBattleId(BigInt(battleId));
          // const player = await getPlayer(playerAddress);
          // const battleIdAfter = player!.battleId;
          // console.log('player 1的battleId:', battleIdAfter.toString());
          navigate(`/battle-Info/${encodeURIComponent(opponentAddress.toString())}`);
        } else {
          // await setBattleId(BigInt(battleId));
          const player = await getPlayer(playerAddress);
          console.log('我方信息:', player);
          const opponent = await getPlayer(opponentAddress);
          console.log('敌方信息:', opponent);
          const battleIdCounter = await getBattleIdCounter();
          console.log('battleIdCounter:', battleIdCounter!.toString());
          const battle = await getBattle(BigInt(battleIdCounter!));
          console.log('battle:', battle);
          navigate(`/battle-Info/${encodeURIComponent(opponentAddress.toString())}`);
        }
      } catch (error) {
        alert('战斗发起失败: ' + (error instanceof Error ? error.message : '未知错误'));
      }
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
          ><span className={styles.icon}>🤖</span>
            开始战斗
          </button>
        )}
      </FlexBoxCol>
    </Card>
  );
};