const config = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
    SECRET_KEY: process.env.SECRET_KEY
}

module.exports = config
