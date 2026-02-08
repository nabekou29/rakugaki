import * as React from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import { DialogProps } from '@material-ui/core/Dialog';
import { Signal } from '../../../../interfaces/entities';
import { sendSignal } from '../../../../actions/remocon';
import { useDispatch } from 'react-redux';

interface Props extends DialogProps {
  signal: Signal;
  onClose: () => void;
  onConfirm: () => void;
}
const SetTimerDialog: React.FC<Props> = ({
  signal,
  onClose,
  onConfirm,
  ...props
}) => {
  const dispatch = useDispatch();

  const onSendSignal = (minutes: number) => () => {
    dispatch(sendSignal.start({ signalId: signal.id, minutes }));
    onConfirm();
    onClose();
  };

  const ButtonGroupOptions = [[1, 3, 5], [10, 15, 30], [45, 60, 90]];

  return (
    <Dialog {...props}>
      <DialogTitle>タイマーをセット</DialogTitle>
      <DialogContent>
        {ButtonGroupOptions.map((options, rowIndex) => (
          <Box my={1} key={rowIndex}>
            <ButtonGroup>
              {options.map(min => (
                <Button key={min} onClick={onSendSignal(min)}>
                  <Box display="inline-flex" alignItems="flex-end">
                    <Box width={20}>{min}</Box>
                    <Box component="span" fontSize={8}>
                      MIN
                    </Box>
                  </Box>
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetTimerDialog;
