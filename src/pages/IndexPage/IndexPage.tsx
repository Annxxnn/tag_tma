import { Cell, Image, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '../../components/Link/Link.tsx';
import { Page } from '../../components/Page.tsx';

import tonSvg from './ton.svg';
//控制主界面，主界面展示什么东西在这里写
export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <div className="index-page__container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <List>
          <Link to="/ton-connect">
            <Cell
              className="index-page__cell"
              before={<Image src={tonSvg} style={{ backgroundColor: '#007AFF' }} />}
              subtitle="Connect your TON wallet"
            >
              TON Connect
            </Cell>
          </Link>
        </List>
      </div>
    </Page>
  );
};
