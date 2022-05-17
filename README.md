# Web Scrapper
Project created by Daniel Kravec, on May 17, 2022.

## About
This is a simple web scrapper, you can save images and see the process of getting every link in the website.

## Usage
Setup on line 78-83.

This lets you control what you want to crawl on the web.
```js
78 | crawl({
79 |    url: 'https://novapro.net',
80 |    stay: true,
81 |    images: true,
82 |    toDownloadImages: false
83 | });
```
---

url: Link you want to crawl.

--- 

stay: true / false.

if true, it will stay with the main host of site.
if false, it will find every single possible link (until failing).

--- 

images: true / false.

if true, it will look for and save images to a folder /images.

if false, it will not look for and fetch images.

This may not download all images found, and may also cause an issue.

---

## Version History

### 1.0 (1.2022.05.17) 
- basic webcrawler (doesnt save links).
- save images.
- make sure it stays on the same host.
- checks if the link actually exists before trying to fetch.

### 1.0.1 (2.2022.05.17) 
- added option to download image (but still search for images)
- seperated download image into a seperate function
- changed order of saving 

## Found Bugs

### 1.0 (1.2022.05.17) (unsolved)
Eventually fails due to different problems, its not consistent.

reasons found.
- reason: socket hang up.
- reason: read ECONNRESET.
- reason: getaddrinfo ENOTFOUND.
- maybe when trying to fetch a .pdf

some docs
- https://stackoverflow.com/questions/59591058/econnreset-error-while-fetching-an-url-in-node-js

trying to write a lot of images at once.

Error: EISDIR: illegal operation on a directory, open 'images/'.

Emitted 'error' event on WriteStream instance at:

### 1.0.1 (2.2022.05.17) (unsolved) 

program thinks some links dont exist


## Links used

- https://www.youtube.com/watch?v=5THvDt_sbfQ