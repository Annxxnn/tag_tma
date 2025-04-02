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
// 在文件顶部添加样式导入
import styles from './RegisterPlayerPage.module.css';
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
    <FlexBoxCol className={styles.container}>
      <div className={styles.buttonContainer}>
        <TonConnectButton />
      </div>
      <div className={styles.mainContent}>
        <Card className={styles.infoCard}>
          <FlexBoxCol>
            <div className={styles.gameHeader}>
              <p className={styles.description}>
                欢迎来到奇幻游戏世界！🎊<br />
                在这里，你将开启一段史诗般的冒险旅程。🎢<br />
                首先，请为自己取一个独特的名字吧！🚩<br />
                然后，点击“开始冒险”按钮，进入游戏世界！🚀
              </p>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputContainer}>
                <span className={styles.inputIcon}>✏️</span>
                <Input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder=" 请输入您的独特的名称吧！"
                  className={styles.funnyInput}
                  style={{ width: '95%', paddingLeft: '40px' }}
                />
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <Button
                disabled={!connected || !playerName || loading}
                className={`${styles.button} ${connected && playerName && !loading ? styles.Active : styles.Disabled}`}
                onClick={async () => {
                  if (!Wallet?.account?.address) return;

                  setLoading(true);
                  try {
                    await registerPlayer(playerName);
                    const updatedPlayers = [...registeredPlayers, Wallet.account.address];
                    setRegisteredPlayers(updatedPlayers);
                    localStorage.setItem('registeredPlayers', JSON.stringify(updatedPlayers));
                    setPlayerName('');
                    navigate('/player-Info');
                  } catch (error) {
                    console.log('Registration error:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                开始冒险吧！
              </Button>
            </div>
          </FlexBoxCol>
        </Card>
      </div>
    </FlexBoxCol>
  );
}