var vorpal = require('vorpal')();
const { clap } = require('./core');

vorpal
    .delimiter('clap$')
    .show();

// duck
vorpal
    .command('reverse [condition]')
    .description('Reverse audio in sample(s)')
    .action(function(args, callback) {
      clap.reverse()
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
