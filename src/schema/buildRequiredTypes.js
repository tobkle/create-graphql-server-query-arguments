import { readString } from '../util/read';
import path from 'path';

import { requiredTypes } from './requiredTypes';

/**
 * reads and graphql file and returns it as a string
 * @param {string} pathToFile - the path of the required 
 *   types .graphql file (default)
 * @return {string} requiredTypes - schema containing the required types
 */

export function buildRequiredTypes(): string {
  // for any reason npm install always forgets to install the .graphql file
  // const filePath = path.join(__dirname, pathToFile || 'requiredTypes.conf');
  // return readString(filePath);
  return requiredTypes;
}
