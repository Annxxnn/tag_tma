import { TonConnectButton } from "@tonconnect/ui-react";
import { useGameContract } from "../../hooks/useGameContract";
import { useTonConnect } from "../../hooks/useTonConnect";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Input,
} from "../../components/styled/styled";

export function RegisterPlayerPage() {
  const navigate = useNavigate();
  const { connected, wallet } = useTonConnect();
  const { registerPlayer } = useGameContract();
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected) {
      navigate('/ton-connect');
    } else {
      const registeredWallets = JSON.parse(localStorage.getItem('registeredWallets') || '[]');
      if (wallet && registeredWallets.includes(wallet)) {
        navigate('/player-Info');
      }
    }
  }, [connected, wallet, navigate]);

  return (
    <FlexBoxCol>
      <h2>玩家注册</h2>
      <div className="Container">
        <div style={{ position: 'absolute', right: 20, top: 20 }}>
          <TonConnectButton />
        </div>

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
                  //获取provider
                  await registerPlayer(playerName);
                  const updatedWallets = [...JSON.parse(localStorage.getItem('registeredWallets') || '[]'), wallet];
                  localStorage.setItem('registeredWallets', JSON.stringify(updatedWallets));
                  notification.success({ message: '注册成功' });
                  setPlayerName('');
                  navigate('/player-Info');
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
    </FlexBoxCol>
  );
}