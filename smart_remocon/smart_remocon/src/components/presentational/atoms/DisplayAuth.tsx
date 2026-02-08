import 'firebase/auth';

import * as React from 'react';
import * as firebase from 'firebase/app';

type Props = {
  login: boolean;
};

const DisplayAuth: React.FC<Props> = ({ children, login }) => {
  const user = firebase.auth().currentUser;

  return (user !== null) === login ? <>{children}</> : <></>;
};

export default DisplayAuth;
