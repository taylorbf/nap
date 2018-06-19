

let bt = require('./bt');

let track1 = new clap.track()
let track2 = new clap.track()

track2.add(1,60)

with (track1) {

  add(15,1)

  let scale = [ 1/1, 9/8, 5/4, 3/2, 15/8 ]
  load(function(bufferIndex) {
    let files = [ 'A3v9.wav', 'A4v9.wav', 'A5v9.wav'  ]
    let index = Math.floor( bufferIndex / scale.length )
    return "./samples/" + files[ index ]
  })

  normalize()

  stretch(function(index) {
    return scale[ index % scale.length ] / 2
  })

  resize(4)
  fade(0.2)
  amplify(0.05)

  for (var i=0; i<200; i++) {
    put(track2.nth(0), function(buffer) {
       let putIndex = bt.ri(0,59*44100)
       return putIndex
    }, bt.rf(0,1))
  }

//  reverse(0.5)
/*
  for (var i=0; i<4; i++) {
    let nextIndex = i * 44100
    let deccel = 0
    put(track2.nth(0), function(buffer) {
       let putIndex = nextIndex
       nextIndex += ((0.08 + deccel) * 44100)
       deccel += 0.01
       return putIndex
    })
  }
  */


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
