const db                = require('./db/db');
const compare           = require('./compare');
const isNull            = require('util').isNull;
const isNullOrUndefined = require('util').isNullOrUndefined;

async function createImage(imageObj, labelName, testName) {
    let currentLabel;
    console.log("/////INITIATE CREATE IMAGE OPERATIONS/////\n");

    db.findTest(testName)
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
    .then((value) => {
        let baselineImage = currentLabel.baselineImage;
        console.log("IMAGE VALUE : " + value[0] + "\n");
        console.log("CURRENT BASELINE : " + baselineImage + "\n");
        if (isNullOrUndefined(baselineImage.imagePath)) {
            db.findImageById(baselineImage).then((fetchedImage) => {
                compare.getDiff(imageObj.path, fetchedImage.imagePath);
                return {
                    error: false,
                    image: fetchedImage
                };
            });
        } else {
            compare.getDiff(imageObj.path, baselineImage.imagePath);
            return {
                error: false,
                image: baselineImage
            };
        };
    })
    .catch((error) => {
        console.log(error);
        return {error: true, message: error.message};
    });
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
    createImage,
    changeBaseline
}