const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const urlParser = require('url');
const urlExist = require('url-exist');
require('dotenv').config();
const mongoose = require('mongoose');
const foundImageDataSchema = require('./schemas/found-images-schema');
const foundSearchDataSchema = require('./schemas/found-links-schema');

const startURL = 'https://novapro.net';
const stay = true;
const onePage = false;
const images = false;
const toDownloadImages = false;
const useMongo = false;
const mongoLink = process.env.MONGO_URL;
const maxAmount = 500;

function checktime() { var d = new Date(); const timeMS = d.getTime(); return timeMS };

var readyTime = checktime()

if (useMongo) {
    mongoose.connect(mongoLink, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

const seenURLs = { };
const seenImages = { };
var currentAmount = 0;

function getURL({link, parsedURL}) {
    if (link.startsWith(`https://`) || link.startsWith(`http://`) ) return link;
    else if (link.startsWith('//')) return `https:${link}`
    else if (link.startsWith('/')) return `${parsedURL.protocol}//${parsedURL.hostname}${link}`;
    else return `${parsedURL.href}${link}`;
};

function seperateURL({ link }) {
    const sep = link.split(/[/]+/)
    const protocol = sep[0]
    const main = sep[1]
    sep.splice(0,2)

    if (!protocol.startsWith("http")) return { link: false, error : "no protocol", protocol, main, path: sep };
    else if (main.includes("@")) return { link: false, error: "unwanted credentials", protocol, main, path: sep };
    return { link: true, protocol, main, path: sep };
};

async function crawl({ url }) {
    if (currentAmount > maxAmount) return console.log("finished")
    else currentAmount++ 

    if (seenURLs[url]) return; // already seen link
    seenURLs[url] = true; // now remembers url

    // console.log(seenURLs)
    if (onePage && startURL!=url) return console.log(`found link: ${url}`)
    else console.log(`${currentAmount} ${checktime() - readyTime} crawling ${url}`);

    const checkURL = seperateURL({link: url});
    if (checkURL.error) return console.log(`-- error: ${checkURL?.error}`);

    const exists = await urlExist(url);
    if (!exists) return console.log(`-- error: link doesnt exist ${url}`);

    const res = await fetch(url);
    if (!res.ok) return console.log(res);

    const html = await res.text();
    const parsedURL = urlParser.parse(url);
 
    const $ = cheerio.load(html);

    // IF IMAGES ARE REQUESTED
    if (images) {
        const imageURLs = $('img')
            .map((i, link) => link.attribs.src)
            .get();

        imageURLs.forEach(async imageURL => {
            const newImageURL = getURL({ "link": imageURL, parsedURL });
            if (useMongo) saveImageToMongo({url, imageURL: newImageURL, parsedURL});
            
            if (!seenImages[newImageURL]) {
                seenImages[newImageURL] = true;

                console.log(`image found: ${newImageURL}`);
                if (toDownloadImages) downloadImage({ newImageURL, imageURL, parsedURL });
            };
        });
    };

    const links = $('a')
        .map((i, link) => link.attribs.href)
        .get();

    links.forEach((link) => {
        const newURL = getURL({ link, parsedURL });
        const samehost = newURL.startsWith(getURL({link: '/', parsedURL}));

        if (useMongo) saveLinkToMongo({ url: link, parsedURL, hostURL: url})
       // console.log(`${link} : ${newURL} : ${url}`)
        if (!stay || stay && samehost) crawl({ url: newURL });
        else console.log("-- error: Out of domain. ");
    });
};

function downloadImage({ newImageURL, imageURL, parsedURL }) {    
    fetch(newImageURL).then(async response => {
        const filename = path.basename(imageURL);
        const dest = fs.createWriteStream(`images/${filename}`)
        await response.body.pipe(dest);
    });
};

async function saveLinkToMongo({url, parsedURL, hostURL}) {
    const newLinkParsed = urlParser.parse(url);
    
    const findLink = await foundSearchDataSchema.findOne({ _id: hostURL });
    //console.log(findLink)
    /*if (!findLink) {
        await foundSearchDataSchema.create({ _id: hostURL, mainHost: parsedURL.hostname, amountFound: 0 })
        await foundSearchDataSchema.findOneAndUpdate({
            _id: hostURL,
        }, {
            $push: { sublinks: { url, mainHost: newLinkParsed.hostname}}
        }, {
            upsert: true
        })
    }*/

    await foundSearchDataSchema.findOneAndUpdate({
        _id: hostURL,
    }, {
        $push: { sublinks: { url, mainHost: newLinkParsed.hostname}}
    }, {
        upsert: true
    })
}

async function saveImageToMongo({url, mainUrlParsed, imageURL, parsedURL}) {
    // url: on which page image was found
    // imageURL: url of image
    // parsedURL: on which page image was found 

    const imageURLParse = urlParser.parse(imageURL);
    const filename = path.basename(imageURL);

    const findImage = await foundImageDataSchema.findOne({ _id: imageURL });
    if (!findImage) await foundImageDataSchema.create({ _id: imageURL, image: true, imageHost: imageURLParse.hostname, amountFound: 1, imageURL, imageName: filename});
    else {
        await foundImageDataSchema.findOneAndUpdate({ 
            _id: imageURL
        }, {
            imageHost: imageURLParse.hostname,
            amountFound: findImage.amountFound ? findImage.amountFound + 1 : 2,
            //image: true,
            //imageName: filename ? filename : 'help'
            // $push: { foundInURLs: { url: url, mainHost: parsedURL.hostname}}
        }, {
            upsert: true
        });
    };

    await foundImageDataSchema.findOneAndUpdate({
        _id: imageURL,
    }, {
        $push: { foundInURLs: { url, mainHost: parsedURL.hostname }}
    });

    return;
};

crawl({ url: startURL });