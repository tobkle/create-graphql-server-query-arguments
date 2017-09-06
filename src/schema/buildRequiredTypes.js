import { readString } from '../util/read';
import path from 'path';

/**
 * reads and graphql file and returns it as a string
 * @param {string} pathToFile - the path of the required 
 *   types .graphql file (default)
 * @return {string} requiredTypes - schema containing the required types
 */

export function buildRequiredTypes(pathToFile: string): any {
  // for any reason npm install always forgets to install the .graphql file 
  const filePath = path.join(__dirname, pathToFile || 'requiredTypes.js');
  return readString(filePath);
}
