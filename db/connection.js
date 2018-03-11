const mongoose = require('mongoose');

mongoose.connect('mongodb://'+ process.env.PETAK_HOST +'/' + process.env.PETAK_DATABASE_NAME);

module.exports = {
    mongoose
}