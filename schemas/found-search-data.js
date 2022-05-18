const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const reqNum = {
    type: Number,
    required: true
}

const subLinkSchema = {
    _id: reqString,
    url: reqString,
    amountFound: reqNum
}

const linksFoundSchema = {
    _id: reqString,
    url: reqString,
    amountFound
}

const foundSearchDataSchema = mongoose.Schema({
    _id: reqString,
    mainHost: reqString,
    amountFound: reqNum,
    // suburls
    sublinks: [ subLinkSchema ],
    // images found on page
    images: [ subLinkSchema ],
    // links found on page
    links: [ linksFoundSchema ],
});

module.exports = mongoose.model('found-search-data', foundSearchDataSchema);