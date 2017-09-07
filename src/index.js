// @flow

/**
 * CREATE-GRAPHQL-SERVER-QUERY-ARGUMENTS
 * 
 * this module adds query arguments to the schema
 * and maps the query arguments to a mongoDB data access
 *
 */

/* to find this path from various places, return this modules absolute path: */
export const modulePath = __dirname;

// prepares all the required queries for a mongoDB access
export { prepareQueries } from './model';

// provides a string with required types
// clones a given inputSchema and enhance it with query arguments
export { buildRequiredTypes, enhanceSchemaWithQueryArguments } from './schema';

// to provide the testCases to be used in create-graphql-server
export { testCases } from './test-cases';
