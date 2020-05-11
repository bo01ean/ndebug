const debug = require('./debug.js')('info');
const original = require('debug')('info');


const msg = ['Hai!', 'There', { a: 5, b: { c: 6 } }, 2, 2.1, undefined, '', {}, null, {}, { a: 'a' }, console];

const b = () => {
  original('Hai!');
  original(...msg);

  const a = () => {
    debug('Hai!');
    debug(...msg);
  };

  a();
};

b();

console.log(...msg);
