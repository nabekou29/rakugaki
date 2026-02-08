import * as React from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { SettingsRemote, Timer } from '@material-ui/icons';

import { CardProps } from '@material-ui/core/Card';
import SetTimerDialog from './SetTimerDialog';
import { Signal } from '../../../../interfaces/entities';
import SuccessSnackbarContent from '../../../presentational/molecules/SuccessSnackbarContent';
import { sendSignal } from '../../../../actions/remocon';
import { useDispatch } from 'react-redux';

interface Props extends CardProps {
  signal: Signal;
}

const SignalCard: React.FC<Props> = ({ signal, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const [openTimerDialog, setOpenTimerDialog] = React.useState(false);
  const dispatch = useDispatch();

  const onSendSignal = () => {
    setOpen(false);
    dispatch(sendSignal.start({ signalId: signal.id }));
    setTimeout(() => setOpen(true), 200);
  };

  const onOpenTimerDialog = () => {
    setOpenTimerDialog(true);
  };

  const onCloseTimerDialog = () => {
    setOpenTimerDialog(false);
  };

  const onConfirmTimerDialog = () => {
    setOpen(false);
    setTimeout(() => setOpen(true), 200);
  };

  const onCloseMessage = () => {
    setOpen(false);
  };

  return (
    <Card {...props}>
      <Box p={1} display="flex">
        <Box flexGrow={1}>
          <Typography variant="h6" noWrap>
            {signal.name}
          </Typography>
        </Box>
        <ButtonGroup size="small">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onSendSignal}
          >
            <SettingsRemote />
            SEND
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onOpenTimerDialog}
          >
            <Timer />
            TIMER
          </Button>
          <SetTimerDialog
            signal={signal}
            onClose={onCloseTimerDialog}
            onConfirm={onConfirmTimerDialog}
            open={openTimerDialog}
          ></SetTimerDialog>
        </ButtonGroup>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={4000}
          onClose={onCloseMessage}
        >
          <SuccessSnackbarContent onClose={onCloseMessage} />
        </Snackbar>
      </Box>
    </Card>
  );
};

export default SignalCard;
