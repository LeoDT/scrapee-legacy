#!/usr/bin/env node

const http = require('http');
const fs = require('fs-extra');
const path = require('path');

const baseUrl = 'http://localhost:3333/download/scrapee/common';
const languages = ['en', 'zh-CN'];

const dist = path.resolve(__dirname, '..', 'src', 'assets', 'i18n');

fs.emptyDirSync(dist);

languages.forEach(async language => {
  console.log(`downloading ${language}`);

  const filePath = path.resolve(dist, `${language}.json`);

  const file = fs.createWriteStream(filePath);

  http.get(`${baseUrl}/${language}/`, response => {
    response.pipe(file);

    console.log(`${language} downloaded`);
  });
});
