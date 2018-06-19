

var load = require('audio-loader')
let util = require('audio-buffer-utils')
let Canvas = require('drawille')

// load one file
load('./samples/A4v3.wav').then(function (buffer) {

  let short = util.slice(buffer, 0,44100)

  util.normalize(short)

  let d = util.data(short)



  drawWaveform(d)

})




function drawWaveform(d) {

  let canvas = new Canvas(200,40)
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
