import * as React from 'react';

import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';

import Link from 'next/link';
import MenuButton from './MenuButton';

/** AppBar */
const MyAppBar: React.FC = () => {
  return (
    <AppBar>
      <Toolbar>
        <Box flexGrow={1}>
          <Link href="/">
            <Typography variant="h6" color="inherit" noWrap>
              すまりも！
            </Typography>
          </Link>
        </Box>
        <MenuButton />
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
