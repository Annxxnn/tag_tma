import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../../hooks/useGameContract";
import { useTonConnect } from "../../hooks/useTonConnect";
import { useState, useEffect } from "react";
import { notification } from "antd";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Input,
} from "../styled/styled";

export function RegisterPlayer() {
  const { connected, sender } = useTonConnect();
  const { registerPlayer } = useGameContract();
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);

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
            disabled={!connected || !playerName || loading}
            className={`Button ${connected && playerName && !loading ? "Active" : "Disabled"}`}
            onClick={async () => {
              setLoading(true);
              try {
                await registerPlayer(playerName);
                notification.success({ message: '注册成功' });
                setPlayerName('');
              } catch (error) {
                console.log('Registration error:', error);
              } finally {
                setLoading(false);
              }
            }}
          >
            Register
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}