'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require('./model');

Object.defineProperty(exports, 'prepareQueries', {
  enumerable: true,
  get: function get() {
    return _model.prepareQueries;
  }
});

var _schema = require('./schema');

Object.defineProperty(exports, 'buildRequiredTypes', {
  enumerable: true,
  get: function get() {
    return _schema.buildRequiredTypes;
  }
});
Object.defineProperty(exports, 'enhanceSchemaWithQueryArguments', {
  enumerable: true,
  get: function get() {
    return _schema.enhanceSchemaWithQueryArguments;
  }
});

var _testCases = require('./test-cases');

Object.defineProperty(exports, 'testCases', {
  enumerable: true,
  get: function get() {
    return _testCases.testCases;
  }
});


/**
 * CREATE-GRAPHQL-SERVER-QUERY-ARGUMENTS
 * 
 * this module adds query arguments to the schema
 * and maps the query arguments to a mongoDB data access
 *
 */

/* to find this path from various places, return this modules absolute path: */
var modulePath = exports.modulePath = __dirname;

// prepares all the required queries for a mongoDB access