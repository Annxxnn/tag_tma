import { useGameContract } from "../hooks/useGameContract";
import { useState, useEffect } from "react";

import {
  Card,
  FlexBoxCol
} from "./styled/styled";

export function PlayerAddress({ idx }: { idx: number }) {
  const { contract } = useGameContract();
  const [playerAddress, setPlayerAddress] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayerAddress() {
      if (!contract) return;
      const address = await contract.getPlayerAddress(idx);
      setPlayerAddress(address ? address.toString() : null);
    }
    fetchPlayerAddress();
  }, [contract, idx]);

  return (
    <Card>
      <FlexBoxCol>
        <h2>Player Address</h2>
        <div>{playerAddress || "Loading..."}</div>
      </FlexBoxCol>
    </Card>
  );
}