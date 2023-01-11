import React from 'react';
import { useIntl } from 'react-intl';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { Layout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import PageHeader from '../PageHeader';
import offlineCloud from '../../../../assets/images/icon_offline-cloud.svg';

const OfflineLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout>
      <Main>
        <PageHeader isOnline={false} />
        <Flex
          width="100%"
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ paddingTop: '120px' }}
        >
          <Box paddingBottom={2}>
            <Typography textColor="neutral700" variant="alpha">
              {formatMessage({
                id: 'admin.pages.MarketPlacePage.offline.title',
                defaultMessage: 'You are offline',
              })}
            </Typography>
          </Box>
          <Box paddingBottom={6}>
            <Typography textColor="neutral700" variant="epsilon">
              {formatMessage({
                id: 'admin.pages.MarketPlacePage.offline.subtitle',
                defaultMessage: 'You need to be connected to the Internet to access Strapi Market.',
              })}
            </Typography>
          </Box>
          <img src={offlineCloud} alt="offline" style={{ width: '88px', height: '88px' }} />
        </Flex>
      </Main>
    </Layout>
  );
};

export default OfflineLayout;
