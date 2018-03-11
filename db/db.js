const model  = require('./model');
const isNull = require('util').isNull;

const Test  = model.Test;
const Label = model.Label;
const Image = model.Image;

var createImage = (imageObj) => {
    return new Promise((resolve, reject) => {
        Image.create({
          name: imageObj.filename,
          imagePath: imageObj.path,
          imageDiffPath: imageObj.path + "_diff"  
        }, (error, image) => {
            if (error) {
                reject("Failed to create image. Details : " + error + "\n");
            } else {
                resolve(image);
            }
        });
    });
};

var findImage = (name) => {
    Image.where({
        name: name    
    }).findOne((error, image) => {
        if (error){
            console.log("Image not found : ", error);
            //callback(true, null);
            return null;
        } else {
            console.log("Image found");
            //callback(false, image);
            return image;
        }
    });
};

var findImageById = (id) => {
    return new Promise((resolve, reject) => {
        Image.findById(id, (error, image) => {
            if (error) {
                reject("Image not found. Details : " + error + "\n");
            } else {
                resolve(image);
            }
        });
    })
}

var createLabel = (name) => {
    return new Promise((resolve, reject) => {
        Label.create({
            name: name
        }, (error, test) => {
            if (error) {
                reject("Failed to create label. Details : " + error + "\n");
            } else {
                resolve(test);
            }
        });
    });
};

var findLabel = (name) => {
    return new Promise((resolve, reject) => {
        Label.findOne({
            name: name
        }, (error, label) => {
            if (error) {
                resolve(null);
            } else {
                resolve(label);
            }
        });
    });
};

var createTest = (name) => {
    return new Promise((resolve, reject) => {
        Test.create({
            name: name
        }, (error, test) => {
            if (error) {
                reject("Failed to create test. Details : " + error + "\n");
            } else {
                resolve(test);
            }
        });
    });
};

var findTest = (name) => {
    return new Promise((resolve, reject) => {
        Test.findOne({
            name: name
        }, (error, test) => {
            if (error) {
                resolve(null);
            } else {
                resolve(test);
            }
        });
    });
};

var updateBaselineImageOnLabel = async (name, baseline) => {
    return new Promise((resolve, reject) => {
        findLabel(name).then((label) => {
            console.log("IMAGE FOR BASELINE : " + baseline + "\n");
            console.log("LABEL TO ATTACH BASELINE : " + label + "\n");
            if (isNull(label)){
                reject("Label not found, there is no label to attach baseline on");
            } else {
                label.baselineImage = baseline;
                label.save().then((newLabel) => {
                    try {
                        resolve([newLabel.baselineImage, newLabel]);
                    } catch(e) {
                        reject("Label failed to save, no baseline image attached. Details :\n" + e);
                    }
                });
            }
        });
    });
};

var addImageOnLabel = async (name, image) => {
    return new Promise((resolve, reject) =>{
        findLabel(name).then((label) => {
            console.log("IMAGE TO ADD TO LABEL : " + image + "\n");
            if (isNull(label)){
                reject("Label not found, there is no label to add image on");
            } else {
                if (label.images){
                    label.images = [image];
                } else {
                    label.images = label.images.push(image);
                }
                label.save().then((label) => {
                    try {
                        resolve([image, label]);
                    } catch (e) {
                        reject("Label failed to save, no image attached. Details :\n" + e);
                    }
                });
            }
        });
    });
}

var addLabelOnTest = (name, label) => {
    return new Promise((resolve, reject) => {
        findTest(name).then((test) => {
            console.log("TEST TO ATTACH LABEL : " + test + "\n");
            if (isNull(test)){
                reject("Test not found, there is no test to attach label on");
            } else {
                if (test.labels){
                    test.labels = [label];
                } else {
                    test.labels = test.labels.push(label);
                }
                test.save().then((test) => {
                    try {
                        resolve(label);
                    } catch(e) {
                        reject("Test failed to save, no label attached. Details :\n " + e);
                    }
                });
            }
        });
    });
}

module.exports = {
    createImage,
    createLabel,
    createTest,
    findImage,
    findImageById,
    findLabel,
    findTest,
    updateBaselineImageOnLabel,
    addLabelOnTest,
    addImageOnLabel
}