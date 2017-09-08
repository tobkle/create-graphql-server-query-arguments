'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminUser = exports.roleUser = exports.defaultUser = exports.unknownUser = undefined;
exports.getToken = getToken;
exports.sendQuery = sendQuery;
exports.sendQueryAndExpect = sendQueryAndExpect;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _chai = require('chai');

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENDPOINT = 'http://localhost:3000/graphql';

// For testing different user authorizations, set users to:

var unknownUser = exports.unknownUser = ''; // not signed in
var defaultUser = exports.defaultUser = '583291a1638566b3c5a92ca2'; // role = 'user'
var roleUser = exports.roleUser = '583291a1638566b3c5a92ca0'; // role = 'editor'
var adminUser = exports.adminUser = '583291a1638566b3c5a92ca1'; // role = 'admin'

function getToken(userId) {
  var KEY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'test-key';

  var payload = { userId: userId };
  var token = userId && userId !== '' ? 'JWT ' + _jwtSimple2.default.encode(payload, KEY) : null;
  return token;
}

function sendQuery(_ref) {
  var query = _ref.query,
      userId = _ref.userId;

  var token = getToken(userId);
  return (0, _nodeFetch2.default)(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({ query: query })
  }).then(function (response) {
    _chai.assert.equal(response.status, 200, response.statusText);
    return response.json();
  });
}

function sendQueryAndExpect(query, expectedResult, userId) {
  return sendQuery({ query: query, userId: userId }).then(function (result) {
    _chai.assert.isDefined(result.data);
    _chai.assert.deepEqual(result.data, expectedResult);
  });
}