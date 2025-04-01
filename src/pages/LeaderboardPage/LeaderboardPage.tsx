import { useState, useEffect } from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Card, FlexBoxCol } from '../../components/styled/styled';
import { useNavigate } from 'react-router-dom';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useGameContract } from '../../hooks/useGameContract';
import styles from './LeaderboardPage.module.css';
import { Address } from 'ton-core';

interface LeaderboardData {
  playerAddresses: Address[];
  playerNames: string[];
  battlesWon: bigint[];
  battlesLost: bigint[];
  mocksWon: bigint[];
}

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { connected } = useTonConnect();
  const { getPlayerIdCounter, getPlayerAddress, getPlayer, contract } = useGameContract();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
    playerAddresses: [],
    playerNames: [],
    battlesWon: [],
    battlesLost: [],
    mocksWon: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'battlesWon' | 'mocksWon'>('battlesWon');

  useEffect(() => {
    // 检查是否已连接，如果未连接则导航到连接页面
    if (!connected) {
      navigate('/ton-connect');
    } else {
      // 等待合约初始化完成后再获取数据
      const checkContractAndFetch = async () => {
        setLoading(true);
        let retryCount = 0;
        const maxRetries = 10;

        const waitForContract = async () => {
          if (contract) {
            console.log("合约已初始化，开始获取排行榜数据");
            await fetchLeaderboard();
          } else if (retryCount < maxRetries) {
            retryCount++;
            console.log(`等待合约初始化... (${retryCount}/${maxRetries})`);
            setTimeout(waitForContract, 1000); // 每秒检查一次
          }
        };

        await waitForContract();
      };

      checkContractAndFetch();
    }
  }, [connected, navigate, contract]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!contract) {
        throw new Error('合约未初始化，请稍后再试');
      }

      // 获取玩家总数
      const playerIdCounter = await getPlayerIdCounter();
      if (!playerIdCounter) {
        throw new Error('无法获取玩家数量');
      }

      console.log("玩家总数:", playerIdCounter);

      // 临时存储数据的数组
      const playerAddresses: Address[] = [];
      const playerNames: string[] = [];
      const battlesWon: bigint[] = [];
      const battlesLost: bigint[] = [];
      const mocksWon: bigint[] = [];

      // 获取每个玩家的数据 
      for (let i = 0; i <= playerIdCounter; i++) {
        try {
          // 获取玩家地址
          const address = await getPlayerAddress(i);
          console.log("获取到的玩家地址:", address.toString());
          if (!address) continue;

          // 获取玩家详细信息
          const player = await getPlayer(address);
          // console.log("获取到的玩家数据:", player);
          if (!player) continue;

          // 存储玩家数据
          playerAddresses.push(address);
          playerNames.push(player.name);
          battlesWon.push(player.battlesWon);
          battlesLost.push(player.battlesLost);
          mocksWon.push(player.mocksWon);
        } catch (playerErr) {
          console.error(`获取玩家 ${i} 数据失败:`, playerErr);
          // 继续处理下一个玩家，不中断整个过程
        }
      }

      console.log("获取到的玩家数据:", {
        playerAddresses,
        playerNames,
        battlesWon,
        battlesLost,
        mocksWon
      });

      // 确保数组长度一致
      const minLength = Math.min(
        playerAddresses.length,
        playerNames.length,
        battlesWon.length,
        battlesLost.length,
        mocksWon.length
      );

      // 创建排序后的数据
      const sortedData = {
        playerAddresses: playerAddresses.slice(0, minLength),
        playerNames: playerNames.slice(0, minLength),
        battlesWon: battlesWon.slice(0, minLength),
        battlesLost: battlesLost.slice(0, minLength),
        mocksWon: mocksWon.slice(0, minLength)
      };

      // 创建索引数组并根据选定的排序字段排序
      const indices = Array.from({ length: minLength }, (_, i) => i);
      indices.sort((a, b) => {
        const valueA = Number(sortBy === 'battlesWon' ? sortedData.battlesWon[a] : sortedData.mocksWon[a]);
        const valueB = Number(sortBy === 'battlesWon' ? sortedData.battlesWon[b] : sortedData.mocksWon[b]);
        return valueB - valueA; // 降序排列
      });

      // 根据排序后的索引重新排列数据
      setLeaderboardData({
        playerAddresses: indices.map(i => sortedData.playerAddresses[i]),
        playerNames: indices.map(i => sortedData.playerNames[i]),
        battlesWon: indices.map(i => sortedData.battlesWon[i]),
        battlesLost: indices.map(i => sortedData.battlesLost[i]),
        mocksWon: indices.map(i => sortedData.mocksWon[i])
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取排行榜数据失败');
      console.error(err);
      // 清空数据以防显示错误
      setLeaderboardData({
        playerAddresses: [],
        playerNames: [],
        battlesWon: [],
        battlesLost: [],
        mocksWon: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/player-Info');
  };

  const handleRefresh = () => {
    fetchLeaderboard();
  };

  const handleSortChange = (field: 'battlesWon' | 'mocksWon') => {
    setSortBy(field);
    // 重新排序数据
    const indices = Array.from({ length: leaderboardData.playerNames.length }, (_, i) => i);
    indices.sort((a, b) => {
      const valueA = Number(field === 'battlesWon' ? leaderboardData.battlesWon[a] : leaderboardData.mocksWon[a]);
      const valueB = Number(field === 'battlesWon' ? leaderboardData.battlesWon[b] : leaderboardData.mocksWon[b]);
      return valueB - valueA; // 降序排列
    });

    setLeaderboardData({
      playerAddresses: indices.map(i => leaderboardData.playerAddresses[i]),
      playerNames: indices.map(i => leaderboardData.playerNames[i]),
      battlesWon: indices.map(i => leaderboardData.battlesWon[i]),
      battlesLost: indices.map(i => leaderboardData.battlesLost[i]),
      mocksWon: indices.map(i => leaderboardData.mocksWon[i])
    });
  };

  return (
    <FlexBoxCol>
      <FlexBoxCol className={styles.container}>
        <h2>排行榜</h2>
        <div className={styles.buttonContainer}>
          <TonConnectButton />
          <button className={styles.refreshButton} onClick={handleRefresh} disabled={loading}>
            {loading ? '刷新中...' : '刷新数据'}
          </button>
        </div>

        <Card className={styles.infoCard}>
          <FlexBoxCol>
            <div className={styles.dataSourceToggle}>
              <h3>玩家排名</h3>
              <div className={styles.sortButtons}>
                <button
                  className={`${styles.sortButton} ${sortBy === 'battlesWon' ? styles.active : ''}`}
                  onClick={() => handleSortChange('battlesWon')}
                >
                  按胜场排序
                </button>
                <button
                  className={`${styles.sortButton} ${sortBy === 'mocksWon' ? styles.active : ''}`}
                  onClick={() => handleSortChange('mocksWon')}
                >
                  按嘲讽胜场排序
                </button>
              </div>
            </div>
            <div className={styles.leaderboardTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>排名</div>
                <div className={styles.tableCell}>玩家名称</div>
                <div className={styles.tableCell}>玩家地址</div>
                <div className={styles.tableCell}>胜利场次</div>
                <div className={styles.tableCell}>失败场次</div>
                <div className={styles.tableCell}>嘲讽胜场</div>
              </div>
              {loading ? (
                <div className={styles.loading}>加载中...</div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : leaderboardData.playerNames.length > 0 ? (
                leaderboardData.playerNames.map((name, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>{index + 1}</div>
                    <div className={styles.tableCell}>{name}</div>
                    <div className={`${styles.tableCell} ${styles.addressCell}`}>
                      {leaderboardData.playerAddresses[index].toString().slice(0, 6) + '...' + leaderboardData.playerAddresses[index].toString().slice(-4)}
                      <span title={leaderboardData.playerAddresses[index].toString()}></span>
                    </div>
                    <div className={styles.tableCell}>{leaderboardData.battlesWon[index].toString()}</div>
                    <div className={styles.tableCell}>{leaderboardData.battlesLost[index].toString()}</div>
                    <div className={styles.tableCell}>{leaderboardData.mocksWon[index].toString()}</div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>暂无数据</div>
              )}
            </div>
          </FlexBoxCol>
        </Card>
        <button className={styles.backButton} onClick={handleBack}>返回</button>
      </FlexBoxCol>
    </FlexBoxCol>
  );
}