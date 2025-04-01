import { useGameContract } from '../../hooks/useGameContract';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { Address } from 'ton-core';
import { useTonWallet } from "@tonconnect/ui-react";
import { FlexBoxCol, FlexBoxRow } from '../../components/styled/styled';
import {
  PlayerArea,
  EnemyArea,
  BaseButton,
  ActionButton,
  MockButton,
  ErrorMessage,
  FloatingHelpButton,
  ProgressBarContainer,
  ProgressBarLabel,
  ProgressBar
} from './BattlePage.styles';
import { useNavigate } from 'react-router-dom';
import { HelpModal } from './HelpModal/HelpModal';

export const BattlePage = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();
  const handleOpenHelp = () => setShowHelpModal(true);
  const handleCloseHelp = () => setShowHelpModal(false);
  const { contract, enterBattleAction, getPlayer, getPlayerAddress, getBattle, resetGame, getBattleIdCounter } = useGameContract();
  const Wallet = useTonWallet();
  const [playerData, setPlayerData] = useState<{
    attack: bigint;
    defense: bigint;
    health: bigint;
  } | null>(null);
  const [opponentData, setOpponentData] = useState<{
    attack: bigint;
    defense: bigint;
    health: bigint;
    battleId: bigint;
  } | null>(null);
  const [opponentAddress, setOpponentAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<1 | 2>(1);

  // 添加超时相关状态
  const [battleStartTime, setBattleStartTime] = useState<number | null>(null);
  const [lastActionTime, setLastActionTime] = useState<number>(Date.now());
  // 修改超时引用的类型
  const [isResetting, setIsResetting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // 超时常量（毫秒）
  const TURN_TIMEOUT = 15 * 60 * 1000; // 15分钟回合超时
  const BATTLE_TIMEOUT = 15 * 60 * 1000; // 15分钟对局超时

  // 在进度条组件添加动画属性
  const [initialPlayerData, setInitialPlayerData] = useState<{
    attack: bigint;
    defense: bigint;
    health: bigint;
  } | null>(null);

  const [initialOpponentData, setInitialOpponentData] = useState<{
    attack: bigint;
    defense: bigint;
    health: bigint;
  } | null>(null);
  // 更新handleAction处理逻辑
  const getRandomAction = () => {
    const actions = ['Attack', 'Defend', 'Mock'];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  // 重置游戏的函数
  const handleResetGame = async () => {
    if (isResetting || !opponentData?.battleId) return;

    try {
      setIsResetting(true);
      setError('');
      console.log('游戏超时，正在重置...');
      await resetGame(opponentData.battleId);
      console.log('游戏已重置');
      navigate('/player-Info'); // 重置后返回玩家信息页
    } catch (err) {
      setError('重置游戏失败，请手动返回');
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  // 检查超时的函数
  const checkTimeout = () => {
    const now = Date.now();

    // 检查回合超时
    if (now - lastActionTime > TURN_TIMEOUT) {
      console.log('回合超时，重置游戏');
      handleResetGame();
      return;
    }

    // 检查对局总时长超时
    if (battleStartTime && now - battleStartTime > BATTLE_TIMEOUT) {
      console.log('对局超时，重置游戏');
      handleResetGame();
      return;
    }
  };
  //处理操作按钮
  const handleAction = async (actionType: string) => {
    try {
      //获取battle
      const battleIdCounter = BigInt(await getBattleIdCounter() || 0);
      const battle = await getBattle(battleIdCounter);
      console.log('battle:', battle);
      setIsLoading(true);
      setError('');
      console.log(`玩家正在执行操作: ${actionType}`);

      // 生成AI随机操作
      //模拟选择的过程，间隔10s
      setCurrentPlayerTurn(2);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiAction = getRandomAction();
      // const aiAction = 'Mock';
      console.log(`敌方玩家执行操作: ${aiAction}`);

      // 将玩家操作和AI操作同时传给合约
      await enterBattleAction(actionType, aiAction);
      setCurrentPlayerTurn(1);
      // 更新最后操作时间
      setLastActionTime(Date.now()); battle

      fetchPlayerData();

      await checkBattleResult();
    } catch (err) {
      setError('执行操作失败，请检查网络连接');
      console.error(err);
    } finally {
      setIsLoading(false);

      // 启动定时器，每隔5秒获取最新数据
      const dataFetchInterval = setInterval(fetchPlayerData, 5000);

      // 启动定时器，每隔10秒检查战斗结果
      const resultCheckInterval = setInterval(async () => {
        await checkBattleResult();
      }, 10000);

      // 在组件卸载时清除定时器
      return () => {
        clearInterval(dataFetchInterval);
        clearInterval(resultCheckInterval);
      };
    }
  };
  //获取玩家数据
  const fetchPlayerData = async () => {
    try {
      const playerAddress = Address.parse(Wallet!.account.address);
      if (!opponentAddress) {
        const addr = await getPlayerAddress(1);
        setOpponentAddress(addr);
      }

      const [newPlayer, newOpponent] = await Promise.all([
        getPlayer(playerAddress),
        getPlayer(opponentAddress || await getPlayerAddress(1))
      ]);
      setPlayerData({
        attack: BigInt(newPlayer!.attack),
        defense: BigInt(newPlayer!.defense),
        health: BigInt(newPlayer!.health)
      });

      setOpponentData({
        attack: BigInt(newOpponent!.attack),
        defense: BigInt(newOpponent!.defense),
        health: BigInt(newOpponent!.health),
        battleId: BigInt(newOpponent!.battleId)
      });
    } catch (err) {
      console.error('获取玩家数据失败:', err);
      if (err instanceof Error && err.message.includes('429')) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒后重试
        return fetchPlayerData();
      }
    }
  };
  //获取结果
  const checkBattleResult = async () => {
    try {
      //获取opponentAddress的battleId
      if (!opponentAddress) {
        const addr = await getPlayerAddress(1);
        setOpponentAddress(addr);
      }
      const opponent = await getPlayer(opponentAddress || await getPlayerAddress(1));
      console.log('battleId:', opponent!.battleId.toString());
      if (opponent?.battleId != 0n) {
        const battle = await getBattle(opponent!.battleId);
        if (battle!.winner.toString() !== 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {
          const winner = battle!.winner.toString();
          console.log('胜利者:', winner);

          navigate('/winner');
        }
      }
    } catch (err) {
      console.error('检查战斗结果失败:', err);
      if (err instanceof Error && err.message.includes('429')) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒后重试
        return checkBattleResult();
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!Wallet) return;

      try {
        if (!contract) {
          console.log("等待合约初始化...");
          return;
        }

        const fetchAndSetInitialData = async () => {
          const playerAddress = Address.parse(Wallet.account.address);
          if (!opponentAddress) {
            const addr = await getPlayerAddress(1);
            setOpponentAddress(addr);
          }
          const player = await getPlayer(playerAddress);
          const opponent = await getPlayer(opponentAddress || await getPlayerAddress(1));

          // 获取战斗信息，设置开始时间
          if (opponent?.battleId && !battleStartTime) {
            const battle = await getBattle(opponent.battleId);
            if (battle) {
              const startTimeMs = Number(battle.startTime) * 1000;
              setBattleStartTime(startTimeMs);
              console.log('战斗开始时间:', new Date(startTimeMs).toLocaleString());
            }
          }

          // 保存初始数据
          setInitialPlayerData({
            attack: BigInt(player!.attack),
            defense: BigInt(player!.defense),
            health: BigInt(player!.health)
          });

          setInitialOpponentData({
            attack: BigInt(opponent!.attack),
            defense: BigInt(opponent!.defense),
            health: BigInt(opponent!.health)
          });
          setPlayerData({
            attack: BigInt(player!.attack),
            defense: BigInt(player!.defense),
            health: BigInt(player!.health)
          });

          setOpponentData({
            attack: BigInt(opponent!.attack),
            defense: BigInt(opponent!.defense),
            health: BigInt(opponent!.health),
            battleId: BigInt(opponent!.battleId)
          });
        };

        if (!initialPlayerData || !initialOpponentData) {
          await fetchAndSetInitialData();
        }
      } catch (error) {
        console.error('获取玩家数据失败:', error);
      }
    };

    fetchData();

    // 修改超时检查定时器的设置和清除方式
    const timeoutId = window.setInterval(checkTimeout, 10000); // 每30秒检查一次超时
    timeoutRef.current = timeoutId;

    return () => {
      if (timeoutRef.current) {
        window.clearInterval(timeoutRef.current);
      }
    };
  }, [Wallet, getPlayer, getPlayerAddress, getBattle, battleStartTime]);




  return (
    <FlexBoxRow>
      <FloatingHelpButton onClick={handleOpenHelp}>
        战斗规则说明
      </FloatingHelpButton>
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 5,
        animation: 'fadeIn 0.5s'
      }}>
        {currentPlayerTurn === 2 ? '敌方回合中...' : `当前回合: 玩家${currentPlayerTurn}`}
      </div>
      {showHelpModal && <HelpModal onClose={handleCloseHelp} />}
      <PlayerArea>
        <h2>我方玩家</h2>
        <FlexBoxCol style={{ flex: 1 }}>
          <ProgressBarContainer>
            <ProgressBarLabel>生命值</ProgressBarLabel>
            <div style={{ marginBottom: 5, fontSize: '1.2em', fontWeight: 'bold' }}>{playerData?.health.toString()}</div>
            <ProgressBar value={initialPlayerData?.health ? Math.round(Number(playerData?.health || 0) / Number(initialPlayerData.health) * 100) : 100} />
            <ProgressBarLabel>攻击力</ProgressBarLabel>
            <div style={{ marginBottom: 5, fontSize: '1.2em', fontWeight: 'bold' }}>{playerData?.attack.toString()}</div>
            <ProgressBar value={initialPlayerData?.attack ? Math.round(Number(playerData?.attack || 0) / Number(initialPlayerData.attack) * 100) : 100} />
            <ProgressBarLabel>防御力</ProgressBarLabel>
            <div style={{ marginBottom: 5, fontSize: '1.2em', fontWeight: 'bold' }}>{playerData?.defense.toString()}</div>
            <ProgressBar value={initialPlayerData?.defense ? Math.round(Number(playerData?.defense || 0) / Number(initialPlayerData.defense) * 100) : 100} />
          </ProgressBarContainer>
        </FlexBoxCol>
        <div style={{ position: 'absolute', bottom: -150, left: 0, right: 0, display: 'flex', justifyContent: 'space-around' }}>
          <ActionButton
            onClick={() => handleAction('Attack')}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '攻击'}
          </ActionButton>
          <ActionButton
            onClick={() => handleAction('Defend')}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '防御'}
          </ActionButton>
          <MockButton
            onClick={() => handleAction('Mock')}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '嘲讽'}
          </MockButton>
        </div>
      </PlayerArea>

      <EnemyArea>
        <h2>敌方玩家</h2>
        <FlexBoxCol style={{ flex: 1 }}>
          <ProgressBarContainer>
            <ProgressBarLabel>生命值</ProgressBarLabel>
            <div style={{ marginBottom: 5, fontSize: '1.2em', fontWeight: 'bold' }}>{opponentData?.health.toString()}</div>
            <ProgressBar value={initialOpponentData?.health ? Math.round(Number(opponentData?.health || 0) / Number(initialOpponentData.health) * 100) : 100} />
            <ProgressBarLabel>攻击力</ProgressBarLabel>
            <div style={{ marginBottom: 5, fontSize: '1.2em', fontWeight: 'bold' }}>{opponentData?.attack.toString()}</div>
            <ProgressBar value={initialOpponentData?.attack ? Math.round(Number(opponentData?.attack || 0) / Number(initialOpponentData.attack) * 100) : 100} />
            <ProgressBarLabel>防御力</ProgressBarLabel>
            <div style={{ marginBottom: 5, fontSize: '1.2em', fontWeight: 'bold' }}>{opponentData?.defense.toString()}</div>
            <ProgressBar value={initialOpponentData?.defense ? Math.round(Number(opponentData?.defense || 0) / Number(initialOpponentData.defense) * 100) : 100} />
          </ProgressBarContainer>
        </FlexBoxCol>
        {/* <div style={{ position: 'absolute', bottom: -150, left: 0, right: 0, display: 'flex', justifyContent: 'space-around' }}>
          <ActionButton
            onClick={() => handleAction('Attack')}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '攻击'}
          </ActionButton>
          <ActionButton
            onClick={() => handleAction('Defend')}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '防御'}
          </ActionButton>
          <MockButton
            onClick={() => handleAction('Mock')}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : '嘲讽'}
          </MockButton>
        </div> */}
      </EnemyArea>
    </FlexBoxRow>
  );
};
