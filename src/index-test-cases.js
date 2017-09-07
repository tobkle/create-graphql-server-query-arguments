// @flow
import { testCases } from './test-cases';
import { sendQueryAndExpect } from './sendQuery';
import { describe, before, it, Test } from 'mocha';
import { expect } from 'chai';

// dynamically define the test cases based on our test case registry
export const suite = describe('end-to-end test', () => {
  before(done => {
    testCases.forEach(testCase => {
      suite.addTest(
        new Test(`${testCase.name}`, () => {
          return sendQueryAndExpect(
            testCase.query,
            testCase.expectedResult,
            testCase.user
          );
        })
      );
    });

    done();
  });

  // start dummy test case, to get the whole thing running
  it('should start the test cases run', () => {
    expect(1).to.equal(1);
  });
});
