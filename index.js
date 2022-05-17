const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const urlParser = require('url');
const urlExist = require('url-exist');
require('dotenv').config();

const seenURLs = { };
const seenImages = { };

function getURL({link, parsedURL}) {
    if (link.startsWith(`${parsedURL.protocol}//`)) return link;
    else if (link.startsWith(`/`)) return `${parsedURL.protocol}//${parsedURL.hostname}${link}`;
    else return `${parsedURL.href}${link}`;
};

async function crawl({ url, stay, images, toDownloadImages}) {
    if (seenURLs[url]) return; // already seen link
    seenURLs[url] = true; // now remembers url
    console.log(`crawling ${url}`);

    const exists = await urlExist(url);
    if (!exists) return console.log(`-- error: link doesnt exist ${url}`);

    const res = await fetch(url);
    if (!res.ok) return console.log('-- error');
    const html = await res.text();
    const parsedURL = urlParser.parse(url);
 
    const $ = cheerio.load(html);

    // IF IMAGES ARE REQUESTED
    if (images) {
        const imageURLs = $('img')
            .map((i, link) => link.attribs.src)
            .get();

        imageURLs.forEach(imageURL => {
            if (!seenImages[imageURL]) {
                console.log(`image found: ${imageURL}`)
                seenImages[imageURL] = true; // now remembers url
                const newImageURL = getURL({ "link": imageURL, parsedURL })
                if (toDownloadImages) downloadImage({ newImageURL, imageURL, parsedURL })
            }
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
    // console.log('downloading')
    fetch(newImageURL).then(async response => {
        const filename = path.basename(imageURL);
        const dest = fs.createWriteStream(`images/${filename}`)
        await response.body.pipe(dest);
        // console.log(`done ${filename} : ${newImageURL}`)
    });
};

crawl({
    url: 'https://novapro.net/',
    stay: true,
    images: true,
    toDownloadImages: false
});