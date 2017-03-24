import { Router } from 'express';
import logger from '../utils/logger';

function receiveNotify(req, res) {
  logger.info('Received notification', req.body);
  res.json({ message: 'Received. Thanks!' });
}

const router = new Router();
router.post('/notify', receiveNotify);

export default router;
