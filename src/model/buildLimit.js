// @flow
import { DEFAULT_LIMIT } from '../constants';

/*
 * sets the limit of the cursor: .limit(number)
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {number} limit - number of records to return
 */

export function buildLimit(args: any): number {
  if (args.limit) {
    return args.limit;
  }

  return DEFAULT_LIMIT;
}
