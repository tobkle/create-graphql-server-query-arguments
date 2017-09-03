/* eslint-disable no-console */
/* eslint-disable max-len */

import fs from 'fs';
import path from 'path';
import { parse, print } from 'graphql';
import generateSchema from './schema/index';
import chai, { expect } from 'chai';
import { enhanceSchemaWithQueryArguments } from '../schema//enhanceSchemaWithQueryArguments';

chai.use(require('chai-string')); // equalIgnoreSpaces

import {
  SRC_DIR,
  TEST_DIR,
  TEST_GQL_DATA,
  TEST_EXPECTED,
  TEST_GENERATED,
  TEST_GQL_EXTENSION,
  ENCODING
} from '../constants';

let gqlFiles;
let expectedFiles;

const gqlFilesSources = {};
const expectedFilesSources = {};

const generatedFiles = [];

describe('add query arguments to schema', () => {
  before(done => {
    // read all *.graphql files from input directory
    const gqlPath = path.join(SRC_DIR, TEST_DIR, TEST_GQL_DATA);
    gqlFiles = fs
      .readdirSync(gqlPath)
      .filter(file => path.extname(file) === TEST_GQL_EXTENSION)
      .sort();
    gqlFiles.forEach(file => {
      const filePath = path.join(SRC_DIR, TEST_DIR, TEST_GQL_DATA, file);
      const source = fs.readFileSync(filePath, ENCODING);
      gqlFilesSources[file] = source;
    });

    // read all *.graphql files in output-expected directory
    const schemaPath = path.join(SRC_DIR, TEST_DIR, TEST_EXPECTED);
    expectedFiles = fs
      .readdirSync(schemaPath)
      .filter(file => path.extname(file) === TEST_GQL_EXTENSION)
      .sort();
    expectedFiles.forEach(file => {
      const filePath = path.join(SRC_DIR, TEST_DIR, TEST_EXPECTED, file);
      const source = fs.readFileSync(filePath, ENCODING);
      expectedFilesSources[file] = source;
    });

    done();
  }); // before

  it('should have equal number of files: "input" and "output-expected"', () => {
    const gqlFilesCount = gqlFiles.length;
    const expectedFilesCount = expectedFiles.length;
    expect(gqlFilesCount).to.not.equal(0);
    expect(gqlFilesCount).to.equal(expectedFilesCount);
  });

  it('generated schema files should be equal to expected files', done => {
    gqlFiles.forEach(gqlFile => {
      const schemaFileName = path.basename(gqlFile);

      // generate schema code from .graphql file
      const gqlSource = gqlFilesSources[gqlFile];
      const inputSchema = parse(gqlSource);
      const generatedSource = print(
        enhanceSchemaWithQueryArguments(generateSchema(inputSchema))
      );

      const generateFilename = path.join(
        SRC_DIR,
        TEST_DIR,
        TEST_GENERATED,
        schemaFileName
      );

      fs.writeFileSync(generateFilename, generatedSource, ENCODING);
      generatedFiles.push(generateFilename);

      // the code can be parsed
      const parsedGeneratedCode = parse(generatedSource);
      expect(parsedGeneratedCode, generateFilename).to.not.equal({});

      // get expected schema from output-expected file for comparison
      const expectedSource = expectedFilesSources[schemaFileName];

      // compare AST of both sources
      expect(generatedSource, generateFilename).to.equal(expectedSource);
    });
    done();
  });

  after(done => {
    console.log('\n    Summary:\n    ========');
    generatedFiles.forEach(file => console.log('    Generated file: ', file));
    done();
  });
}); // describe getModelCode
