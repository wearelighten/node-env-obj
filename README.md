# node-env-obj
Reads an environment file into the programs environment which is then applied to a predefined object structure.

## Usage
`node-env-obj` is configured and creates a Singleton the first import.

```js
  // entry: ./index.js
  const Config = require('node-env-obj')({
    envPath: '../'
  });

  // any further files: ./folder/file.js
  const Config = require('node-env-obj')();
```