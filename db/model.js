const db       = require('./connection'); 
const Schema   = db.mongoose.Schema;

const testSchema = new Schema({
    name: String,
    labels: [{type: Schema.ObjectId, ref: 'Label'}]
});

const labelSchema = new Schema({
    name: String,
    baselineImage: {type: Schema.ObjectId, ref: 'Image'},
    images: [{type: Schema.ObjectId, ref: 'Image'}]
});

const imageSchema = new Schema({
    name: String,
    imagePath: String,
    imageDiffPath: String
});

const Test  = db.mongoose.model('Test', testSchema);
const Label = db.mongoose.model('Label', labelSchema);
const Image = db.mongoose.model('Image', imageSchema);

module.exports = {
    Test, Label, Image
}