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
            return null;
        } else {
            console.log("Image found");
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

var deleteImageById = (id) => {
    return new Promise((resolve, reject) => {
        Image.remove({ _id: id}, (error) => {
            if (error) {
                reject("Failed to remove image with id " + id);
            } else {
                resolve({
                    error: false,
                    message: "Successfully delete image " + id
                });
            }
        });
    });
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

var findLabelById = (id) => {
    return new Promise((resolve, reject) => {
        Label.findById(id, (error, label) => {
            if (error) {
                reject("Label not found. Details : " + error + "\n");
            } else {
                resolve(label);
            }
        });
    })
}

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

var deleteLabel = (name) => {
    return new Promise((resolve, reject) => {
        Label.remove({
            name: name
        }, (error) => {
            if (error){
                reject("Failed to delete label " + name);
            } else {
                resolve({
                    error: false,
                    message: "Successfully delete label " + name
                });
            }
        });
    });
}

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

var findAllTest = () => {
    return new Promise((resolve, reject) => {
        Test.find({}, (error, tests) => {
            if (error){
                resolve(null);
            } else {
                resolve(tests);
            }
        });
    });
}

var deleteTest = (name) => {
    return new Promise((resolve, reject) => {
        Test.remove({
            name: name
        }, (error) => {
            if (error){
                reject("Failed to delete test " + name);
            } else {
                resolve({
                    error: false,
                    message: "Successfully delete test " + name
                });
            }
        });
    });
}

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
                    label.images.push(image);
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
                    test.labels.push(label);
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
    findLabelById,
    findTest,
    findAllTest,
    deleteImageById,
    deleteLabel,
    deleteTest,
    updateBaselineImageOnLabel,
    addLabelOnTest,
    addImageOnLabel
}