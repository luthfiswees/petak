const db                = require('../db/db');
const compare           = require('./compare');
const isNull            = require('util').isNull;
const isNullOrUndefined = require('util').isNullOrUndefined;

async function createImage(imageObj, labelName, testName) {
    let currentLabel, returnValue;
    console.log("/////INITIATE CREATE IMAGE OPERATIONS/////\n");

    return await db.findTest(testName)
        .then((testValue) => {
            console.log("FIND TEST VALUE : " + testValue + "\n");
            if (isNull(testValue)){
                return db.createTest(testName);
            } else {
                return new Promise((resolve, reject) => resolve(testValue));
            }
        })
        .then((testValue) => {
            console.log("TEST VALUE : " + testValue + "\n");
            return db.findLabel(labelName);
        })
        .then((labelValue) => {
            console.log("FIND LABEL VALUE : " + labelValue + "\n");
            if (isNull(labelValue)){
                return db.createLabel(labelName)
                        .then((newLabel) => {
                            console.log("NEW LABEL VALUE : " + newLabel + "\n");
                            return db.addLabelOnTest(testName, newLabel);
                        });
            } else {
                return new Promise((resolve, reject) => resolve(labelValue));
            }
        })
        .then((labelValue) => {
            currentLabel = labelValue;
            console.log("LABEL VALUE : " + labelValue + "\n");
            return db.createImage(imageObj);    
        })
        .then((imageValue) => {
            console.log("CURRENT BASELINE ON LABEL : " + currentLabel.baselineImage);
            if (isNullOrUndefined(currentLabel.baselineImage)){
                return db.updateBaselineImageOnLabel(labelName, imageValue);
            } else {
                return new Promise((resolve, reject) => resolve([imageValue, currentLabel]));
            }
        })
        .then((value) => {
            currentLabel = value[1];
            console.log("NEW LABEL VALUE : " + currentLabel + "\n");
            console.log("NEW IMAGE VALUE : " + value[0] + "\n");
            return db.addImageOnLabel(labelName, value[0]);
        })
        .then(async(value) => {
            let baselineImage = currentLabel.baselineImage;
            console.log("IMAGE VALUE : " + value[0] + "\n");
            console.log("CURRENT BASELINE : " + baselineImage + "\n");
            if (isNullOrUndefined(baselineImage.imagePath)) {
                let imageResponse = await db.findImageById(baselineImage).then(async (fetchedImage) => {
                    await compare.getDiff(imageObj.path, fetchedImage.imagePath);
                    return new Promise((resolve, reject) => resolve({
                        error: false,
                        data: fetchedImage
                    }));
                });
                return imageResponse;
            } else {
                await compare.getDiff(imageObj.path, baselineImage.imagePath);
                return new Promise((resolve, reject) => resolve({
                    error: false,
                    data: baselineImage
                }));
            };
        })
        .catch((error) => {
            console.log(error);
            return {error: true, message: error.message};
        });
}

async function getAllTest() {
    let tests = await db.findAllTest().then((value) => {
        console.log(value);
        if (value == null) {
            return new Promise((resolve, reject) => resolve({
                error: true,
                message: "There are no test avalaible"
            }));
        } else {
            return new Promise((resolve, reject) => resolve({
                error: false,
                data: value
            }));
        }
    });
    return tests;
}

async function getAllLabelOnTest(testname) {
    let test = await db.findTest(testname)
                .then((testObj) => {
                    if (testObj === null) {
                        return new Promise((resolve, reject) => resolve(null));
                    } else {
                        return new Promise((resolve, reject) => resolve(testObj));
                    }
                });
    let labels = await test.labels.map(async (value) => {
        return db.findLabelById(value);
    });
    let labelValues = Promise.all(labels).then((value) => {
        return new Promise((resolve, reject) => resolve({
            error: false,
            data: value
        }));
    });
    return labelValues;
}

async function getAllImageOnLabel(labelname) {
    let label = await db.findLabel(labelname)
                    .then((labelObj) => {
                        if (labelObj === null) {
                            return new Promise((resolve, reject) => resolve(null));
                        } else {
                            return new Promise((resolve, reject) => resolve(labelObj));
                        }
                    });
    let images = await label.images.map(async (value) => {
        return db.findImageById(value);
    });
    let imageValues = Promise.all(images).then((value) => {
        return new Promise((resolve, reject) => resolve({
            error: false,
            data: value
        }));
    });
    return imageValues;
}

async function deleteLabel(labelname) {
    let label = (await db.findLabel(labelname));
    await label.images.forEach(async (element) => {
        await db.deleteImageById(element);
    });
    let tests = (await db.findAllTest());
    console.log("Test where label is located : " + tests);
    await tests.forEach(async (element) => {
        console.log("Element : " + element);
        if (element.labels){
            let labelIndex = element.labels.indexOf(label._id);
            console.log("Label index : " + labelIndex);
            if (labelIndex > -1) {
                await db.findTest(element.name).then((testObj) => {
                    testObj.labels.splice(labelIndex, 1);
                    console.log("Current " + testObj.name + " labels condition : " + testObj.labels);
                    testObj.save();
                });
            }
        }
    });
    let successfull = await db.deleteLabel(labelname);
    return successfull;
}

async function deleteTest(testname){
    try {
        let test = await db.findTest(testname);
        await test.labels.forEach(async (label) => {
            let labelObj = await db.findLabelById(label);
            await deleteLabel(labelObj.name);
        });
        await db.deleteTest(testname);
        return {
            error: false,
            message: "Successfully deleting test " + testname
        }
    } catch(e) {
        return {
            error: true,
            message: e.message
        }
    }
}

function changeBaseline(labelName, imageName) {
    db.findImage(imageName, (error, image) => {
        if (!error) {
            db.updateBaselineImageOnLabel(labelName, image, (error) => {
                if (error){
                    console.log("Baseline update failed");
                    return true;
                } else {
                    console.log("Baseline update succeed")
                    return false;
                }
            });
        }
    });
}

module.exports = {
    getAllTest,
    getAllLabelOnTest,
    getAllImageOnLabel,
    createImage,
    deleteTest,
    deleteLabel,
    changeBaseline
}