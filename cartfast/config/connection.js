const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
});