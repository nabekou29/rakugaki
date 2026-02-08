import 'firebase/auth';

import * as React from 'react';
import * as firebase from 'firebase/app';

import App from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import Router from 'next/router';
import { Store } from 'redux';
import { ThemeProvider } from '@material-ui/styles';
import configureStore from '../store';
import theme from '../theme';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';

class MyApp extends App<{ store: Store }> {
  componentDidMount() {
    if (!firebase.auth().currentUser) {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider);
        }
      });
    }

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </>
    );
  }
}

export default withRedux(configureStore)(withReduxSaga(MyApp));
