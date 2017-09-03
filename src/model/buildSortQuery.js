// @flow
import { DEFAULT_SORT, DESC } from '../constants';

/**
 * sets the sort query for .sort(keyOrList, direction)
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {object} sortQuery - sort criteria
 */

export function buildSortQuery(args: any): any {
  // keyOrList string | array | object the key or keys for the sort
  const sortQuery = {};

  // if there is no sort criteria, use at least the order of creation time
  // which we've stored in the constants as defaults
  if (!args.orderBy || args.orderBy.length === 0) {
    return DEFAULT_SORT;
  }

  // if there are sort criterias from the schema's "enum <type>Sort"
  // sort = sort field name
  // direction = number ASC => 1, DESC => -1
  // mongoDB sort directions for ASC = 1, for DESC = -1
  // if there is no direction provided set default to ASC
  args.orderBy.forEach(
    ({ sort, direction }) => (sortQuery[sort] = direction === DESC ? -1 : 1)
  );

  return sortQuery;
}
