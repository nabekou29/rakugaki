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
import { initialize, receiveSignal } from '../actions/remocon';
import { useDispatch, useSelector } from 'react-redux';

import { Add } from '@material-ui/icons';
import AddDialog from '../components/container/organisms/remocon/AddDialog';
import { AppState } from '../reducers';
import Layout from '../components/container/templates/Layout';
import Loading from '../components/presentational/molecules/Loading';
import SignalCard from '../components/container/organisms/remocon/SignalCard';
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

const RemoconPage: NextPage = () => {
  const classes = useStyles();
  const state = useSelector((state: AppState) => state.remocon);
  const dispatch = useDispatch();

  const onClickAddButton = () => {
    dispatch(receiveSignal.start());
  };

  return (
    <Layout title="Remocon" loading={state.isLoading}>
      <Container maxWidth="sm">
        <Fab
          className={classes.addButton}
          color="primary"
          onClick={onClickAddButton}
        >
          <Add />
        </Fab>
        <AddDialog></AddDialog>
        <GridList cellHeight={50} spacing={8} cols={1}>
          <GridListTile className={classes.listTitleTile} key="SubHeader">
            <Box display="flex" justifyContent="space-between">
              <Typography
                className={classes.listTitle}
                component="span"
                variant="h6"
                gutterBottom
              >
                {state.remocon ? state.remocon.name : ''}
              </Typography>
            </Box>
          </GridListTile>
          {state.signals.map(s => (
            <GridListTile key={s.id}>
              <SignalCard signal={s} />
            </GridListTile>
          ))}
        </GridList>
      </Container>
      <Loading open={state.isWaitingSignal}></Loading>
    </Layout>
  );
};

RemoconPage.getInitialProps = async (
  ctx: NextPageContext & { store: Store }
) => {
  if (typeof ctx.query.id !== 'string') {
    return {};
  }
  ctx.store.dispatch(initialize.start({ remoconId: ctx.query.id }));
  return {};
};

export default RemoconPage;
