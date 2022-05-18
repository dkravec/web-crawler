const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: false
}

const reqNum = {
    type: Number,
    required: false
}

const reqBool = {
    type: Boolean,
    required: false
}
const foundInURLsSchema = {
    _id: reqString,
    url: reqString,
    mainHost: reqString
}

const foundImageDataSchema = mongoose.Schema({
    _id: reqString,
    imageHost: reqString,
    image: reqBool,
    imageURL: reqString,
    imageName: reqString,
    amountFound: reqNum,
    foundInURLs: [ foundInURLsSchema ],
});

module.exports = mongoose.model('found-images-schema', foundImageDataSchema);