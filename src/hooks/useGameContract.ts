import { GameContract } from "../contracts/gameContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";




export function useGameContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();
  const TonGameContract = useAsyncInitialize(async () => {
    console.log("client", client);
    if (!client) throw new Error('TON客户端未初始化');
    const contract = new GameContract(
      //Address.parse("kQDlMRlbubgz_Tfge5gnY-vJeQOjDJg_EmiAE4Uii_-GgpG0")
      // Address.parse("EQBw1DQ_No9VG_l3Bhpz_fV7F6Psxc0uIbxUyKmQrIWICGkW")
      // Address.parse("EQBDL687xDH-wSbe1ck177bSraNmeQuryKYhwAb0jh3CLTKM")
      Address.parse("EQAkl4O3GAD_345tBHCWy7nUjlp85wX7sIS0KUoffJDLzJ6P")
    );
    console.log("ton客户端连接成功");
    return await client.open(contract) as OpenedContract<GameContract>;
  }, [client]);
  async function initializeProvider() {
    if (client && TonGameContract) {
      const code = (await client.getContractState(TonGameContract.address)).code;
      const data = (await client.getContractState(TonGameContract.address)).data;
      const provider = client.provider(TonGameContract.address, { code, data });
      console.log("provider", provider);
      return provider;
    }
  }



  // 注册玩家
  const registerPlayer = async (name: string) => {
    if (!TonGameContract) {
      throw new Error('合约未初始化');
    }
    if (!sender) {
      throw new Error('请先连接钱包');
    }
    try {
      //获取provider?: ContractProvider
      const provider = await initializeProvider();

      await TonGameContract.registerPlayer(sender, name, provider);
      console.log('注册玩家成功');
    } catch (error) {
      console.error('注册玩家失败:', error);
      throw error;
    }
  };

  // 请求buff
  const requestBuff = async (requestBuff: boolean) => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    const provider = await initializeProvider();
    await TonGameContract.requestBuff(sender, requestBuff, provider);
  };

  // 重置游戏
  const resetGame = async (battleId: bigint) => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    const provider = await initializeProvider();
    await TonGameContract.resetGame(sender, battleId, provider);
  };

  // 发起战斗
  const initiateBattle = async (opponent: Address) => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    const provider = await initializeProvider();
    await TonGameContract.initiateBattle(sender, opponent, provider);
  };

  // 输入战斗行动
  const enterBattleAction = async (player1Action: string, player2Action: string) => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    const provider = await initializeProvider();
    await TonGameContract.enterBattleAction(sender, player1Action, player2Action, provider);
  };
  //设置battleId
  const setBattleId = async (battleId: bigint) => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    const provider = await initializeProvider();
    await TonGameContract.setBattleId(sender, battleId, provider);
  };
  // 获取玩家地址
  const getPlayerAddress = async (idx: number) => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    return await TonGameContract.getPlayerAddress(idx);
  };

  // 获取排行榜
  const getLeaderboard = async () => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    const data = await TonGameContract.getLeaderboard();
    console.log("data", data);
    return data;
  };


  // 获取游戏开始时间
  const getGameStartTimestamp = async () => {
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
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
    if (!TonGameContract) throw new Error('合约未初始化');
    if (!sender) throw new Error('请先连接钱包');
    return await TonGameContract.getPlayerIdCounter();
  };

  // 获取战斗信息
  const getBattle = async (idx: bigint) => {
    if (!TonGameContract) return null;
    return await TonGameContract.getBattle(idx);
  };

  // 获取玩家信息
  const getPlayer = async (playerAddress: Address, retries = 3) => {
    if (!TonGameContract) return null;

    try {
      return await TonGameContract.getPlayer(playerAddress);
    } catch (error) {
      if (retries > 0) {
        console.log(`获取玩家数据失败，剩余重试次数: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await getPlayer(playerAddress, retries - 1);
      }
      console.error('获取玩家数据失败:', error);
      throw error;
    }
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
    setBattleId,
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