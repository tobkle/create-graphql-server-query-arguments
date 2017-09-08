'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSkip = buildSkip;

var _constants = require('../constants');

/*
 * sets the skip for the cursor:  .skip(number)
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {number} skip - number of records to skip
 */

function buildSkip(args) {
  if (args.skip) {
    return args.skip;
  }

  return _constants.DEFAULT_SKIP;
}