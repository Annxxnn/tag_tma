import { GameContract } from "../contracts/gameContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";
import { useQuery } from "@tanstack/react-query";

export function useGameContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const TonGameContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new GameContract(
      Address.parse("EQDlMRlbubgz_Tfge5gnY-vJeQOjDJg_EmiAE4Uii_-Ggio-")
    );
    return client.open(contract) as OpenedContract<GameContract>;
  }, [client])

  // 注册玩家
  const registerPlayer = async (name: string) => {
    if (!TonGameContract || !sender) return;
    //获取provider
    await TonGameContract?.registerPlayer(sender, name);

  };

  // 请求buff
  const requestBuff = async (requestBuff: boolean) => {
    if (!TonGameContract || !sender) return;
    await TonGameContract.requestBuff(sender, requestBuff);
  };

  // 重置游戏
  const resetGame = async (battleId: bigint) => {
    if (!TonGameContract || !sender) return;
    await TonGameContract.resetGame(sender, battleId);
  };

  // 发起战斗
  const initiateBattle = async (opponent: Address) => {
    if (!TonGameContract || !sender) return;
    await TonGameContract.initiateBattle(sender, opponent);
  };

  // 输入战斗行动
  const enterBattleAction = async (action: string) => {
    if (!TonGameContract || !sender) return;
    await TonGameContract.enterBattleAction(sender, action);
  };

  // 获取玩家地址
  const getPlayerAddress = async (idx: number) => {
    if (!TonGameContract || !sender) return;
    return await TonGameContract.getPlayerAddress(idx);
  };

  // 获取排行榜
  const getLeaderboard = async () => {
    if (!TonGameContract || !sender) return;
    return await TonGameContract.getLeaderboard();
  };


  // 获取游戏开始时间
  const getGameStartTimestamp = async () => {
    if (!TonGameContract || !sender) return;
    return await TonGameContract.getGameStartTimestamp();
  };

  // 获取游戏结束时间
  const getGameEndTimestamp = async () => {
    if (!TonGameContract || !sender) return;
    return await TonGameContract.getGameEndTimestamp();
  };

  // 获取战斗ID计数器
  const getBattleIdCounter = async () => {
    if (!TonGameContract || !sender) return;
    return await TonGameContract.getBattleIdCounter();
  };

  // 获取玩家ID计数器

  const getPlayerIdCounter = async () => {
    if (!TonGameContract || !sender) return;
    return await TonGameContract.getPlayerIdCounter();
  };

  // 获取战斗信息
  const getBattle = async (idx: bigint) => {
    if (!TonGameContract) return null;
    return await TonGameContract.getBattle(idx);
  };

  // 获取玩家信息
  const getPlayer = async (playerAddress: Address) => {
    if (!TonGameContract) return null;
    return await TonGameContract.getPlayer(playerAddress);
  };

  // 获取初始属性
  const getInitialStats = async (playerAddress: Address) => {
    if (!TonGameContract) return null;
    return await TonGameContract.getInitialStats(playerAddress);
  };

  return {
    contract: TonGameContract,
    sender,
    registerPlayer,
    requestBuff,
    resetGame,
    initiateBattle,
    enterBattleAction,
    getPlayerAddress,
    getLeaderboard,
    getGameStartTimestamp,
    getGameEndTimestamp,
    getBattleIdCounter,
    getPlayerIdCounter,
    getBattle,
    getPlayer,
    getInitialStats
  };
}