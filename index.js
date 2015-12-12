#!/usr/bin/env node

var game = process.argv[2];

if (!game) {
  console.log('usage: node-games <game>')
  console.log('');
  console.log('Games');
  console.log('- spacecraft');
  console.log('- snake');
  return;
}

require('babel-polyfill');

require(__dirname + '/build/' + game);
