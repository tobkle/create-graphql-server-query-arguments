'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLimit = buildLimit;

var _constants = require('../constants');

/*
 * sets the limit of the cursor: .limit(number)
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {number} limit - number of records to return
 */

function buildLimit(args) {
  if (args.limit) {
    return args.limit;
  }

  return _constants.DEFAULT_LIMIT;
}