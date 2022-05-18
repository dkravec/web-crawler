const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const urlParser = require('url');
const urlExist = require('url-exist');
require('dotenv').config();
const mongoose = require('mongoose');

const startURL = 'https://novapro.net/';
const stay = true;
const images = true;
const toDownloadImages = false;
const onePage = false;
const useMongo = false;
const mongoLink = process.env.MONGO_URL;

if (useMongo) {
    mongoose.connect(mongoLink, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

const seenURLs = { };
const seenImages = { };

function getURL({link, parsedURL}) {
    if (link.startsWith(`https://`) || link.startsWith(`http://`) ) return link;
    else if (link.startsWith('//')) return `https:${link}`
    else if (link.startsWith('/')) return `${parsedURL.protocol}//${parsedURL.hostname}${link}`;
    else return `${parsedURL.href}${link}`;
};

async function crawl({ url }) {
    if (seenURLs[url]) return; // already seen link
    seenURLs[url] = true; // now remembers url

    if (onePage && startURL!=url) return console.log(`found link: ${url}`)
    else console.log(`crawling ${url}`);

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
            if (useMongo) await saveImageToMongo(imageURL, parsedURL);
            
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

        if (!stay || stay && samehost) {
            crawl({
                url: newURL,
                stay,
                images,
                toDownloadImages
            });
        };
    });
};

function downloadImage({ newImageURL, imageURL, parsedURL }) {    
    fetch(newImageURL).then(async response => {
        const filename = path.basename(imageURL);
        const dest = fs.createWriteStream(`images/${filename}`)
        await response.body.pipe(dest);
    });
};

async function saveImageToMongo({}) {
    console.log('mock send to mongo')
}

crawl({ url: startURL });