import * as React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import { DialogProps } from '@material-ui/core/Dialog';

interface Props extends DialogProps {
  onClickCancel?: React.MouseEventHandler;
  onClickConfirm?: React.MouseEventHandler;
  title: string;
  content: React.ReactNode;
}

/** 確認ダイアログ */
const ConfirmDialog: React.FC<Props> = ({
  onClickCancel,
  onClickConfirm,
  title = 'title',
  content = 'contents',
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancel} color="primary">
          キャンセル
        </Button>
        <Button onClick={onClickConfirm} color="primary" autoFocus>
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
