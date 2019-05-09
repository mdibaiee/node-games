#!/usr/bin/env node

i18n = require('i18n');
path = require('path');
language = process.argv[3]

i18n.configure({
  directory: path.join(__dirname, '/locales')
});

i18n.setLocale(language || 'en');

game = process.argv[2];

if (!game) {
  console.log('usage: node-games <game>');
  console.log('');
  console.log(i18n.__('Games'));
  console.log('- spacecraft');
  console.log('- snake');
  console.log('- tanks');
  return;
}

require('babel-polyfill');

require(__dirname + '/build/' + game);
