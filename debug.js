module.exports = function (space, depth = 2) {
  const getGlobalThis = () => {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    if (typeof this !== 'undefined') return this;
    throw new Error('Unable to locate global `this`');
  };

  const g = getGlobalThis();
  
  if (Object.getOwnPropertyDescriptor(g, '__stack') === undefined) {
    Object.defineProperty(g, '__stack', {
      get: () => {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
          return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
      }
    });
  }

  if (Object.getOwnPropertyDescriptor(g, '__line') === undefined) {
    Object.defineProperty(g, '__line', {
      get: () => __stack[depth + 1].getLineNumber()
    });
  }

  if (Object.getOwnPropertyDescriptor(g, '__function') === undefined) {
    Object.defineProperty(g, '__function', {
      get: () => __stack[depth].getFunctionName()
    });
  }

  if (Object.getOwnPropertyDescriptor(g, '__file') === undefined) {
    Object.defineProperty(g, '__file', {
      get: () => __stack[depth].getFileName()
    });
  }

  function censor(censor) {
    var i = 0;
    return function (key, value) {
      if (i !== 0 && typeof censor === 'object' && typeof value == 'object' && censor == value) { return '[Circular]'; }
      if (i >= 29) { return '[Unknown]'; }
      ++i;
      return value;
    };
  }

  const regex = /["']?([\.a-z_0-9]+)["']?\s?:(!?.+)(!?\s+)/ig;
  const groupIndexForKeys = 1;

  function colorify(str, color) {
    color = (color === undefined) ? 6 : color;
    var colors = [6, 2, 3, 4, 5, 1];
    var colorCode = colors[color];
    return '\u001b[3' + color + ';1m' + str + ' ' + '\u001b[0m';
  }

  function colorifyObjectKeys(str) {
    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
        });
    }
  }

  function parseIt(obj) {
    var textRepresentation = JSON.stringify(obj, censor(obj));
    return textRepresentation;
  }


  space = (space === undefined) ? 'default' : space;
  const path = require('path');
  const bug = require('debug')(space);
  return function () {
    for (var arg in arguments) {
      arguments[arg] = (typeof arguments[arg] === typeof {}) ? parseIt(arguments[arg]) : arguments[arg];
    }
    return bug([].concat.apply([path.basename(__file) + ':' + __line], arguments).join(' '));
  }
}
