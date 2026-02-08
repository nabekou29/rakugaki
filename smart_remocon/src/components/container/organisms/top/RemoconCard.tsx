import * as React from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { DeleteOutline, MoreVert, SettingsRemote } from '@material-ui/icons';

import { CardProps } from '@material-ui/core/Card';
import ConfirmDialog from '../../../presentational/molecules/ConfirmDialog';
import Link from 'next/link';
import { Remocon } from '../../../../interfaces/entities';
import { discard } from '../../../../actions/top';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    cardContent: {
      height: '60%',
    },
    cardActions: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface Props extends CardProps {
  remocon: Remocon;
}

const RemoconCard: React.FC<Props> = ({ remocon, ...props }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const dispatch = useDispatch();

  // メニューを開く
  const onClickOpenMenuButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // メニューを閉じる
  const closeMenu = () => {
    setAnchorEl(null);
  };

  // 削除ボタン押下時
  const onClickDeleteButton = () => {
    setOpenDeleteDialog(true);
    closeMenu();
  };

  // ダイアログキャンセル時
  const onCancelDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // ダイアログ確認時
  const onConfirmDeleteDialog = () => {
    dispatch(discard.start({ id: remocon.id }));
    setOpenDeleteDialog(false);
  };

  return (
    <Card {...props}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" component="h1">
          {remocon.name}
        </Typography>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Link href={`/remocon?id=${remocon.id}`}>
          <Button variant="outlined" color="primary" size="small">
            <SettingsRemote />
            USE
          </Button>
        </Link>
        <IconButton onClick={onClickOpenMenuButton}>
          <MoreVert />
        </IconButton>
      </CardActions>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={onClickDeleteButton}>
          <DeleteOutline />
          削除
        </MenuItem>
      </Menu>
      <ConfirmDialog
        open={isOpenDeleteDialog}
        title="確認"
        content={`${remocon.name}を削除しますか？`}
        onClickCancel={onCancelDeleteDialog}
        onClickConfirm={onConfirmDeleteDialog}
      />
    </Card>
  );
};

export default RemoconCard;
