import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  beginCell,
} from "ton-core";

export class GameContract implements Contract {
  constructor(readonly address: Address) { }

  static createFromAddress(address: Address) {
    return new GameContract(address);
  }

  async registerPlayer(provider: ContractProvider, via: Sender, name: string) {
    await provider.internal(via, {
      value: "0.01", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3424225224, 32) // RegisterPlayer message op
        .storeStringRefTail(name) // 存储玩家名称
        .endCell()
    });
  }

  async requestBuff(provider: ContractProvider, via: Sender, requestBuff: boolean) {
    await provider.internal(via, {
      value: "0.01", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3785359400, 32) // RequestBuff message op
        .storeUint(requestBuff ? 1 : 0, 1) // 存储请求buff的布尔值
        .endCell()
    });
  }

  async resetGame(provider: ContractProvider, via: Sender, battleId: number) {
    await provider.internal(via, {
      value: "0.01", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3287988210, 32) // ResetGame message op
        .storeInt(battleId, 257) // 存储battleId
        .endCell()
    });
  }

  async initiateBattle(provider: ContractProvider, via: Sender, opponent: Address) {
    await provider.internal(via, {
      value: "0.01", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(110749952, 32) // InitiateBattle message op
        .storeAddress(opponent) // 存储对手地址
        .endCell()
    });
  }

  async enterBattleAction(provider: ContractProvider, via: Sender, action: string) {
    await provider.internal(via, {
      value: "0.01", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(1042285330, 32) // EnterBattleAction message op
        .storeStringRefTail(action) // 存储玩家行动
        .endCell()
    });
  }

  async getPlayerAddress(provider: ContractProvider, idx: number): Promise<Address> {
    const result = await provider.get('playerAddress', [{
      type: 'int',
      value: BigInt(idx)
    }]);
    return result.stack.readAddress();
  }

  async getLeaderboard(provider: ContractProvider): Promise<any> {
    const result = await provider.get('Leaderboard', []);
    return result.stack.readCell();
  }

  async getGameStartTimestamp(provider: ContractProvider): Promise<number> {
    const result = await provider.get('gameStartTimestamp', []);
    return Number(result.stack.readNumber());
  }

  async getGameEndTimestamp(provider: ContractProvider): Promise<number> {
    const result = await provider.get('gameEndTimestamp', []);
    return Number(result.stack.readNumber());
  }

  async getBattleIdCounter(provider: ContractProvider): Promise<number> {
    const result = await provider.get('battleIdCounter', []);
    return Number(result.stack.readNumber());
  }

  async getPlayerIdCounter(provider: ContractProvider): Promise<number> {
    const result = await provider.get('playerIdCounter', []);
    return Number(result.stack.readNumber());
  }

  async getBattle(provider: ContractProvider, idx: number): Promise<any> {
    const result = await provider.get('battle', [{
      type: 'int',
      value: BigInt(idx)
    }]);
    return result.stack.readCell();
  }

  async getPlayer(provider: ContractProvider, playerAddress: Address): Promise<{
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
  }> {
    const result = await provider.get('player', [{
      type: "slice", cell: beginCell().storeAddress(playerAddress).endCell()
    }]);
    const cell = result.stack.readCell();
    // 解析Cell中的数据
    const slice = cell.beginParse();
    return {
      id: BigInt(slice.loadInt(32)),
      health: BigInt(slice.loadInt(32)),
      attack: BigInt(slice.loadInt(32)),
      defense: BigInt(slice.loadInt(32)),
      battlesWon: BigInt(slice.loadInt(32)),
      battlesLost: BigInt(slice.loadInt(32)),
      mocksWon: BigInt(slice.loadInt(32)),
      lastBuffTime: BigInt(slice.loadUint(32)),
      name: slice.loadStringTail(),
      battleId: BigInt(slice.loadInt(32))
    };
  }

  async getInitialStats(provider: ContractProvider, playerAddress: Address): Promise<{ health: bigint; attack: bigint; defense: bigint }> {
    const result = await provider.get('initialStats', [{
      type: "slice", cell: beginCell().storeAddress(playerAddress).endCell()
    }]);
    const cell = result.stack.readCell();
    // 解析Cell中的数据
    const slice = cell.beginParse();
    return {
      health: BigInt(slice.loadInt(32)),
      attack: BigInt(slice.loadInt(32)),
      defense: BigInt(slice.loadInt(32))
    };
  }

}