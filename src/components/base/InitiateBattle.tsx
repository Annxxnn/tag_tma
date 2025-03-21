import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../../hooks/useGameContract";
import { useTonConnect } from "../../hooks/useTonConnect";
import { useState } from "react";
import { Address } from "ton-core";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Input,
} from "../styled/styled";

export function InitiateBattle() {
  const { connected } = useTonConnect();
  const { initiateBattle } = useGameContract();
  const [opponentAddress, setOpponentAddress] = useState("");

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Initiate Battle</h3>
          <FlexBoxRow>
            <b>Opponent Address</b>
            <Input
              type="text"
              value={opponentAddress}
              onChange={(e) => setOpponentAddress(e.target.value)}
              placeholder="Enter opponent's address"
            />
          </FlexBoxRow>
          <Button
            disabled={!connected || !opponentAddress}
            className={`Button ${connected && opponentAddress ? "Active" : "Disabled"}`}
            onClick={() => {
              initiateBattle(Address.parse(opponentAddress));
            }}
          >
            Start Battle
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}