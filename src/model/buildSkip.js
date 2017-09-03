// @flow
import { DEFAULT_SKIP } from '../constants';

/*
 * sets the skip for the cursor:  .skip(number)
 * @public
 * @param {object} args - query arguments for the .find() method
 * @return {number} skip - number of records to skip
 */

export function buildSkip(args: any): number {
  if (args.skip) {
    return args.skip;
  }

  return DEFAULT_SKIP;
}
