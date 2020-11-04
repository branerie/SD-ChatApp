const mongoose = require('mongoose')
const config = require('../config/config')

function connectDB() {
    mongoose.connect(config.URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('Database is setup and running');

    });
}

module.exports = connectDB;