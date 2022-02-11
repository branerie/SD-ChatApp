const controllers = require('../controllers/all')

module.exports = app => {
    app.use('/', controllers.user)
}
