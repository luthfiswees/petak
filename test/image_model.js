const helper = require('./test');

const expect = helper.expect;
const assert = helper.assert;
const Image  = helper.Image;

describe("Image", () => {
    beforeEach(async () => {
        await Image.create({name: "Kambing Guling Saos Kuning"});
    });

    afterEach(async () => {
        await Image.remove({}, (err) => {
            if (err) {
                console.log(err);
            }
        })
    });

    it("should be able to find an Image", async () => {
        let result = await Image.findOne({name: "Kambing Guling Saos Kuning"});
        expect(result.name).to.be.equal("Kambing Guling Saos Kuning");
    });

    it("should be able to create new Image", async () => {
        await Image.create({name: "Kambing Guling Saos Putih"});

        let result = await Image.findOne({name: "Kambing Guling Saos Putih"});
        expect(result.name).to.be.equal("Kambing Guling Saos Putih");
    });

    it("should not find an Image that not exist", async () => {
        let result = await Image.find({name: "Kambing Guling Saos Hitam"});
        expect(result).to.have.length(0);
    });
})