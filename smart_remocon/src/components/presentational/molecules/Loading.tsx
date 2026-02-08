import * as React from 'react';

import {
  Box,
  CircularProgress,
  Fade,
  Modal,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import { ModalProps } from '@material-ui/core/Modal';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(1),
    },
  })
);

interface Props extends Omit<ModalProps, 'children'> {
  text?: string;
}

/** ローディング */
const Loading: React.FC<Props> = ({
  text = '読み込み中...',
  children,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Modal className={classes.modal} {...props}>
      <Fade in={props.open}>
        <div className={classes.paper}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box display="inline" m={1}>
              <CircularProgress />
            </Box>
            <span>{text}</span>
          </Box>
          {children}
        </div>
      </Fade>
    </Modal>
  );
};

export default Loading;
