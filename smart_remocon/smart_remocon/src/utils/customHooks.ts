import 'firebase/auth';

import * as React from 'react';
import * as firebase from 'firebase/app';

/** ログインユーザーの取得 */
export const useAuthUser = (
  onAuthStateChanged?: (user: firebase.User | null) => void
) => {
  const [user, setUser] = React.useState(firebase.auth().currentUser);
  if (user) {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      onAuthStateChanged && onAuthStateChanged(user);
    });
  }
  return user;
};
