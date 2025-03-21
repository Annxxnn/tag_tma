import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../../hooks/useGameContract";
import { useTonConnect } from "../../hooks/useTonConnect";
import { useState } from "react";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Input,
} from "../styled/styled";

export function BattleAction() {
  const { connected } = useTonConnect();
  const { enterBattleAction } = useGameContract();
  const [action, setAction] = useState("");

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Battle Action</h3>
          <FlexBoxRow>
            <b>Action</b>
            <Input
              type="string"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Enter action"
            />
          </FlexBoxRow>
          <Button
            disabled={!connected || !action}
            className={`Button ${connected && action ? "Active" : "Disabled"}`}
            onClick={() => {
              enterBattleAction(action);
            }}
          >
            Submit Action
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}