// @flow
import { buildBaseQuery } from './buildBaseQuery';
import { buildSortQuery } from './buildSortQuery';
import { buildSkip } from './buildSkip';
import { buildLimit } from './buildLimit';

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

export function prepareQueries(
  args: any
): {
  baseQuery: any,
  sortQuery: any,
  skip: number,
  limit: number
} {
  return {
    baseQuery: buildBaseQuery(args),
    sortQuery: buildSortQuery(args),
    skip: buildSkip(args),
    limit: buildLimit(args)
  };
}
