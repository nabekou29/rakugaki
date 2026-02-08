import * as admin from 'firebase-admin';

import dayjs from 'dayjs';
import { execSync } from 'child_process';
import fs from 'fs';
import schedule from 'node-schedule';

const CWD = process.cwd();
/** コード保存用のファイル名 */
const CODE_FILE = 'code.json';
/** 一時保存用のファイル名 */
const TMP_CODE_FILE = 'tmp.json';
/** 一時保存用のコード名 */
const TMP_CODE_NAME = 'tmp';
/** 送信用GPIO */
const SEND_GPIO_NO = 17;
/** 受信用GPIO */
const RECEIVE_GPIO_NO = 26;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./raspi-home-1823-firebase-adminsdk-6ih25-ce34185a30.json');

/** 信号の送信 */
async function send(id: string) {
  const command = `python3 ${CWD}/irrp.py -p -g${SEND_GPIO_NO} -f ${CWD}/${CODE_FILE} ${id}`;
  const text = fs.readFileSync(`${CWD}/${CODE_FILE}`, 'utf8');
  const codes: { [key: string]: number[] } = text ? JSON.parse(text) : {};

  // jsonファイルに指定されたIDの信号が登録されていなければ、新たに登録する
  if (!codes[id]) {
    const remoconDoc = await admin
      .firestore()
      .collection('signal')
      .doc(id)
      .get();
    if (remoconDoc.exists) {
      const data = remoconDoc.data();
      if (!data) {
        throw new Error();
      }
      codes[id] = data.code;
      fs.writeFileSync(`${CWD}/${CODE_FILE}`, JSON.stringify(codes));
    }
  }
  console.log(`send: ${id}`);
  execSync(command);
}

/** 信号の受信 */
async function receive(timeout: number): Promise<number[]> {
  const command = `python3 ${CWD}/irrp.py -r -g${RECEIVE_GPIO_NO} -f ${CWD}/${TMP_CODE_FILE} ${TMP_CODE_NAME} --no-confirm --post 130`;
  console.log('receiving...');
  execSync(command, { timeout });
  console.log('received!');

  const text = fs.readFileSync(`${CWD}/${TMP_CODE_FILE}`, 'utf8');
  const codes = text ? JSON.parse(text) : {};
  return codes[TMP_CODE_NAME];
}

/** 受信した信号の登録 */
const registerSignal = async (code: number[]): Promise<any> => {
  const data = {
    code,
    timestamp: admin.database.ServerValue.TIMESTAMP,
  };
  const res = await admin
    .database()
    .ref('received_signal')
    .set({ data });
  return res;
};

const test = (hoge: boolean) => {
  if (hoge) {
    return true;
  }
  return false;
};

(function main() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://raspi-home-1823.firebaseio.com',
  });

  // 送信
  admin
    .database()
    .ref('/send_signal')
    .on('child_changed', (snapshot: admin.database.DataSnapshot | null) => {
      if (!snapshot) {
        return;
      }
      const data = snapshot.val();
      if (data.minutes === 0) {
        send(data.signal_id);
      } else {
        const date = dayjs().add(data.minutes, 'minute');
        schedule.scheduleJob(date.toDate(), () => {
          send(data.signal_id);
        });
      }
    });

  // 受信・登録
  admin
    .database()
    .ref('/receive_new_signal')
    .on('child_changed', (snapshot: admin.database.DataSnapshot | null) => {
      if (!snapshot) {
        return;
      }
      const data = snapshot.val();
      receive(data.timeout).then((signal: number[]) => registerSignal(signal));
    });

  console.log('Completed!');
})();
