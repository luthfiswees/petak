const helper = require('./test');

const expect = helper.expect;
const assert = helper.assert;
const Label  = helper.Label;
const Image  = helper.Image;

describe("Label", () => {
    beforeEach(async () => {
        await Label.create(new Label({name: "Kambing Guling"}));
        await Label.create(new Label({name: "Kambing Kukus"}, async (err, label) => {
            await label.images.push(new Image({name: "Kambing Kukus Pandan"}));
            await label.save();
        }));
    });

    afterEach(async () => {
        await Label.remove({}, (error) => {
            if (error) {
                console.log(error);
            }
        });
    });

    it("should be able to to find a Label", async () => {
        let result = await Label.findOne({name: "Kambing Guling"});
        expect(result.name).to.be.equal("Kambing Guling");
    });

    it("should be able to create new Label", async () => {
        await Label.create(new Label({name: "Kambing Bakar"}));

        let result = await Label.findOne({name: "Kambing Bakar"});
        expect(result.name).to.be.equal("Kambing Bakar");
    });

    it("should not find a Label that not exist", async () => {
        let result = await Label.find({name: "Kambing Goreng"});
        expect(result).to.have.length(0);
    });

    it("should have a property called images", async () => {
        let result = await Label.findOne({name: "Kambing Guling"});
        expect(result).to.have.property('images');
    });

    it("should be able to add images", async () => {
        let testImage = await new Image({name: "Kambing Guling Saos Tiram"});

        let label = await Label.findOne({name: "Kambing Guling"});
        await label.images.push(testImage);
        await label.save();

        let result = await Label.findOne({name: "Kambing Guling"});
        expect(result.images).to.have.length(1);
        expect(result.images[0].ObjectId).to.be.equal(testImage.ObjectId);
    });

    it("should be able to remove images", async () => {
        let label = await Label.findOne({name: "Kambing Kukus"});
        await label.images.pop();
        await label.save();

        let result = await Label.findOne({name: "Kambing Kukus"});
        expect(result.images).to.have.length(0);
    });
})