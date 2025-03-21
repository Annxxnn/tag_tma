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

export function RegisterPlayer() {
  const { connected } = useTonConnect();
  const { registerPlayer } = useGameContract();
  const [playerName, setPlayerName] = useState("");

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Register Player</h3>
          <FlexBoxRow>
            <b>Player Name</b>
            <Input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </FlexBoxRow>
          <Button
            disabled={!connected || !playerName}
            className={`Button ${connected && playerName ? "Active" : "Disabled"}`}
            onClick={() => {
              registerPlayer(playerName);
            }}
          >
            Register
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}