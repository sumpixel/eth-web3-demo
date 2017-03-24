import { Router } from 'express';
import request from 'superagent';
import config from '../utils/config';
import rippleClient from '../lib/rippleClient';

const notifyURI = `http://192.168.210.136:${config.port}/notify`;

function submitPayment(req, res) {
  const gateway = rippleClient.rippletxt.accounts[0];

  const {
    account,
    secret,
    value,
    vid,
    vtime,
    userid,
  } = req.body;

  const memo = {
    method: 'create_view',
    params: {
      vid,
      vtime,
      userid,
    },
    notifyURI,
  };

  const amount = {
    currency: 'ISD',
    value,
    counterparty: gateway,
  };
  const payment = {
    source: {
      address: account,
      maxAmount: amount,
    },
    destination: {
      address: gateway,
      amount,
    },
    memos: [{
      data: JSON.stringify(memo),
      format: 'application/JSON',
    }],
  };

  rippleClient.api.preparePayment(account, payment)
    .then((prepared) => {
      const signed = rippleClient.api.sign(prepared.txJSON, secret);
      const uri = `${config.isunpayrpc}/signedTransaction`;
      return request.post(uri)
        .send({ signed })
        .then((resp) => {
          res.render('watchVideoResult', { result: JSON.stringify(resp.body, null, 2) });
        })
        .catch((err) => {
          if (err.response) {
            return Promise.reject(new Error(`[${err.message}] ${JSON.stringify(err.response.body, null, 2)}`));
          }
          return Promise.reject(err);
        });
    })
    .catch((err) => {
      res.render('watchVideoResult', { result: err.message });
    });
}

function showPage(req, res) {
  res.render('watchVideo');
}

const router = new Router();
router.get('/video', showPage);
router.post('/video', submitPayment);

export default router;
