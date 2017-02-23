import Promise from 'bluebird';
import Web3 from './web3.js/index'
import net from 'net';
const web3 = new Web3();

const websocketPath = 'ws://localhost:8546';
const wei = 0.005;
const from = '0x97e5fe0559f80a83df67578d1f00c6afc9c66bf4';
const fromPassword = 'sumling';
const to = '0x1D548De4048fd22baAe01b7f614469f6412AD3ED';

// WebSocket connection
const connectionProvider = new web3.providers.WebsocketProvider(websocketPath);
let isConnected = false;
connectionProvider.connection.onopen = () => {
  isConnected = true;
  console.log('Connected!');
};
require('deasync').loopWhile(() => {
  return !isConnected;
});
web3.setProvider(connectionProvider);

const amount = web3.utils.toWei(wei, "ether");

web3.personal.unlockAccount(from, fromPassword)
  .then((unlocked) => {
    if (!unlocked) {
      return Promise.reject(new Error('Failed to unlock account'));
    }
    console.log('unlocked!');

    web3.eth.sendTransaction({ from: from, to: to, value: amount })
      .on('transactionHash', (hash) => {
        console.log('tx hash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
      })
      .on('confirmation', (confirmNumber, receipt) => {
        console.log('confirmation number', confirmNumber);
        console.log('confirmation receipt',  receipt);
      })
      .on('error', (err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });
