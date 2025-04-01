import { useEffect, useState } from 'react';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useGameContract } from '../../hooks/useGameContract';
import { Address } from 'ton-core';
import { Card, FlexBoxCol, FlexBoxRow } from '../../components/styled/styled';
import styles from './BattleInfoPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTonWallet } from "@tonconnect/ui-react";
interface BattlePlayerData {
  attack: bigint;
  defense: bigint;
  health: bigint;
  name: string;
  battleId: bigint;
}

export function BattleInfoPage() {
  const { getPlayer, getPlayerAddress, getBattle } = useGameContract();
  const { connected } = useTonConnect();
  const { address } = useParams();
  const [playerData, setPlayerData] = useState<BattlePlayerData | null>(null);
  const [opponentData, setOpponentData] = useState<BattlePlayerData | null>(null);
  const navigate = useNavigate();
  const Wallet = useTonWallet();
  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        if (!Wallet) return;

        // 从路由参数解析对战双方地址
        const opponentAddress = await getPlayerAddress(1);
        //获取当前玩家的地址
        const playerAddress = Address.parse(Wallet.account.address);
        const player = await getPlayer(playerAddress);
        console.log('我方信息:', player);
        const opponent = await getPlayer(opponentAddress);
        console.log('敌方信息:', opponent);
        setPlayerData({
          attack: BigInt(player!.attack),
          defense: BigInt(player!.defense),
          health: BigInt(player!.health),
          name: player!.name.toString(),
          battleId: player!.battleId
        });

        setOpponentData({
          attack: BigInt(opponent!.attack),
          defense: BigInt(opponent!.defense),
          health: BigInt(opponent!.health),
          name: opponent!.name.toString(),
          battleId: opponent!.battleId
        });
        const timer = setTimeout(() => {
          navigate('/battle');
        }, 10000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('获取战斗数据失败:', err);
      }
    };

    fetchBattleData();
  }, [Wallet, getPlayerAddress, navigate]);

  return (
    <FlexBoxCol className={styles.container}>
      <FlexBoxRow className={styles.battleColumns}>
        {/* 玩家信息列 */}
        <Card className={styles.playerCard}>
          <h3>{playerData?.name || '我方玩家'}</h3>
          <div className={styles.stats}>
            <p>攻击力: {playerData?.attack.toString()}</p>
            <p>防御力: {playerData?.defense.toString()}</p>
            <p>生命值: {playerData?.health.toString()}</p>
          </div>
        </Card>

        {/* 对手信息列 */}
        <Card className={styles.opponentCard}>
          <h3>{opponentData?.name || '敌方玩家'}</h3>
          <div className={styles.stats}>
            <p>攻击力: {opponentData?.attack.toString()}</p>
            <p>防御力: {opponentData?.defense.toString()}</p>
            <p>生命值: {opponentData?.health.toString()}</p>
          </div>
        </Card>
      </FlexBoxRow>
    </FlexBoxCol>
  );
}