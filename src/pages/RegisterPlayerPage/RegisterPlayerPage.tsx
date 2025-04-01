import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
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
import { Address } from "ton-core";
export function RegisterPlayerPage() {
  const navigate = useNavigate();
  const { connected, wallet } = useTonConnect();
  //保存已注册的玩家地址
  const [registeredPlayers, setRegisteredPlayers] = useState<string[]>(() => {
    const storedPlayers = localStorage.getItem('registeredPlayers');
    return storedPlayers ? JSON.parse(storedPlayers) : [];
  });
  const { registerPlayer, getPlayer } = useGameContract();
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const Wallet = useTonWallet();
  useEffect(() => {
    if (!connected) {
      navigate('/ton-connect');
    }
    //检查当前地址是否在已注册玩家列表中
    if (connected && Wallet?.account?.address) {
      const isRegistered = registeredPlayers.includes(Wallet.account.address);
      console.log('isRegistered:', isRegistered);
      console.log(registeredPlayers);
      if (isRegistered) {
        navigate('/player-Info');
      }
    }
  }, [connected, wallet, navigate]);


  return (
    <FlexBoxCol>
      <h2>玩家注册/玩家登录</h2>
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
                if (!Wallet?.account?.address) return;

                setLoading(true);
                try {
                  await registerPlayer(playerName);
                  // 添加当前钱包地址到已注册玩家列表并保存到localStorage
                  const updatedPlayers = [...registeredPlayers, Wallet.account.address];
                  setRegisteredPlayers(updatedPlayers);
                  localStorage.setItem('registeredPlayers', JSON.stringify(updatedPlayers));
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
              Register/login
            </Button>
          </FlexBoxCol>
        </Card>
      </div>
    </FlexBoxCol>
  );
}