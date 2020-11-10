const mongoose = require('mongoose')
const config = require('./config')

function connectDB() {
    mongoose.connect(config.URL, { 
        useNewUrlParser: true, 
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, error => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('Database is setup and running');

    });
}

module.exports = connectDB;
