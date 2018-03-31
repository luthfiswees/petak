const mongoose = require('mongoose');

switch(process.env.PETAK_ENV){
    case 'DEVELOPMENT':
        mongoose.connect('mongodb://'+ process.env.PETAK_HOST +'/' + process.env.PETAK_DATABASE_NAME + '_development');
    case 'TEST':
        mongoose.connect('mongodb://'+ process.env.PETAK_HOST +'/' + process.env.PETAK_DATABASE_NAME + '_test');
    case 'PRODUCTION':
        mongoose.connect('mongodb://'+ process.env.PETAK_HOST +'/' + process.env.PETAK_DATABASE_NAME + '_production');
}

module.exports = {
    mongoose
}