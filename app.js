import net from 'net';
import deasync from 'deasync';
import Web3 from './packages/web3.js'

const web3 = new Web3();

const ipcPath = '/Users/sum/Library/Ethereum/testnet/geth.ipc';

const wei = 0.001;
const from = '0x97e5fe0559f80a83df67578d1f00c6afc9c66bf4';
const fromPassword = 'sumling';
const to = '0x58B35891710be4E0b347204BA2F0269E4730FFf7';

// IPC connection
const connectionProvider = new web3.providers.IpcProvider(ipcPath, net);
web3.setProvider(connectionProvider);

let isConnected = false;
connectionProvider.on('connect', () => {
  isConnected = true;
  console.log('Connected!');
});
deasync.loopWhile(() => {
  return !isConnected;
});

// get current block number

let currentBlockNumber;
web3.eth.getBlockNumber()
  .then((blockNumber) => {
    currentBlockNumber = blockNumber;
  });

deasync.loopWhile(() => {
  return currentBlockNumber === undefined;
});
console.log('Current Block Number:', currentBlockNumber);

// get source account info

let fromBalance;
web3.eth.getBalance(from)
  .then((wei) => {
    fromBalance = web3.utils.fromWei(wei, 'ether');
  });
deasync.loopWhile(() => {
  return fromBalance === undefined;
});
console.log('*** from ***');
console.log('account', from);
console.log('balance', fromBalance);

// get destination account info

let toBalance;
web3.eth.getBalance(to)
  .then((wei) => {
    toBalance = web3.utils.fromWei(wei, 'ether');
  });
deasync.loopWhile(() => {
  return toBalance === undefined;
});
console.log('*** to ***');
console.log('account', to);
console.log('balance', toBalance);

// transaction

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
