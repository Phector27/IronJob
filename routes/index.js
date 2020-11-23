/*jshint esversion: 6 */


module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))

    app.use('/company', require('./company.routes.js'))

    app.use('/academy', require('./academy.routes.js'))
}