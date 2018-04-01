const helper = require('./test');

const sinon  = helper.sinon;
const expect = helper.expect;
const Image  = helper.Image;
const Label  = helper.Label;
const Test   = helper.Test;
const db     = helper.db;
const fs     = helper.fs;

describe("Database operations", () => {
    describe("createTest()", () => {
        afterEach(async () => {
            await Test.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to create new Test", async () => {
            await db.createTest("Ayam");
            let result = await Test.findOne({name: "Ayam"});
            expect(result.name).to.be.equal("Ayam");
        });
    });

    describe("createLabel()", () => {
        afterEach(async () => {
            await Label.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to create new Label", async () => {
            await db.createLabel("Ayam Panggang");
            let result = await Label.findOne({name: "Ayam Panggang"});
            expect(result.name).to.be.equal("Ayam Panggang");
        });
    });

    describe("createImage()", () => {
        afterEach(async () => {
            await Image.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to create new Label", async () => {
            await db.createImage({filename: "Ayam Panggang Enak", path: "uploads/ayam_panggang_enak.png"});
            let result = await Image.findOne({name: "Ayam Panggang Enak"});
            expect(result.name).to.be.equal("Ayam Panggang Enak");
        });
    });

    describe("findImageById()", () => {
        beforeEach(async () => {
            await Image.create({name: "Ayam Panggang Sedap"});
        });

        afterEach(async () => {
            await Image.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to find an Image", async () => {
            let image = await Image.findOne({name: "Ayam Panggang Sedap"});

            let result = await db.findImageById(image._id);
            expect(result.name).to.be.equal("Ayam Panggang Sedap");
        });

        it("should not be able to find a non-existent Image", async () => {
            let result = await db.findImageById(new Image({name: "Bukan Ayam Panggang Sedap"}));
            expect(result).to.be.equal(null);
        });
    });

    describe("findLabel()", async () => {
        beforeEach(async () => {
            await Label.create({name: "Ayam Panggang"});
        });

        afterEach(async () => {
            await Label.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to find a Label", async () => {
            let result = await db.findLabel("Ayam Panggang");
            expect(result.name).to.be.equal("Ayam Panggang");
        });

        it("should not be able to find a non-existent Label", async () => {
            let result = await db.findLabel("Bukan Ayam Panggang");
            expect(result).to.be.equal(null);
        });
    });

    describe("findLabelById()", async () => {
        beforeEach(async () => {
            await Label.create({name: "Ayam Kukus"});
        });

        afterEach(async () => {
            await Label.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to find a Label", async () => {
            let label = await Label.findOne({name: "Ayam Kukus"});

            let result = await db.findLabelById(label._id);
            expect(result.name).to.be.equal("Ayam Kukus");
        });

        it("should not be able to find a non-existent Label", async () => {
            let result = await db.findLabelById(new Label({name: "Bukan Ayam Kukus"}));
            expect(result).to.be.equal(null);
        });
    });

    describe("findTest()", async () => {
        beforeEach(async () => {
            await Test.create({name: "Ayam"});
        });

        afterEach(async () => {
            await Test.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to find Test", async () => {
            let result = await db.findTest("Ayam");
            expect(result.name).to.be.equal("Ayam");
        });

        it("should not be able to find a non-existent Test", async () => {
            let result = await db.findTest("Bukan Ayam");
            expect(result).to.be.equal(null);
        });
    });

    describe("findAllTest()", async () => {
        beforeEach(async () => {
            await Test.create({name: "Ayam"});
            await Test.create({name: "Kodok"});
        });

        afterEach(async () => {
            await Test.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to fetch all tests", async () => {
            let result = await db.findAllTest();

            expect(result[0]).to.contain({name: "Ayam"});
            expect(result[1]).to.contain({name: "Kodok"});
        });
    });

    describe("deleteTest()", async () => {
        beforeEach(async () => {
            await Test.create({name: "Itik"});
        });

        afterEach(async () => {
            await Test.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to delete a Test", async () => {
            await db.deleteTest("Itik");

            let result = await Test.findOne({name: "Itik"});
            expect(result).to.be.equal(null);
        });
    });

    describe("deleteLabel()", async () => {
        beforeEach(async () => {
            await Label.create({name: "Itik Bakar"});
        });

        afterEach(async () => {
            await Label.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to delete a Label", async () => {
            await db.deleteLabel("Itik Bakar");

            let result = await Label.findOne({name: "Itik Bakar"});
            expect(result).to.be.equal(null);
        });
    });

    describe("deleteImageById()", async () => {
        beforeEach(async () => {
            await Image.create({name: "Itik Bakar Kecap", imagePath: 'uploads/path', imageDiffPath: 'uploads/path_diff'});
        });

        afterEach(async () => {
            await Image.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to delete an Image", async () => {
            let fs_stub = sinon.stub(fs, 'unlink');
            fs_stub.withArgs('uploads/path').callsFake((path) => {return null});
            fs_stub.withArgs('uploads/path_diff').callsFake((path) => {return null});

            let image = await Image.findOne({name: "Itik Bakar Kecap"});
            await db.deleteImageById(image._id);

            let result = await Image.findOne({name: "Itik Bakar Kecap"});
            expect(result).to.equal(null);
        });
    });

    describe("updateBaselineImageOnLabel()", async () => {
        beforeEach(async () => {
            await Label.create({name: "Itik Goreng"});
        });

        afterEach(async () => {
            await Label.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to update baseline image on label", async () => {
            let image = new Image({name: "Gambar Itik Goreng"});
            let image_id = image._id;
            await db.updateBaselineImageOnLabel("Itik Goreng", image);

            let result = await Label.findOne({name: "Itik Goreng"});
            expect(result.baselineImage).to.be.eql(image_id);
        });
    });

    describe("addImageOnLabel()", async () => {
        beforeEach(async () => {
            await Label.create({name: "Itik Goreng"});
        });

        afterEach(async () => {
            await Label.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to add image on label", async () => {
            let image = new Image({name: "Gambar Itik Goreng"});
            let image_id = image._id;
            await db.addImageOnLabel("Itik Goreng", image);

            let result = await Label.findOne({name: "Itik Goreng"});
            expect(result.images).to.be.includes(image_id);
        });
    });

    describe("addLabelOnTest()", async () => {
        beforeEach(async () => {
            await Test.create({name: "Itik"});
        });

        afterEach(async () => {
            await Test.remove({}, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });

        it("should be able to add label on test", async () => {
            let label = new Label({name: "Itik Panggang"});
            let label_id = label._id;
            await db.addLabelOnTest("Itik", label);

            let result = await Test.findOne({name: "Itik"});
            expect(result.labels).to.be.includes(label_id);
        });
    });
});