// CLAP
// Command Line Audio Processing
//

const play = require('audio-play');
var load = require('audio-loader')
let util = require('audio-buffer-utils')
const toWav = require('audiobuffer-to-wav');
let Canvas = require('drawille')
let bt = require('./bt');
let fs = require('fs');

let track1, playback;

let tracks = []
let trackIndex = -1;

function setTrack() {
  let track = tracks[trackIndex]
}

/*
let Track = function() {

  this.buffers = []

} */

// new track is just [], empty array for buffers



// track api

module.exports.load = function(filename, callback) {

  if (trackIndex < 0 ) { trackIndex++; setTrack() }

  // load one file
  load('./samples/A4v3.wav').then(function (buffer) {

    track = [ buffer ]

    drawTrack()
    callback()

  })

}

module.exports.reverse = function(probability) {

  if (!probability && probability !== 0) { probability = 1 }
  track.forEach((buff) => {
    if (Math.random()<probability) {
      util.reverse( buff )
    }
  })

  drawTrack()

}


module.exports.multiply = function(n) {

  let buffers = []
  for (var i=0;i<n;i++) {
    buffers.push( util.clone( track[ i%track.length ] ) )
  }
  track = buffers
  drawTrack()

}



module.exports.normalize = function() {

  track.forEach((buff) => {
    util.normalize( buff )
  })

  drawTrack()

}


module.exports.stretch = function(ratio) {

  let buffers = []

  // loop though each buffer in current track
  track.forEach((buff) => {

    let rawData = util.data( buff )

    let newData = []
    let newLength = Math.floor( rawData[0].length * ratio )

    rawData.forEach((channel,channelNum) => {

      newData.push([])

      for (var i=0;i<newLength;i++) {
        let sourceLocation = (i / newLength) * channel.length
        let interpOffset = sourceLocation - Math.floor(sourceLocation)
        let firstValue = channel[Math.floor(sourceLocation)]
        let secondValue = channel[Math.floor(sourceLocation) + 1]
        let value = bt.interp(interpOffset, firstValue, secondValue)
        newData[channelNum].push( value )
      }

    })

    buffers.push( util.create(newData) )

  })

  track = buffers
  drawTrack()

}


module.exports.play = function(index=0, loop) {
  //play audio buffer with possible options
  playback = play(track[index], {
     //start/end time, can be negative to measure from the end
     start: 0,
     end: track[index].duration,

     //repeat playback within start/end
     loop: false,

     //start playing immediately
     autoplay: true
  }, function() {
    playback.pause();
  });
}



//save
module.exports.save = function(filename) {

  let wav = toWav(track[0]);
  var chunk = new Uint8Array(wav);
  fs.appendFile(filename+'.wav', new Buffer(chunk), function (err) {

  });

}



//util.normalize( tracks[trackIndex] )


/*
normalise
multiply
stretch
join
chopEvery
scramble
*/










// lib
//
function drawTrack() {

  let rawData = []
  track.forEach((buff) => {
    rawData.push( util.data( buff ) )
  })

  rawData.forEach((d) => {
    drawWaveform(d)
  })

}


function drawWaveform(d) {

  let cw = 120
  let ch = 32
  let canvas = new Canvas(cw,ch)
  //w must be multiple of 2, h must be multiple of 4.

  var waveform = d[0]

  for (var i=0;i<cw;i++) {
    var sampleIndex = Math.floor( (i / cw) * waveform.length )
    var value = Math.floor( Math.abs(waveform[ sampleIndex ]) * (ch/2) + (ch/2) )
    value = ch - value
    for (var y=value;y<ch-value;y++) {
      canvas.set(i,y)
    }
    canvas.set(i,0)
    canvas.set(i,ch-1)
  }
  for (var i=0;i<ch-1;i++) {
    canvas.set(0,i)
    canvas.set(cw-1,i)
  }

  process.stdout.write(canvas.frame());

  console.log( d[0].length / 44100 + 's')

}



//what does writing this look like
//
// constructors:
// clap.track()
// clap.group()
