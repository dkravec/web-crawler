# Web Scrapper
Project created by Daniel Kravec, on May 17, 2022.

## About
This is a simple web scrapper, you can save images and see the process of getting every link in the website.

## Usage
Setup on line 10-16.

This lets you control what you want to crawl on the web.
```js
10 | const startURL = 'https://novapro.net/';
11 | const stay = true;
12 | const images = true;
13 | const toDownloadImages = false;
14 | const onePage = false;
15 | const useMongo = false;
16 | const mongoLink = process.env.MONGO_URL;
```
--- 
| name | type | description | 
| - | - | - |
| startURL | String | Link you want to start crawling the web from. | 
| stay | Boolean |  Do you want to stay with host domain. |
| images | Boolean | Do you want to look for images. | 
| toDownloadImages | Boolean | Do you want to download images in /images. |
| onePage | Boolean | Do you want to stay on page. |
| useMongo | Boolean | Do you want to save data to MongoDB. |
| mongoLink | String | MongoDB connection link. |
---
## Version History

### 1.0 (1.2022.05.17) 
- basic webcrawler (doesnt save links).
- save images.
- make sure it stays on the same host.
- checks if the link actually exists before trying to fetch.

### 1.0.1 (2.2022.05.17) 
- added option to download image (but still search for images).
- seperated download image into a seperate function.
- changed order of saving.

### 1.0.2 (3.2022.05.17) 
- changed way start data is entered.
- you can now connect to mongo.
- there is now an option to have stay on one page.
- fixed getURL, when url starts with //.
- console logs error if fetch is not res.ok.
- created foundSearchDataSchema, currently unused.

## Found Bugs

### 1.0 (1.2022.05.17) (unsolved)
Eventually fails due to different problems, its not consistent.

reasons found.
- reason: socket hang up.
- reason: read ECONNRESET.
- reason: getaddrinfo ENOTFOUND.
- reason: connect ECONNREFUSED
- maybe when trying to fetch a .pdf

some docs
- https://stackoverflow.com/questions/59591058/econnreset-error-while-fetching-an-url-in-node-js

trying to write a lot of images at once.

Error: EISDIR: illegal operation on a directory, open 'images/'.

Emitted 'error' event on WriteStream instance at:

### 1.0.1 (2.2022.05.17) (unsolved) 

program thinks some links dont exist that exists, doesnt.

### 1.0.2 (3.2022.05.17) (unsolved) 

Error: ENAMETOOLONG: name too long, open 'images/220px-%D0%9A%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81%D0%BD%D0%B0%D1%8F_%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0_%D0%B2%D0%BE%D0%B9%D1%81%D0%BA_%D0%92%D0%BE%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%BE%D0%B3%D0%BE_%D0%B2%D0%BE%D0%B5%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BE%D0%BA%D1%80%D1%83%D0%B3%D0%B0_10.jpeg'

Emitted 'error' event on WriteStream instance at:

## Links used

- https://www.youtube.com/watch?v=5THvDt_sbfQ