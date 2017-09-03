// @flow
import cloneDeep from 'lodash.clonedeep';
import { merge } from 'lodash';
import { buildFilterQuery } from './buildFilterQuery';

/**
 * sets find(queryObject) with provided baseQuery plus additional filters
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {object} baseQuery - base query for the find method
 */

export function buildBaseQuery(args: any): any {
  let query = {};

  // if there is already a baseQuery provided from other model methods
  // apply the baseQuery to this query as a base
  if (args && args.baseQuery) {
    query = cloneDeep(args.baseQuery);
  }

  // if the user chose further filter criterias, build and merge them here
  if (args && args.filter) {
    query = merge(query, buildFilterQuery(args.filter));
  }

  return query;
}
