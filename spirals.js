

let bt = require('./bt');

let track1 = new clap.track()
let track2 = new clap.track()

track2.add(1,80)

with (track1) {

  add(15,1)

  let scale = [ 1/1, 9/8, 5/4, 3/2, 15/8 ]
  load(function(bufferIndex) {
    let files = [ 'A4v9.wav', 'A5v9.wav', 'A6v9.wav'  ]
    let index = Math.floor( bufferIndex / scale.length )
    return "./samples/" + files[ index ]
  })

  normalize()

  stretch(function(index) {
    return scale[ index % scale.length ] / 2
  })

  resize(4)
  amplify(0.05)

  //fade(0.03)

  let pan = 0
  let spread = 0
  let fadeIn = 0.03

  for (var i=0; i<400; i++) {
    let nextIndex = (i/4) * 44100
    if (i > 100 && i < 200) {
      spread += 0.0005
    }
    if (i > 200 && i < 300) {
      fadeIn += 0.001
    }
  //  pan += 0.25
  //  pan %= 1
    pan += 1
    put(track2.nth(0), function(buffer,bufferIndex) {
       let putIndex = nextIndex + (spread * bufferIndex * 44100)
       putIndex = Math.floor(putIndex)
       return putIndex
    }, pan % 2, fadeIn )
    //bt.scale(pan,0,0.75,0,1)
  }

}

track2.draw()
track2.play()
track2.save("output"+bt.ri(0,10000000000))


/*
let track1 = new clap.track()

with (track1) {

// load something...

  chopEvery(0.1)
  buffers = [ buffers[4] ]

  isolateWaves()
  wanderThrough(2000)
  join()

  let nextIndex = 0
  put(track2.nth(0), function(buffer) {
     let putIndex = nextIndex
     nextIndex += buffer.length
     return putIndex
  })

  play()
}

  */


//track2.play()


/*
with (track1) {

  load('./samples/A3v9.wav')
  normalize()
  chopEvery(0.1)
  buffers = [ buffers[4] ]

  isolateWaves()
  wanderThrough(2000)
  join()

  play()

}
*/


/*
with (track1) {

  load('./samples/A3v9.wav')
  normalize()
  chopEvery(0.1)
  shuffle()
  fade(0.01)
  join()
  play()
//  console.log(buffers[0])

} */

/*
let track1 = new clap.track()

with (track1) {

  load('./samples/A2v9.wav')
  normalize()
  multiply(10)
  reverse(0.5)
  stretch(function() {
    return ( Math.floor(Math.random()*8 + 1) * 0.25 )
  })
  join()
  //amplify(1)
  stretch(0.25)
  play()

}
*/
