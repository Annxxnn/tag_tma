import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../../hooks/useGameContract";
import { useTonConnect } from "../../hooks/useTonConnect";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Address } from "ton-core";
import {
  Card,
  FlexBoxCol,
} from "../../components/styled/styled";
import { useTonWallet } from "@tonconnect/ui-react";
import styles from './PlayerInfoPage.module.css';
import { BattleInitiation } from './BattleInitiation';
import { BuffRequest } from './BuffRequest';
import { LeaderboardView } from './LeaderboardView';
// 在文件顶部添加接口定义
interface PlayerData {
  id: bigint;
  health: bigint;
  attack: bigint;
  defense: bigint;
  battlesWon: bigint;
  battlesLost: bigint;
  mocksWon: bigint;
  lastBuffTime: bigint;
  name: string;
  battleId: bigint;
}

export function PlayerInfoPage() {
  const navigate = useNavigate();
  const { connected, wallet } = useTonConnect();
  const { getPlayer } = useGameContract();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const Wallet = useTonWallet();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (!connected) {
      navigate('/ton-connect');
      return;
    } else if (!playerData) { // 仅当没有数据时获取
      const fetchPlayerData = async () => {
        try {
          if (Wallet != null && isMounted) {
            const playerAddress = Address.parse(Wallet.account.address);
            const data = await getPlayer(playerAddress);

            if (data != null && isMounted) {
              const formattedData: PlayerData = {
                id: BigInt(data.id?.toString() || '0'),
                health: BigInt(data.health?.toString() || '0'),
                attack: BigInt(data.attack?.toString() || '0'),
                defense: BigInt(data.defense?.toString() || '0'),
                battlesWon: BigInt(data.battlesWon?.toString() || '0'),
                battlesLost: BigInt(data.battlesLost?.toString() || '0'),
                mocksWon: BigInt(data.mocksWon?.toString() || '0'),
                lastBuffTime: BigInt(data.lastBuffTime?.toString() || '0'),
                name: data.name?.toString() || '未知玩家',
                battleId: BigInt(data.battleId?.toString() || '0')
              };
              setPlayerData(formattedData);
              setLoading(false);
            }
          }
        } catch (err) {
          if (isMounted) {
            console.error('获取玩家信息失败:', err);
            setError('获取玩家信息失败，请确保您已注册');
            setLoading(false);
          }
        }
      };

      // 添加请求超时处理
      const timeoutId = setTimeout(() => {
        fetchPlayerData();
      }, 1000);

      // 清理函数
      return () => {
        isMounted = false;
        controller.abort();
        clearTimeout(timeoutId);
      };
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [connected, navigate, getPlayer]); // 移除不必要依赖

  if (loading) {
    return (
      <FlexBoxCol>
        <FlexBoxCol className={styles.container}>
          <div className={styles.buttonContainer}>
            <TonConnectButton />
          </div>
          <div className={styles.mainContent}>
            <Card className={styles.infoCard}>
              <FlexBoxCol>
                <h3>玩家信息</h3>
                <div className={styles.infoRow}><span className={styles.icon}>👤</span><p>名称: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>❤️</span><p>生命值: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>⚔️</span><p>攻击力: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>🛡️</span><p>防御力: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>🏆</span><p>胜利场次: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>💀</span><p>失败场次: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>⏱️</span><p>上次增益时间: 加载中...</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>⚔️</span><p>战斗ID: 加载中...</p></div>
              </FlexBoxCol>
            </Card>
          </div>
        </FlexBoxCol>
      </FlexBoxCol>
    );
  }

  if (error) {
    return (
      <FlexBoxCol>
        <FlexBoxCol className={styles.container}>
          <h2>玩家信息</h2>
          <div className={styles.buttonContainer}>
            <TonConnectButton />
          </div>
          <Card className={styles.infoCard}>
            <p className={styles.error}>{error}</p>
          </Card>
        </FlexBoxCol>
      </FlexBoxCol>

    );
  }

  return (
    <FlexBoxCol>
      <FlexBoxCol className={styles.container}>
        <div className={styles.buttonContainer}>
          <TonConnectButton />
          <button
            className={styles.refreshButton}
            style={{ marginTop: '20px' }}
            onClick={async () => {
              setPlayerData(null);
              setError('');
              setLoading(true);
            }}
          >
            刷新
          </button>
        </div>

        <div className={styles.mainContent}>
          {wallet && playerData && (
            <Card className={styles.infoCard}>
              <FlexBoxCol>
                <h3>玩家信息</h3>
                <div className={styles.infoRow}><span className={styles.icon}>👤</span><p>名称: {playerData.name}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>❤️</span><p>生命值: {playerData.health.toString()}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>⚔️</span><p>攻击力: {playerData.attack.toString()}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>🛡️</span><p>防御力: {playerData.defense.toString()}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>🏆</span><p>胜利场次: {playerData.battlesWon.toString()}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>💀</span><p>失败场次: {playerData.battlesLost.toString()}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>⏱️</span><p>上次增益时间: {Number(playerData.lastBuffTime) === 0 ? null : new Date(Number(playerData.lastBuffTime) * 1000).toLocaleString()}</p></div>
                <div className={styles.infoRow}><span className={styles.icon}>⚔️</span><p>战斗ID: {playerData.battleId.toString()}</p></div>
              </FlexBoxCol>
            </Card>
          )}

          <div className={styles.actionPanel}>
            {/* 战斗按钮组件 */}
            <BattleInitiation styles={styles} />
            {/* 请求增益按钮组件 */}
            <BuffRequest styles={styles} onBuffSuccess={() => {
              setPlayerData(null);
              setLoading(true);
            }} />
            <LeaderboardView styles={styles} />
          </div>
        </div>
      </FlexBoxCol>
    </FlexBoxCol>
  );
}