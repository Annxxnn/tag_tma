import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../../hooks/useGameContract";
import { useTonConnect } from "../../hooks/useTonConnect";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
} from "../styled/styled";

export function RequestBuff() {
  const { connected } = useTonConnect();
  const { requestBuff } = useGameContract();

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Request Buff</h3>
          <FlexBoxRow>
            <Button
              disabled={!connected}
              className={`Button ${connected ? "Active" : "Disabled"}`}
              onClick={() => {
                requestBuff(true);
              }}
            >
              Request Buff
            </Button>
          </FlexBoxRow>
          <FlexBoxRow>
            <Button
              disabled={!connected}
              className={`Button ${connected ? "Active" : "Disabled"}`}
              onClick={() => {
                requestBuff(false);
              }}
            >
              Cancel Buff
            </Button>
          </FlexBoxRow>
        </FlexBoxCol>
      </Card>
    </div>
  );
}