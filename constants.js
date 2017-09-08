'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/*
 * provides constants to this project
 * @public
 */

var DEFAULT_LIMIT = exports.DEFAULT_LIMIT = 10;
var DEFAULT_SKIP = exports.DEFAULT_SKIP = 0;
var DEFAULT_SORT = exports.DEFAULT_SORT = { createdAt: 1 };
var ASC = exports.ASC = 'ASC';
var DESC = exports.DESC = 'DESC';
var ENCODING = exports.ENCODING = 'utf8';

var SRC_DIR = exports.SRC_DIR = 'src';
var TEST_DIR = exports.TEST_DIR = '__tests__';
var TEST_GQL_DATA = exports.TEST_GQL_DATA = 'input';
var TEST_EXPECTED = exports.TEST_EXPECTED = 'output-expected';
var TEST_GENERATED = exports.TEST_GENERATED = 'output-generated';
var TEST_GQL_EXTENSION = exports.TEST_GQL_EXTENSION = '.graphql';

var INT = exports.INT = 'Int';
var FLOAT = exports.FLOAT = 'Float';
var STRING = exports.STRING = 'String';
var ENUM = exports.ENUM = 'Enum';
var BOOLEAN = exports.BOOLEAN = 'Boolean';
var BSON_TYPE = exports.BSON_TYPE = 'BSONType';
var REGEX = exports.REGEX = 'Regex';
var QUERY = exports.QUERY = 'Query';