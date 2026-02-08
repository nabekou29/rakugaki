import 'firebase/auth';

import * as React from 'react';
import * as firebase from 'firebase/app';

import { AccountCircle, Home } from '@material-ui/icons';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import Link from 'next/link';
import { useAuthUser } from '../../../../utils/customHooks';

/** サイドメニュー */
const MenuList: React.FC = () => {
  const user = useAuthUser();

  const onLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  };

  const onLogout = async () => {
    await firebase.auth().signOut();
  };
  return (
    <>
      <List>
        <Link href="/">
          <ListItem button>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText>ホーム</ListItemText>
          </ListItem>
        </Link>
        <Divider />
        {user ? (
          <ListItem button onClick={onLogout}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText>ログアウト</ListItemText>
          </ListItem>
        ) : (
          <ListItem button onClick={onLogin}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText>ログイン</ListItemText>
          </ListItem>
        )}
      </List>
    </>
  );
};

export default MenuList;
