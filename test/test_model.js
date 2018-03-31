const helper = require('./test');

const expect = helper.expect;
const assert = helper.assert;
const Test   = helper.Test;
const Label  = helper.Label;

describe("Test", () => {
    beforeEach(async () => {
        await Test.create(new Test({name: 'Kambing'}));
        await Test.create(new Test({name: "Katak"}, async (error, result) => {
            await result.labels.push(new Label("Katak Bakar"));
            await result.save();
        }));
    });

    afterEach(async () => {
        await Test.remove({}, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully wiped Test model");
            }
        });
    });

    it("should be able to find a Test", async () => {
        let result = await Test.findOne({name: "Kambing"});
        expect(result.name).to.equal("Kambing");
    });

    it("should be able to create new Test", async () => {
        await Test.create(new Test({name: "Ayam"}));
        let result = await Test.findOne({name: "Ayam"});
        expect(result.name).to.equal("Ayam");
    });

    it("should not find a Test that not exist", async () => {
        let result = await Test.find({name: "Sapi"});
        expect(result).to.be.instanceof(Array);
        expect(result).to.not.have.length.above(0);
    });

    it("should have a property called labels", async () => {
        let result = await Test.findOne({name: "Kambing"});
        expect(result).to.have.property('labels');
    });

    it("should be able to add labels", async () => {
        let testLabel = await new Label({name: "Kambing Guling"});

        let test = await Test.findOne({name: "Kambing"});
        await test.labels.push(testLabel);
        await test.save();

        let result = await Test.findOne({name: "Kambing"});
        expect(result.labels).to.have.length(1);
        expect(result.labels[0].ObjectId).to.equal(testLabel.ObjectId);
    });

    it("should be able to delete labels", async () => {
        let test = await Test.findOne({name: "Katak"});
        await test.labels.pop();
        await test.save();

        let result = await Test.findOne({name: "Katak"});    
        expect(result.labels).to.not.have.length.above(0);
    });
});