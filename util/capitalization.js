"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lcFirst = lcFirst;
exports.ucFirst = ucFirst;
/**
 * converts first character of string to lower case
 * @private
 * @param {string} str - string
 * @return {string} converted_string - first character is lower case
 */

function lcFirst(str) {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * converts first character of string to upper case
 * @private
 * @param {string} str - string
 * @return {string} converted_string - first character is upper case
 */

function ucFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}