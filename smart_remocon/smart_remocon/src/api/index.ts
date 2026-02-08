import 'firebase/firestore';
import 'firebase/database';

import * as firebase from 'firebase/app';

import { Remocon, Signal } from '../interfaces/entities';
import { remoconDao, signalDao } from '../utils/dao';

import firebaseConfig from '../firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

/**
 * 指定分後に信号を送信します
 * @param signalId 信号ID
 * @param minutes 何分後か
 */
export const sendSignal = async (
  signalId: string,
  minutes = 0
): Promise<any> => {
  const data = {
    signal_id: signalId,
    minutes,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  };
  return await firebase
    .database()
    .ref('send_signal')
    .set({ data });
};

/** リモコンの作成 */
export const createRemocon = async (name: string): Promise<Remocon> => {
  const data = {
    name,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const doc = await firebase
    .firestore()
    .collection('remocon')
    .add(data);
  return {
    ...data,
    id: doc.id,
  };
};

/** リモコンの削除 */
export const deleteRemocon = async (id: string): Promise<void> => {
  await firebase
    .firestore()
    .collection('remocon')
    .doc(id)
    .delete();

  const signalSnapshot = await firebase
    .firestore()
    .collection('signal')
    .where('remocon_id', '==', id)
    .get();

  signalSnapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
    doc.ref.delete();
  });
};

/** リモコンと信号の一覧を取得する */
export const findRemoconAndSignals = async (
  id: string
): Promise<{
  remocon: Remocon | null;
  signals: Signal[];
}> => {
  let remocon: Remocon | null = null;
  const signals = new Array<Signal>();

  const remoconDoc = await firebase
    .firestore()
    .collection('remocon')
    .doc(id)
    .get();
  if (remoconDoc.exists) {
    remoconDoc.data();
    remocon = remoconDao.encode(remoconDoc);
  }

  if (!remocon) {
    throw new Error();
  }
  const signalSnapshot = await firebase
    .firestore()
    .collection('signal')
    .where('remocon_id', '==', id)
    .orderBy('timestamp')
    .get();

  signalSnapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
    signals.push(signalDao.encode(doc));
  });

  return { remocon, signals };
};

/** リモコンの一覧を取得する */
export const findAllRemocon = async (): Promise<Remocon[]> => {
  const snapshot = await firebase
    .firestore()
    .collection('remocon')
    .orderBy('timestamp')
    .get();

  const result = new Array<Remocon>();
  snapshot.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
    result.push(remoconDao.encode(doc));
  });
  return result;
};

/** 信号の作成 */
export const createSignal = async (
  remoconId: string,
  name: string,
  code: number[]
): Promise<Signal> => {
  const data = {
    remocon_id: remoconId,
    name,
    code,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const doc = await firebase
    .firestore()
    .collection('signal')
    .add(data);
  return {
    id: doc.id,
    remoconId,
    name,
  };
};

/** 信号の削除 */
export const deleteSignal = async (id: string): Promise<void> => {
  await firebase
    .firestore()
    .collection('signal')
    .doc(id)
    .delete();
};

/** 信号を受け取ります */
export const receiveSignal = async (timeout = 10000): Promise<number[]> => {
  const data = {
    timeout,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  };
  await firebase
    .database()
    .ref('receive_new_signal')
    .set({ data });

  return new Promise(async (resolve, reject) => {
    const ref = firebase.database().ref('received_signal');
    ref.off('child_changed');

    await ref.on(
      'child_changed',
      (snapshot: firebase.database.DataSnapshot | null) => {
        if (!snapshot) {
          return;
        }
        const data = snapshot.val();
        resolve(data.code as number[]);
      }
    );

    setTimeout(() => {
      ref.off('child_changed');
      reject(new Error('timeout'));
    }, timeout);
  });
};
