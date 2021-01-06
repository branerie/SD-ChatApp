const mongoose = require('mongoose')
const config = require('./config')

const options = {
    useNewUrlParser: true, 
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true
}

function connectDB() {
    mongoose.connect(config.DB_URL, options, error => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('Database is setup and running');

    });
}

module.exports = connectDB;
