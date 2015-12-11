#!/usr/bin/env node

var game = process.argv[2];

if (!game) {
  console.log('usage: node-games <game>')
  console.log('');
  console.log('Games');
  console.log('- spacecraft');
  return;
}

require('babel-polyfill');
require('babel-core/register');

require(__dirname + '/' + game);
