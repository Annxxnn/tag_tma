import { openLink } from '@telegram-apps/sdk-react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import {
  Avatar,
  Cell,
  List,
  Navigation,
  Placeholder,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { Link } from 'react-router-dom';
import type { FC } from 'react';

import { DisplayData } from '../../components/DisplayData/DisplayData.tsx';
import { Page } from '../../components/Page.tsx';

import './TONConnectPage.css';

export const TONConnectPage: FC = () => {
  const wallet = useTonWallet();

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

  const {
    account: { chain, publicKey, address },
    device: {
      appName,
      appVersion,
      maxProtocolVersion,
      platform,
      features,
    },
  } = wallet;

  return (
    <Page>
      <List>
            <TonConnectButton className="ton-connect-page__button-connected"/>
            <div className="center-link">
              <p>enjoy your game!</p>
        <Link to="/register-player">
          <Cell
          >
            register player
          </Cell>
        </Link>
      </div>
      </List>
    </Page>
  );
};
