#!/usr/bin/env node
const vorpal = require('vorpal')();
const clap = require('./core');

vorpal
    .delimiter('clap$')
    .show();

vorpal
  .catch('[words...]', 'Catches incorrect commands')
  .action(function (args, cb) {
    this.log(args.words.join(' ') + ' is not a valid command.');
    cb();
  });


vorpal
    .command('load <filepath>')
    .description('Loads audio')
    .action(function(args, callback) {
      clap.load(false, function() {
        this.log('=> track1');
        callback()
      }.bind(this))
    });


vorpal
    .command('reverse [probability]')
    .description('Reverse audio in sample(s)')
    .action(function(args, callback) {
      clap.reverse(args.probability)
      this.log('=> track1');
      callback();
    });



vorpal
    .command('normalize [condition]')
    .description('')
    .action(function(args, callback) {
      clap.normalize()
      this.log('=> track1');
      callback();
    });


vorpal
    .command('multiply <n>')
    .description('Reverse audio in sample(s)')
    .action(function(args, callback) {
      clap.multiply(args.n)
      this.log('=> track1');
      callback();
    });

vorpal
    .command('stretch <ratio>')
    .description('')
    .action(function(args, callback) {
      clap.stretch(args.ratio)
      this.log('=> track1');
      callback();
    });

/* buggy...
vorpal
    .command('play [index]')
    .description('')
    // add -loop option
    .action(function(args, callback) {
      clap.play(args.index)
      this.log('=> track1');
      callback();
    });
*/

vorpal
    .command('save <filename>')
    .description('')
    .action(function(args, callback) {
      clap.save(args.filename)
      this.log('=> track1');
      callback();
    });

vorpal
    .command('join [condition]')
    .description('Reverse audio in sample(s)')
    .action(function(args, callback) {
      clap.reverse()
      this.log('=> track1');
      callback();
    });

vorpal
    .command('chopEvery [condition]')
    .description('Reverse audio in sample(s)')
    .action(function(args, callback) {
      clap.reverse()
      this.log('=> track1');
      callback();
    });

vorpal
    .command('scramble [condition]')
    .description('Reverse audio in sample(s)')
    .action(function(args, callback) {
      clap.reverse()
      this.log('=> track1');
      callback();
    });



/*

vorpal
  .command('foo <requiredArg> [optionalArg]')
  .option('-v, --verbose', 'Print foobar instead.')
  .description('Outputs "bar".')
  .alias('foosball')
  .action(function(args, callback) {
    if (args.options.verbose) {
      this.log('foobar');
    } else {
      this.log('bar');
    }
    callback();
  });


 */

/*
Goals:

Create buffer
Fill with sine tone
Repeat N Times
Chop into N pieces
Time stretch each in an array by a different amount
 - stretch every n



Normalize
Fade in / out
Apply envelope
Filter

options
-v (vis)
-p (play)
-s filename (save)


 */
