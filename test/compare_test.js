const helper = require('./test');

const sinon  = helper.sinon;
const expect = helper.expect;
const fs     = helper.fs;
const diff   = require('../compare');

describe("Image comparison module", () => {
    it("should be able to differentiate image", async () => {
        sinon.stub(fs, 'writeFile').callsFake((path, buffer) => {return null});
        let result = await diff.getDiff('test_assets/People.jpg', 'test_assets/People2.jpg');
    });
});