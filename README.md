# Unibrowser API Server
Application server for the unibrowser search engine

## Quick Start
- To install dependencies: `npm install`
- To run the unit tests: `npm test`
- To run the server: `npm start`

## Configuration
The API server uses the NPM `config` module to help with configuration. Configuration files are placed under the `config/` directory and are read according to the rules specified [in the `config` module documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files). Only the `default.json` configuration file should exist in source control, and in most cases this is sufficient to run the server.

## Unit Tests
Unit tests are under the `test/` directory, with all test files having the `.test.js` suffix. Test are run using the `mocha` testing framework using assertions provided by `chai`.
