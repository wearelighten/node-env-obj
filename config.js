'use strict';

/**
 * node-env-obj
 *
 * @file config.js
 * @description
 * @module Config
 * @author Lighten
 *
 */

const path = require('path');
const fs = require('fs');

/**
 * @type {{development: string, production: string, test: string}}
 * @private
 */
const _map = {
  development: 'dev',
  production: 'prod',
  test: 'test'
};
const _env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const _regEx = /%(\w+)%/g;

/**
 * @param  {Object} env - environment variables
 * @param  {Object|Array} root - root object
 */
const __recurseVars = (env, root) => {
  for (let variable in root) {
    if (!root.hasOwnProperty(variable)) { // eslint-disable-line no-prototype-builtins
      continue;
    }

    if (root[variable] instanceof Object || root[variable] instanceof Array) {
      __recurseVars(env, root[variable]);
    } else if (typeof root[variable] === 'string') {
      const matches = root[variable].match(_regEx);
      if (matches) {
        matches.forEach(match => {
          const key = match.replace(/%/g, '');
          root[variable] = root[variable].replace(`%${key}%`, env[key]);
        });
      }
    }
  }
};

/**
 * @param  {Object} object - environment variables
 */
const __parse = object => {
  if (object instanceof Object === false) {
    return;
  }

  for (let variable in object) {
    if (!object.hasOwnProperty(variable)) { // eslint-disable-line no-prototype-builtins
      continue;
    }
    if (object[variable] instanceof Object) {
      if (object[variable][_map[_env]]) {
        object[variable] = object[variable][_map[_env]];
      } else {
        __parse(object[variable]);
      }
    }
  }
};

/**
 * @param  {String} data - environment variables data
 * @return {Object} contained key-values for environment variables
 */
const __parseEnvFile = data => {
  return data.split('\n').reduce((obj, line) => {
    let lineSplit = line.split('=');
    if (lineSplit.length > 0) {
      const key = lineSplit.shift();
      const value = lineSplit.join('=');
      if (key === '' || key.indexOf('#') >= 0) return obj;
      obj[key] = value;
    }
    return obj;
  }, {});
};

/**
 * @class Config
 *
 */
class Config {
  constructor(opts) {
    if (typeof opts === 'string') {
      console.warn(`WARN: Breaking change from v0.2.0. Please pass a object instead of a stirng to the first config instance.`);
    }

    // Merge user options with defaults
    this._options = {
      basePath: process.cwd(),
      envPath: '/',
      envFile: `.${_env}.env`,
      configPath: '/',
      configFile: `config.json`,
      ...opts
    };

    // Build our full paths
    this._options.envFullPath = path.join(this._options.basePath, this._options.envPath, this._options.envFile);
    this._options.configFullPath = path.join(this._options.basePath, this._options.configPath, this._options.configFile);

    // Remerge out user options again in case they've overwritten the full paths
    this._options = {
      ...this._options,
      ...opts
    };

    if (fs.existsSync(this._options.envFullPath)) {
      const envFileData = __parseEnvFile(fs.readFileSync(this._options.envFullPath, {encoding: 'utf8'}));
      Object.keys(envFileData).forEach(key => {
        process.env[key] = envFileData[key];
      });
    } else {
      console.warn(`WARN: Unable to find file ${this._options.envFullPath}`);
    }

    this._settings = this._loadSettings(process.env);
    this._settings.env = _map[this._settings.env];
  }
  
  get settings() {
    return this._settings;
  }

  _loadSettings(env) {
    const json = fs.readFileSync(this._options.configFullPath);
    const settings = JSON.parse(json);

    let variable;
    for (variable in settings.environment) {
      if (!settings.environment.hasOwnProperty(variable)) { // eslint-disable-line no-prototype-builtins
        continue;
      }
      if (!env[variable] && !settings.environment[variable]) {
        console.warn(`WARN: You must specify the ${variable} environment variable`);
      }
      if (env[variable]) {
        settings.environment[variable] = env[variable];
      }
    }

    __parse(settings.global);
    __recurseVars(settings.environment, settings.global);

    return settings.global;
  }
}

let _instance = null;

module.exports = (args) => {
  if (!_instance) {
    _instance = new Config(args);
  }

  return _instance.settings;
};