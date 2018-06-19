#!/usr/bin/env node
var program = require('commander');
const clap = require('./core');
const fs = require('fs')

// you run this with
// clap mycode.js

program
  .arguments('<file>')
  .action(function(file) {
    fs.readFile(file,'utf8',function(err,data) {
      err ? console.log(err) : false;
      eval(data)
    })
  })
  .parse(process.argv);
