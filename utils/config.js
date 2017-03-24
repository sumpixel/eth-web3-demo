const isunpayrpcHost = '192.168.100.92:27184';
const ripplerpc = 'ws://192.168.100.92:6006';

export default {
  port: 3001,
  isunpayrpc: `http://${isunpayrpcHost}`,
  ripplerpc,
  rippletxturl: `http://${isunpayrpcHost}/ripple.txt`,
};
