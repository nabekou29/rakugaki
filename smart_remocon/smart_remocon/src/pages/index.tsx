import * as React from 'react';

import {
  Box,
  Container,
  Fab,
  GridList,
  GridListTile,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { NextPage, NextPageContext } from 'next';
import { initialize, openAddDialog } from '../actions/top';
import { useDispatch, useSelector } from 'react-redux';

import { Add } from '@material-ui/icons';
import AddDialog from '../components/container/organisms/top/AddDialog';
import { AppState } from '../reducers';
import Layout from '../components/container/templates/Layout';
import RemoconCard from '../components/container/organisms/top/RemoconCard';
import { Store } from 'redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listTitleTile: {
      height: 'auto !important',
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: theme.zIndex.appBar,
    },
    listTitle: {
      margin: theme.spacing(2),
      alignSelf: 'flex-end',
    },
    card: {
      height: '100%',
    },
  })
);

const IndexPage: NextPage<{}> = () => {
  const classes = useStyles();
  const state = useSelector((app: AppState) => app.top);
  const dispatch = useDispatch();

  const onClickAddButton = () => {
    dispatch(openAddDialog());
  };

  return (
    <Layout title="Home" loading={state.isLoading}>
      <div>
        <Container maxWidth="sm">
          <Fab
            className={classes.addButton}
            color="primary"
            onClick={onClickAddButton}
          >
            <Add />
          </Fab>
          <AddDialog></AddDialog>
          <GridList cellHeight={140} spacing={8}>
            <GridListTile
              className={classes.listTitleTile}
              key="SubHeader"
              cols={2}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography
                  className={classes.listTitle}
                  component="span"
                  variant="h6"
                >
                  リモコン一覧
                </Typography>
              </Box>
            </GridListTile>
            {state.remocons.map(r => (
              <GridListTile key={r.id}>
                <RemoconCard remocon={r} className={classes.card}></RemoconCard>
              </GridListTile>
            ))}
          </GridList>
        </Container>
      </div>
    </Layout>
  );
};

IndexPage.getInitialProps = async (ctx: NextPageContext & { store: Store }) => {
  ctx.store.dispatch(initialize.start());
  return {};
};

export default IndexPage;
