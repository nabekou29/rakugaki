import * as React from 'react';

import { Box } from '@material-ui/core';
import Head from 'next/head';
import Loading from '../../presentational/molecules/Loading';
import MyAppBar from '../organisms/common/AppBar';

type Props = {
  title?: string;
  loading?: boolean;
};

/** ページのレイアウト */
const Layout: React.FC<Props> = ({
  children,
  title = 'This is the default title',
  loading = false,
}) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <header>
      <MyAppBar />
    </header>
    <Loading open={loading}></Loading>
    <Box pt={7}>{children}</Box>
  </>
);

export default Layout;
