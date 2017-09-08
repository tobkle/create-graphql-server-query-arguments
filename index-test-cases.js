'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.suite = undefined;

var _testCases = require('./test-cases');

var _sendQuery = require('./sendQuery');

var _mocha = require('mocha');

var _chai = require('chai');

// dynamically define the test cases based on our test case registry
var suite = exports.suite = (0, _mocha.describe)('end-to-end test', function () {
  (0, _mocha.before)(function (done) {
    _testCases.testCases.forEach(function (testCase) {
      suite.addTest(new _mocha.Test('' + testCase.name, function () {
        return (0, _sendQuery.sendQueryAndExpect)(testCase.query, testCase.expectedResult, testCase.user);
      }));
    });

    done();
  });

  // start dummy test case, to get the whole thing running
  (0, _mocha.it)('should start the test cases run', function () {
    (0, _chai.expect)(1).to.equal(1);
  });
});