# boolean-debug
A wrapper to node-debug with line numbers and other magic


## Install

```
npm install bo01ean/boolean-debug
```

## usage

Require the library with it's name-space passed to it's constructor.


```

var debug = require('boolean-debug')('info');
debug('hai!');
```


## Run node with DEBUG set to name-space;

```
DEBUG=info files.js

```

:)
