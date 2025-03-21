import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../hooks/useGameContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { useState } from "react";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Input,
} from "./styled/styled";

export function ResetGame() {
  const { connected } = useTonConnect();
  const { resetGame } = useGameContract();
  const [battleId, setBattleId] = useState("");

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Reset Game</h3>
          <FlexBoxRow>
            <b>Battle ID</b>
            <Input
              type="number"
              value={battleId}
              onChange={(e) => setBattleId(e.target.value)}
              placeholder="Enter battle ID"
            />
          </FlexBoxRow>
          <Button
            disabled={!connected || !battleId}
            className={`Button ${connected && battleId ? "Active" : "Disabled"}`}
            onClick={() => {
              resetGame(BigInt(battleId));
            }}
          >
            Reset Game
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}