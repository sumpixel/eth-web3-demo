import { Router } from 'express';
import request from 'superagent';
import config from '../utils/config';

function submitSettlement(req, res) {
  const {
    id,
    role,
    stime,
    etime,
    accountAddress,
  } = req.body;

  const uri = `${config.isunpayrpc}/settlement/${id}`;
  request.post(uri)
    .send({
      role,
      stime,
      etime,
      accountAddress,
    })
    .then((resp) => {
      res.render('settlementResult', { result: JSON.stringify(resp.body, null, 2) });
    })
    .catch((err) => {
      const result = err.response ? `[${err.message}] ${JSON.stringify(err.response.body, null, 2)}` : err.message;
      res.render('settlementResult', { result });
    });
}

function showPage(req, res) {
  res.render('settlement');
}

const router = new Router();
router.get('/settlement', showPage);
router.post('/settlement', submitSettlement);

export default router;
