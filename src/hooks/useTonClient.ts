import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

export function useTonClient() {
  const { network } = useTonConnect();

  return {
    client: useAsyncInitialize(async () => {
      if (!network) {
        throw new Error('网络配置未初始化');
      }
      try {
        return new TonClient({
          endpoint: await getHttpEndpoint({
            network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
          })
        });
      } catch (error) {
        console.error('TON客户端初始化失败:', error);
        throw new Error('TON客户端初始化失败，请检查网络连接');
      }
    }, [network]),
  };
}
