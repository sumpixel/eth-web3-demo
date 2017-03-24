import { RippleAPI } from 'ripple-lib';
import request from 'superagent';
import config from '../utils/config';
import logger from '../utils/logger';

function parseRippleTxt(txt) {
  let currentSection = '';
  const sections = { };

  txt = txt.replace(/\r?\n/g, '\n').split('\n');

  for (let i = 0, l = txt.length; i < l; i++) {
    let line = txt[i];

    if (!line.length || line[0] === '#') {
      continue;
    }

    if (line[0] === '[' && line[line.length - 1] === ']') {
      currentSection = line.slice(1, line.length - 1);
      sections[currentSection] = [];
    } else {
      line = line.replace(/^\s+|\s+$/g, '');
      if (sections[currentSection]) {
        sections[currentSection].push(line);
      }
    }
  }

  return sections;
}

class RippleClient {
  constructor() {
    this.rippletxt = null;
    this.api = new RippleAPI({ server: config.ripplerpc });

    this.api.on('error', (errorCode, errorMessage) => {
      logger.error(`Ripple error: ${errorMessage} (${errorCode})`);
    });

    this.api.on('connected', () => {
      logger.info('Ripple connected!');
    });

    this.api.on('disconnected', (code) => {
      logger.info('Ripple disconnected:', code);
    });
  }

  connect() {
    return this.api.connect()
      .then(() => {
        return request.get(config.rippletxturl)
          .then((resp) => {
            logger.info('Retreived ripple.txt');
            this.rippletxt = parseRippleTxt(resp.text);
          })
          .catch((err) => {
            logger.error('Failed to get ripple.txt', err);
          });
      })
      .catch((err) => {
        logger.error('Failed to connect to ripple', err);
        return Promise.reject(err);
      });
  }
}

const rippleClient = new RippleClient();
export default rippleClient;
