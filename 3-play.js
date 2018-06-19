

const play = require('audio-play');


var load = require('audio-loader')
let util = require('audio-buffer-utils')
let Canvas = require('drawille')

let track1, playback;

// load one file
load('./samples/A4v3.wav').then(function (buffer) {

  track1 = util.slice(buffer, 0,44100)

  util.normalize(track1)

  let d = util.data(track1)



  drawWaveform(d)



  //play audio buffer with possible options
  playback = play(track1, {
   //start/end time, can be negative to measure from the end
   start: 0,
   end: track1.duration,

   //repeat playback within start/end
   loop: true,

   //start playing immediately
   autoplay: true
  });

//  setInterval(updateProgress, 100)

})


let progressLocation = 0
function updateProgress() {
  canvas.unset(progressLocation, 2)
  progressLocation = Math.floor( 200 * ( playback.currentTime * 44100 / track1.duration ) )
  console.log(progressLocation)
  canvas.set(progressLocation, 2)
}



let canvas

function drawWaveform(d) {

  canvas = new Canvas(200,40)
  //w must be multiple of 2, h must be multiple of 4.

  var waveform = d[0]

  for (var i=0;i<200;i++) {
    var sampleIndex = Math.floor( (i / 200) * waveform.length )
    var value = Math.floor( Math.abs(waveform[ sampleIndex ]) * 20 + 20 )
    value = 40 - value
    console.log(value)
    for (var y=value;y<40-value;y++) {
      canvas.set(i,y)
    }
  }

  process.stdout.write(canvas.frame());

}
