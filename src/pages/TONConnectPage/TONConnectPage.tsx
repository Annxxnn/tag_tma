import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import {
  List,
  Placeholder,
  Text,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Page } from '../../components/Page.tsx';

import './TONConnectPage.css';

export const TONConnectPage: FC = () => {
  const wallet = useTonWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (wallet) {
      navigate('/register-player');
    }
  }, [wallet, navigate]);

  if (!wallet) {
    return (
      <Page>
        <Placeholder
          className="ton-connect-page__placeholder"
          header="TON Connect"
          description={
            <>
              <Text>
                To start the game, it is required to connect your
                wallet
              </Text>
              <TonConnectButton className="ton-connect-page__button" />
            </>
          }
        />
      </Page>
    );
  }

  // const {
  //   account: { chain, publicKey, address },
  //   device: {
  //     appName,
  //     appVersion,
  //     maxProtocolVersion,
  //     platform,
  //     features,
  //   },
  // } = wallet;

  return (
    <Page>
      <List>
        <TonConnectButton className="ton-connect-page__button-connected" />
        <div className="center-link">
          <p>enjoy your game!</p>
        </div>
      </List>
    </Page>
  );
};
