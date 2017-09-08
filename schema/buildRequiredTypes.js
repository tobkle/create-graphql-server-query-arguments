'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRequiredTypes = buildRequiredTypes;

var _requiredTypes = require('./requiredTypes');

/**
 * reads and graphql file and returns it as a string
 * @return {string} requiredTypes - schema containing the required types
 */

function buildRequiredTypes() {
  // for any reason npm install always forgets to install the .graphql file
  // const filePath = path.join(__dirname, pathToFile || 'requiredTypes.conf');
  // return readString(filePath);
  return _requiredTypes.requiredTypes;
} // import { readString } from '../util/read';
// import path from 'path';