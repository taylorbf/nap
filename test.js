let util = require('audio-buffer-utils')

//mono buffer with 100 samples
let a = util.create(10100,10100)

util.noise(a)

//stereo buffer with predefined channels data
//let b = util.create([Array(100).fill(  ), Array(100).fill(0.4)])

//let c = util.slice(a, 0, 10)



let d = util.data(a)




let Canvas = require('drawille')

let canvas = new Canvas(200,40)
//w must be multiple of 2, h must be multiple of 4.

var waveform = d[0]

//for (var i=0;i<200;i++) {
//  var sampleIndex = Math.floor( (i / 200) * waveform.length )
//  var value = Math.floor( waveform[ sampleIndex ] * 20 + 20 )
//  value = 40 - value
//  canvas.set(i,value)
//}

for (var i=0;i<200;i++) {
  var sampleIndex = Math.floor( (i / 200) * waveform.length )
  var value = Math.floor( Math.abs(waveform[ sampleIndex ]) * 20 + 20 )
  value = 40 - value
  for (var y=value;y<40-value;y++) {
    canvas.set(i,y)
  }
}



process.stdout.write(canvas.frame());
