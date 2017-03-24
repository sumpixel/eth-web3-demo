import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';
import config from './utils/config';
import rippleClient from './lib/rippleClient';
import notifyRouter from './routes/notify';
import settlementRouter from './routes/settlement';
import watchVideoRouter from './routes/watchVideo';

const app = new express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'pug');

function showMenuPage(req, res) {
  res.render('main');
}

app.get('/', showMenuPage);
app.use('/', notifyRouter);
app.use('/', settlementRouter);
app.use('/', watchVideoRouter);

rippleClient.connect()
  .then(() => {
    app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  });
