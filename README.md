# boolean-debug
A wrapper to node-debug with line numbers and other magic


## Install

```
yarn add bo01ean/ndebug
```

## usage

Require the library with it's name-space passed to it's constructor.


```

const debug = require('ndebug')('info');
debug('hai!');
```


## Run node with DEBUG set to name-space;

```
DEBUG=info node index.js # OR
DEBUG=info node -e "const debug = require('ndebug')('info'); debug('hai\!');"
```

:)
