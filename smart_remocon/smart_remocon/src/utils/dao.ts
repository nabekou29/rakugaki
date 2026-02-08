import * as firebase from 'firebase/app';

import { Remocon, Signal } from '../interfaces/entities';

interface Dao<T> {
  encode: (doc: firebase.firestore.DocumentSnapshot) => T;
  decode: (data: T) => {};
}

class SignalDao implements Dao<Signal> {
  encode(doc: firebase.firestore.DocumentSnapshot): Signal {
    const data = doc.data() || {};
    return {
      id: doc.id,
      name: data.name,
      remoconId: data.remocon_id,
    };
  }

  decode(data: Signal): {} {
    return {
      ...data,
    };
  }
}
export const signalDao = new SignalDao();

class RemoconDao implements Dao<Remocon> {
  encode(doc: firebase.firestore.DocumentSnapshot): Remocon {
    const data = doc.data() || {};
    return {
      id: doc.id,
      name: data.name,
    };
  }

  decode(data: Remocon): {} {
    return {
      ...data,
    };
  }
}
export const remoconDao = new RemoconDao();
