/* globals globalThis __stack __file __function __line */
const path = require('path');
const debug = require('debug');

// Types to utils.format
const fmtMap = {
  [typeof 1]: '%d',
  [typeof []]: '%o',
  [typeof {}]: '%O',
  [typeof '']: '%s',
  [typeof undefined]: '%s',
};

module.exports = (space = 'default', depth = 3) => {
  const getGlobalThis = () => {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self; /* eslint-disable-line */
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    if (typeof this !== 'undefined') return this;
    throw new Error('Unable to locate global `this`');
  };

  const g = getGlobalThis();

  const get = () => {
    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const { stack } = new Error();
    Error.prepareStackTrace = orig;
    return stack;
  };

  if (Object.getOwnPropertyDescriptor(g, '__stack') === undefined) {
    Object.defineProperty(g, '__stack', {
      get,
    });
  }

  if (Object.getOwnPropertyDescriptor(g, '__line') === undefined) {
    Object.defineProperty(g, '__line', {
      get: () => __stack[depth].getLineNumber(),
    });
  }

  if (Object.getOwnPropertyDescriptor(g, '__function') === undefined) {
    Object.defineProperty(g, '__function', {
      get: () => __stack[depth].getFunctionName(),
    });
  }

  if (Object.getOwnPropertyDescriptor(g, '__file') === undefined) {
    Object.defineProperty(g, '__file', {
      get: () => __stack[depth].getFileName(),
    });
  }

  const bug = debug(space);
  return (...statement) => {
    const fmtChunks = [];
    const reduced = statement.reduce((previous, current) => {
      fmtChunks.push(fmtMap[typeof current]);
      return [...previous, current];
    }, []);
    const func = __function ? ` ${__function}() ` : '';
    const line = __line ? `${__line}` : '';
    const filePath = __file ? `${path.basename(__file)}` : '';
    const fileInfo = filePath ? `${filePath}:${line}${func}` : '';
    bug(`${fileInfo}${fmtChunks.join(' ')}`, ...reduced);
  };
};
