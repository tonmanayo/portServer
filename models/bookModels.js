const mongoose = require('mongoose'),
    Schema = mongoose.Schema();

const bookModel = new Schema({
    title: {
        type: String
    },
    author: {type: String}
});

model.exports = mongoose.model('Book', bookModel);