'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.buildBaseQuery = buildBaseQuery;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash');

var _buildFilterQuery = require('./buildFilterQuery');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * sets find(queryObject) with provided baseQuery plus additional filters
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {object} baseQuery - base query for the find method
 */

function buildBaseQuery(args) {
  var query = {};

  // if there is already a baseQuery provided from other model methods
  // apply the baseQuery to this query as a base
  if (args && args.baseQuery) {
    query = (0, _lodash2.default)(args.baseQuery);
  }

  // if the user chose further filter criterias, build and merge them here
  if (args && args.filter) {
    query = (0, _lodash3.merge)(query, (0, _buildFilterQuery.buildFilterQuery)(args.filter));
  }

  // for pagination
  // default
  var lastCreatedAt = 0;

  // if there was sent a lastCreatedAt with the args, then use that instead
  if (args.lastCreatedAt && args.lastCreatedAt !== '' && _typeof(args.lastCreatedAt) !== 'object') {
    lastCreatedAt = args.lastCreatedAt;
  }

  // check if the user entered a different filter criteria for "createdAt"
  // if so, take the one from the user, otherwise use the default for pagination
  if (!query['createdAt']) {
    query['createdAt'] = { $gt: lastCreatedAt };
  }

  return query;
}