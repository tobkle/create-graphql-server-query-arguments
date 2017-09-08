'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readInput;
exports.readString = readString;
exports.templateToAst = templateToAst;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

var _recast = require('recast');

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * reads a .graphql file and parses the file
 * @param {string} path - path of the graphql file
 * @return {object} schemaObject - returns a parsed schema file
 */

function readInput(path) {
  return (0, _graphql.parse)(_fs2.default.readFileSync(path, 'utf8'));
}

/**
 * reads a .graphql file
 * @param {string} path - path of the graphql file
 * @return {string} schemaObject - returns a schema file
 */

function readString(path) {
  return _fs2.default.readFileSync(path, 'utf8');
}

var babylonParser = {
  parse: function parse(code) {
    return babylon.parse(code, {
      sourceType: 'module',
      plugins: ['objectRestSpread']
    });
  }
};

/**
 * Take a template, replacing each replacement.
 * @param {string} template - template
 * @param {string} replacements - replacements within the template
 * @return {object} codeAST - parsed code
 */

function templateToAst(template, replacements) {
  var source = Object.keys(replacements).reduce(function (string, key) {
    return string.replace(new RegExp(key, 'g'), replacements[key]);
  }, template);

  return (0, _recast.parse)(source, { parser: babylonParser });
}