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

const subLinkSchema = {
    _id: reqString,
    url: reqString,
    amountFound: reqNum
}

const linksFoundSchema = {
    _id: reqString,
    url: reqString,
    amountFound: reqString
}

const foundInURLsSchema = {
    _id: reqString,
    url: reqString,
    mainHost: reqString
}

const foundSearchDataSchema = mongoose.Schema({
    _id: reqString,
    mainHost: reqString,
    amountFound: reqNum,
    image: reqBool,
    imageName: reqString,
    foundInURLs: [ foundInURLsSchema ],
    
    // suburls
    sublinks: [ subLinkSchema ],
    // _id pointing to foundimageshema
    images: [ reqString ],
    // links found on page
    links: [ linksFoundSchema ],
});

module.exports = mongoose.model('found-links-schema', foundSearchDataSchema);