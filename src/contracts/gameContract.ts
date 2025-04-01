import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  beginCell,
} from "ton-core";

export class GameContract implements Contract {
  readonly provider?: ContractProvider;

  constructor(readonly address: Address, provider?: ContractProvider) {
    this.provider = provider;
  }

  static createFromAddress(address: Address) {
    return new GameContract(address);
  }
  //获取合约code和data
  async registerPlayer(via: Sender, name: string, provider?: ContractProvider) {
    const p = provider || this.provider;
    console.log("p", p);
    if (!p) throw new Error("Provider is required");
    await p.internal(via, {
      value: "0.1", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3424225224, 32) // RegisterPlayer message op
        .storeStringRefTail(name) // 存储玩家名称
        .endCell()
    });
  }

  async requestBuff(via: Sender, requestBuff: boolean, provider?: ContractProvider) {
    const p = provider || this.provider;
    if (!p) throw new Error("Provider is required");
    await p.internal(via, {
      value: "0.1", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3785359400, 32) // RequestBuff message op
        .storeUint(requestBuff ? 1 : 0, 1) // 存储请求buff的布尔值
        .endCell()
    });
  }

  async resetGame(via: Sender, battleId: bigint, provider?: ContractProvider) {
    const p = provider || this.provider;
    if (!p) throw new Error("Provider is required");
    await p.internal(via, {
      value: "0.1", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3287988210, 32) // ResetGame message op
        .storeInt(battleId, 257) // 存储battleId
        .endCell()
    });
  }

  async initiateBattle(via: Sender, opponent: Address, provider?: ContractProvider) {
    const p = provider || this.provider;
    if (!p) throw new Error("Provider is required");
    await p.internal(via, {
      value: "0.1", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(110749952, 32) // InitiateBattle message op
        .storeAddress(opponent) // 存储对手地址
        .endCell()
    });
  }

  async enterBattleAction(via: Sender, player1Action: string, player2Action: string, provider?: ContractProvider) {
    const p = provider || this.provider;
    if (!p) throw new Error("Provider is required");
    await p.internal(via, {
      value: "0.1", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(2411416401, 32) // EnterBattleAction message op
        .storeStringRefTail(player1Action) // 存储玩家1行动
        .storeStringRefTail(player2Action) // 存储玩家2行动
        .endCell()
    });
  }
  async setBattleId(via: Sender, battleId: bigint, provider?: ContractProvider) {
    const p = provider || this.provider;
    if (!p) throw new Error("Provider is required");
    await p.internal(via, {
      value: "0.1", // 发送0.01 TON作为gas费
      bounce: true,
      body: beginCell()
        .storeUint(3352910604, 32) //setBattleId message op
        .storeInt(battleId, 257) // 存储battleId
        .endCell()
    })
  }
  async getPlayerAddress(provider: ContractProvider, idx: number): Promise<Address> {
    const result = await provider.get('playerAddress', [{
      type: 'int',
      value: BigInt(idx)
    }]);
    return result.stack.readAddress();
  }

  async getLeaderboard(provider: ContractProvider): Promise<{
    playerAddresses: Address[];
    playerNames: string[];
    battlesWon: bigint[];
    battlesLost: bigint[];
    mocksWon: bigint[];
  }> {
    const result = await provider.get('Leaderboard', []);
    console.log("result", result);
    const cell = result.stack.readCell();
    const slice = cell.beginParse();

    const playerAddresses: Address[] = [];
    const playerNames: string[] = [];
    const battlesWon: bigint[] = [];
    const battlesLost: bigint[] = [];
    const mocksWon: bigint[] = [];

    // 读取地址数组长度
    const length = 3;

    // 添加边界检查，确保长度有效
    if (length <= 0) {
      return {
        playerAddresses: [],
        playerNames: [],
        battlesWon: [],
        battlesLost: [],
        mocksWon: []
      };
    }

    // 读取地址数组
    for (let i = 0; i < length; i++) {
      playerAddresses.push(slice.loadAddress());
    }

    // 读取名称数组
    for (let i = 0; i < length; i++) {
      playerNames.push(slice.loadStringRefTail());
    }

    // 读取胜利场次数组
    for (let i = 0; i < length; i++) {
      battlesWon.push(BigInt(slice.loadUint(32)));
    }

    // 读取失败场次数组
    for (let i = 0; i < length; i++) {
      battlesLost.push(BigInt(slice.loadUint(32)));
    }

    // 读取嘲讽胜利场次数组
    for (let i = 0; i < length; i++) {
      mocksWon.push(BigInt(slice.loadUint(32)));
    }

    return {
      playerAddresses,
      playerNames,
      battlesWon,
      battlesLost,
      mocksWon
    };
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

  async getBattle(provider: ContractProvider, idx: bigint): Promise<{
    player1: Address;
    player2: Address;
    startTime: bigint;
    endTime: bigint;
    player1Action: string;
    player2Action: string;
    player1LastMoveIsMock: boolean;
    player2LastMoveIsMock: boolean;
    winner: Address;
  }> {
    const result = await provider.get('battle', [{
      type: 'int',
      value: idx
    }]);
    const stack = result.stack;

    return {
      player1: stack.readAddress(),
      player2: stack.readAddress(),
      startTime: BigInt(stack.readNumber()),
      endTime: BigInt(stack.readNumber()),
      player1Action: stack.readCell().beginParse().loadStringTail(),
      player2Action: stack.readCell().beginParse().loadStringTail(),
      player1LastMoveIsMock: stack.readBoolean(),
      player2LastMoveIsMock: stack.readBoolean(),
      winner: stack.readAddress(),
    };
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
    const stack = result.stack;

    return {
      id: BigInt(stack.readNumber()),
      health: BigInt(stack.readNumber()),
      attack: BigInt(stack.readNumber()),
      defense: BigInt(stack.readNumber()),
      battlesWon: BigInt(stack.readNumber()),
      battlesLost: BigInt(stack.readNumber()),
      mocksWon: BigInt(stack.readNumber()),
      lastBuffTime: BigInt(stack.readNumber()),
      name: stack.readCell().beginParse().loadStringTail(),
      battleId: BigInt(stack.readNumber())
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