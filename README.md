# node-env-obj
Compiles environment vars into a predefined object structure.

# What's New

## Latest

### 0.2.1
* TWEAK: basePath config default will now be the directory of the root executing script
### 0.2.0

- ADDED: Ability to change the expected config & env file paths
- REFACTOR: the way the env path is speficied (see below), the options only need to be provide to the first require instance.

  #### Old
  ```
  // ./index.js
  const Config = require('node-env-obj)('./');
  // ./folder/file.js
  const Config = require('node-env-obj)('../');
  ```
  #### New
  ```
  // New
  // ./index.js
  const Config = require('node-env-obj)({
    envPath: '../'
  });
  // ./folder/file.js
  const Config = require('node-env-obj)();
  ```

### 0.1.1
- FIX: package.json not referencing correct main file
- FIX: Use process.cwd instead of __dirname so path is relative to project not the module
- ADDED: package-lock & .gitignore

### 0.1.0
- ADDED: Load *.env files from specific path into process.env
- ADDED: Parsing and replace keys in config.json with process.env values