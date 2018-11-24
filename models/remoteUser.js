const mongoose = require('mongoose');

const remoteUser = new mongoose.Schema({
    ip: {type: String},
    pic: {type: Buffer}
});

module.exports = mongoose.model('remoteUser', remoteUser);