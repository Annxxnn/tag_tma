import { GameContract } from "../contracts/gameContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function useGameContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const TonGameContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new GameContract(
      Address.parse("EQDlMRlbubgz_Tfge5gnY-vJeQOjDJg_EmiAE4Uii_-Ggio-")
    );
    return client.open(contract) as OpenedContract<GameContract>;
  }, [client])

  return {
    contract: TonGameContract,
    sender
  };
}