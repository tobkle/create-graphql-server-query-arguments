import fs from 'fs';
import path from 'path';
import chai, { expect } from 'chai';
chai.use(require('chai-fs'));

const indexFile = path.join(__dirname, '/../index.js');

describe('index', function() {
  it('should return an object with all functions', function() {
    const ls = fs.readdirSync(path.join(__dirname, '/../lib'));
    ls.forEach(filename => {
      const file = path.parse(filename);
      if (file.ext === '.js') {
        const objectName = file.name;
        const objectNameRegEx = new RegExp(`${objectName}`, 'g');
        expect(indexFile).to.have.content.that.match(
          objectNameRegEx,
          `${objectName} must be in src/index.js file`
        );
      }
    });
  });
});
