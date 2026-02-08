import * as React from 'react';

import { Box, IconButton, SnackbarContent } from '@material-ui/core';
import { Close, Done } from '@material-ui/icons';

import { SnackbarContentProps } from '@material-ui/core/SnackbarContent';
import { green } from '@material-ui/core/colors';

interface Props extends SnackbarContentProps {
  onClose: () => void;
}
const SuccessSnackbarContent: React.FC<Props> = ({ onClose, ...props }) => {
  return (
    <SnackbarContent
      {...props}
      aria-describedby="client-snackbar"
      message={
        <Box
          id="client-snackbar"
          component="span"
          display="flex"
          alignItems="center"
        >
          <Done />
          送信しました
        </Box>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <Close />
        </IconButton>,
      ]}
      style={{
        backgroundColor: green[400],
      }}
    />
  );
};

export default SuccessSnackbarContent;
