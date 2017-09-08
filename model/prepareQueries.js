'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareQueries = prepareQueries;

var _buildBaseQuery = require('./buildBaseQuery');

var _buildSortQuery = require('./buildSortQuery');

var _buildSkip = require('./buildSkip');

var _buildLimit = require('./buildLimit');

/*
 * prepares the queries for the mongoDB access
 * @public
 * @param {object} args - query arguments for the mongoDB db operations
 * @return {object} queries - all necessary queries
 * @properties {object} baseQuery - base query for the .find() method
 * @properties {object} sortQuery - sort query for the .sort() method
 * @properties {number} skip - number of records to skip .skip() method
 * @properties {number} limit - number of records to return .limit() method
 */

function prepareQueries(args) {
  return {
    baseQuery: (0, _buildBaseQuery.buildBaseQuery)(args),
    sortQuery: (0, _buildSortQuery.buildSortQuery)(args),
    skip: (0, _buildSkip.buildSkip)(args),
    limit: (0, _buildLimit.buildLimit)(args)
  };
}