import fs from 'fs';
import { parse } from 'graphql';
import { parse as recastParse } from 'recast';
import * as babylon from 'babylon';

/**
 * reads a .graphql file and parses the file
 * @param {string} path - path of the graphql file
 * @return {object} schemaObject - returns a parsed schema file
 */

export default function readInput(path) {
  return parse(fs.readFileSync(path, 'utf8'));
}

/**
 * reads a .graphql file
 * @param {string} path - path of the graphql file
 * @return {string} schemaObject - returns a schema file
 */

export function readString(path) {
  return fs.readFileSync(path, 'utf8');
}

const babylonParser = {
  parse(code) {
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

export function templateToAst(template, replacements) {
  const source = Object.keys(replacements).reduce(
    (string, key) => string.replace(new RegExp(key, 'g'), replacements[key]),
    template
  );

  return recastParse(source, { parser: babylonParser });
}
