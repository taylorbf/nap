// CLAP
// Command Line Audio Processing
// or .. NAP :`)    Node Audio Processing

const play = require('audio-play');
var load = require('audio-loader')
let util = require('audio-buffer-utils')
const toWav = require('audiobuffer-to-wav');
let Canvas = require('drawille')
let bt = require('./bt');
let fs = require('fs');

var createBuffer = require('audio-buffer-from')
const WavDecoder = require("wav-decoder");



// track api

const Track = function() {

  this.buffers = []

  this.longestBufferLength = 0
  this.findLongestBufferLength = function() {
    let max = 0
    this.buffers.forEach((buffer) => {
      max = Math.max(buffer.length,max)
    })
    this.longestBufferLength = max
  }


}

Track.prototype.load = function(filename) {

  console.log( "load:" )

  let file = filename;

  if (this.buffers.length < 1) {
    this.buffers.push( true )
  }

  this.buffers.forEach((buffer,i) => {

    if (typeof filename == "function") {
      file = filename(i)
    }

    // synchronous wav loading
    let loadedBuffer = fs.readFileSync(file);
    let decodedBuffer = WavDecoder.decode.sync( loadedBuffer )
    this.buffers[i] = util.create( decodedBuffer.channelData )
    drawWaveform( util.data( this.buffers[i] ) )

  })

}


Track.prototype.normalize = function() {

  console.log( "normalized:" )

  this.buffers.forEach((buffer) => {
    util.normalize( buffer )
  })

  drawTrack(this)

}


Track.prototype.multiply = function(n) {

  console.log( "multiplying..." )

  let buffers = []
  for (var i=0;i<n;i++) {
    buffers.push( util.clone( this.buffers[ i%this.buffers.length ] ) )
  }
  this.buffers = buffers
  drawTrack(this)

}


Track.prototype.reverse = function(probability) {

  console.log( "reversing..." )

  if (!probability && probability !== 0) { probability = 1 }
  this.buffers.forEach((buff) => {
    if (Math.random()<probability) {
      util.reverse( buff )
    }
  })

  drawTrack(this)

}


Track.prototype.stretch = function(ratio) {

  let buffers = []

  // loop though each buffer in current track
  this.buffers.forEach((buff,bufferIndex) => {

    let currentRatio = ratio;
    if (typeof ratio == "function") {
      currentRatio = ratio(bufferIndex)
    }

    console.log( "timestretch by " + currentRatio )

    let rawData = util.data( buff )

    let newData = []
    let newLength = Math.floor( rawData[0].length / currentRatio )

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

  this.buffers = buffers
  drawTrack(this)

}


// join


Track.prototype.join = function() {

  console.log( "joining..." )

  let joinedBuffer = util.concat( this.buffers )
  this.buffers = [ joinedBuffer ]

  drawTrack(this)

}

// amplify


Track.prototype.amplify = function(amplitude) {

  // loop though each buffer in current track
  this.buffers.forEach((buffer,bufferNum) => {

  // eventually take a function in ... apply different amps to diff samples
  //  let currentRatio = ratio;
  //  if (typeof ratio == "function") {
  //    currentRatio = ratio()
  //  }

    console.log( "amplify by " + amplitude )

    buffer.data.forEach((channelData,channelNum) => {

      channelData.forEach((sample,sampleNum) => {
        channelData[sampleNum] = sample * amplitude
      })

      buffer.data[channelNum] = channelData

    })

    this.buffers[bufferNum].data = buffer.data

  })

  drawTrack(this)

}


// amount in seconds
Track.prototype.trim = function(amount) {

  console.log( "normalized:" )

  let newBuffers = []

  this.buffers.forEach((buffer) => {
    newBuffers.push( util.slice( buffer, 0, buffer.length - amount * 44100 ) )
  })

  this.buffers = newBuffers

  drawTrack(this)

}


// amount in seconds
Track.prototype.resize = function(newSize) {

  console.log( "normalized:" )

  let newBuffers = []

  this.buffers.forEach((buffer) => {
    newBuffers.push( util.slice( buffer, 0, newSize*44100 ) )
  })

  this.buffers = newBuffers

  drawTrack(this)

}




//
// put
//



// chopEvery


Track.prototype.chopEvery = function(distance) {

  console.log( "chop every " + distance )

  let newBuffers = []
  let time = 0
  let distanceInSamples = Math.floor( distance * 44100 )

  this.buffers.forEach((buffer,bufferNum) => {

    time = 0

    while (time < buffer.length) {
      newBuffers.push( util.slice(buffer, time, time + distanceInSamples) )
      time += distanceInSamples
    }

    time += distanceInSamples

  })

  this.buffers = newBuffers;

  drawTrack(this)

}

Track.prototype.scramble = function() {

  console.log("scramble")

  let array = this.buffers

  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  this.buffers = array

  drawTrack(this)

}



Track.prototype.fade = function(overlap=0.1) {

  console.log( "fade edges..." )

  overlap = overlap * 44100;

  // loop though each buffer in current track
  this.buffers.forEach((buffer,bufferNum) => {

    buffer.data.forEach((channelData,channelNum) => {

      for (var i=0;i<overlap;i++) {
        // fade in
        channelData[i] *= (i/overlap)
      }

      for (var i=buffer.length-overlap;i<buffer.length;i++) {
        // fade out
        channelData[i] *= ( bt.scale(i,buffer.length,buffer.length-overlap,0,overlap) / overlap )
      }

      buffer.data[channelNum] = channelData

    })

    this.buffers[bufferNum].data = buffer.data

  })

  drawTrack(this)

}

Track.prototype.play = function(index=0, loop) {
  //play audio buffer with possible options
  playback = play(this.buffers[index], {
     //start/end time, can be negative to measure from the end
     start: 0,
     end: this.buffers[index].duration,

     //repeat playback within start/end
     loop: true,

     //start playing immediately
     autoplay: true
  });
}



//save
Track.prototype.save = function(filename) {

  let wav = toWav(this.buffers[0]);
  var chunk = new Uint8Array(wav);
  fs.appendFile(filename+'.wav', new Buffer(chunk), function (err) {

  });

}


Track.prototype.solo = function(n=0) {

  this.buffers = [ this.buffers[n] ]

}

Track.prototype.nth = function(n=0) {

  return this.buffers[n]

}


Track.prototype.add = function(n=0,dur=1) {

  for (var i=0;i<n;i++) {
    this.buffers.push ( util.create( dur * 44100 ) )
  }

}





Track.prototype.isolateWaves = function() {

  console.log( "isolating waves..." )

  let newBuffers = []

  // loop though each buffer in current track
  this.buffers.forEach((buffer,bufferNum) => {

    let lastCrossPoint = 0
    let previousSample = 0
    let first = true

    buffer.data[1] = buffer.data[0]

    // analyze the left channel only... won't work on stereo
    buffer.data[0].forEach((sample,sampleNum) => {

      if ( previousSample >= 0 && sample < 0) {
        if (first) {
          newBuffers.push( util.slice(buffer, lastCrossPoint, sampleNum) )
        } else {
          first = false
        }
        lastCrossPoint = sampleNum
      }

      previousSample = sample

    //  console.log(newBuffers[ newBuffers.length - 1].data[0][0], newBuffers[ newBuffers.length - 1].data[1][0])

    })

  })

  this.buffers = newBuffers

  drawTrack(this)

}


Track.prototype.put = function(destinationBuffer, startFunction, pan=0.5, overlap=0) {

  overlap = overlap * 44100

  // loop though each buffer in current track
  this.buffers.forEach((buffer,bufferNum) => {

    let startIndex = startFunction(buffer,bufferNum)

    console.log("put buffer "+ bufferNum+ " at sample index "+startIndex)

    let realPan = [1-pan,pan]

    buffer.data.forEach((channel,channelNum) => {

      channel.forEach((sample,sampleNum) => {

        if (sampleNum < overlap) {
          sample *= (sampleNum/overlap)
        }
        if (sampleNum > buffer.length-overlap) {
          sample *= ( bt.scale(sampleNum,buffer.length,buffer.length-overlap,0,overlap) / overlap )
        }

        let destinationIndex = startIndex + sampleNum
        if (destinationIndex < destinationBuffer.length) {
          destinationBuffer.data[channelNum][destinationIndex] += ( sample * realPan[channelNum] )
        }

      })

    })

  //  util.mix(destinationBuffer,buffer,0.1,sampleIndex)

  })

}


Track.prototype.draw = function() {

  drawTrack(this)

}


Track.prototype.wanderThrough = function(n=10) {

  let position = Math.floor( this.buffers.length / 2 )

  let newBuffers = []

  for (var i=0;i<n;i++) {
    position += Math.round( Math.random() ) * 2 - 1
    position = bt.clip(position,0,this.buffers.length-1)
    newBuffers.push( util.clone(this.buffers[position])  )
  }

  this.buffers = newBuffers;

  drawTrack(this)

}


/*

  pick(5)  or   solo(5)  or nth(5)
  isolateWaves()
  wanderThrough()




 */





















// lib
//
function drawTrack(track) {

/*  track.findLongestBufferLength()

  let rawData = []
  track.buffers.forEach((buff) => {
    rawData.push( util.data( buff ) )
  })

  rawData.forEach((d) => {
    drawWaveform(d,track.longestBufferLength)
  })
*/
}


function drawWaveform(d,longestBufferLength) {

  //w must be multiple of 2, h must be multiple of 4.
  let cw = ( d[0].length / longestBufferLength ) * 200
  cw = Math.floor( Math.floor( cw ) / 2 ) * 2
  let ch = 24

  d.forEach((channel,channelNum) => {

    let canvas = new Canvas(cw,ch)

    var waveform = channel

    var samplesPerSection = channel.length / cw

    for (var i=0;i<cw;i++) {

      var startIndex = Math.floor( (i / cw) * waveform.length )
      var endIndex = startIndex + samplesPerSection

      var highValue = getHighPeak( waveform.slice(startIndex,endIndex) )
      var lowValue = getLowPeak( waveform.slice(startIndex,endIndex) )

      highValue = bt.scale( highValue, -1, 1, ch, 0 )
      lowValue = bt.scale( lowValue, -1, 1, ch, 0 )

      for (var y=highValue;y<=lowValue;y++) {
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

  })

  console.log( d[0].length / 44100 + 's')

}


function getHighPeak(arr) {

  let max = -2
  arr.forEach((sample) => {
    max = Math.max(sample,max)
  })
  return max

}

function getLowPeak(arr) {

  let min = 2
  arr.forEach((sample) => {
    min = Math.min(sample,min)
  })
  return min

}



module.exports.track = Track


//what does writing this look like
//
// clap.track()
