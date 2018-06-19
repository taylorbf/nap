```js
let sample1 = load("./sample.wav")

sample.normalize()
sample.chopInto(20)
sample.chopEvery(5)
track1.chopAt(30)
track1.fadeIn(0.1)

a.fadeOut(0.1)

a.fade(0.1)

a.save(".....")


or



```



```javascript
let a = load("./sample.wav")

let b = a.dup(20)

b.fade(0.1)

b.stretch(function(i) {

  var tunings = [1/1, 4/3, 3/2]

  return tunings[ i % tunings.length ]

})

b.save("notes")

b.scramble()

let c = b.join()

c.view()

```



```javascript
notes.each(function() {

  // create buffer using necessary sample

  // time stretch it

  return buffer

})

notes.save("notes")

```



```

```




load sample.wav
  > track1
  > chopInto 20
  > track2
  > fade 0.1
  > track2
  > scramble
  > track2
  > connect -d track1
  > track1 ?A2





# CL API

## Meta

new sound -d track1

new collection -d track2



## Single / Sound / Buffer

chopInto 20
chopEvery 5
chopAt 30




## Collection / Group /

shuffle

pare "i%2 == 0"

reverseOrder

pick 5

single 5 or nth 5





## Both

load sample.wav

save song.wav

convert sample.wav -format mp3

normalize

reverse   (w/ probability)

gain     (w/ function?)

trim

fadeIn 0.1
fadeOut 0.1
fade 0.1

stretch 0.8
stretch 4 3       (= 4/3 ratio)

put

-   add trackN to trackM at certain spot
    `put -d "function(i) { Math.sine(i*Math.PI*2 / 20) }"`
    `put -d "Math.sine( i * Math.PI*2 / 20) / 2 + 0.5"`
    `put -d "i*200"`

    `put -d i*0.1 -reverse "Math.random() > 0.5" -destination track1`





## Options

​    -iter 100   ?













## segments





 => how to create scales from salamander?

​	use each

​	… do it in steps



```shell
new collection 81 -d track1
	=> track1
load "['A', 'C', 'D#', 'F#'][ Math.floor( (i%12) / 4 ) ] + 'v' + (i%12) + '.wav'"
stretch "  mtof( i ) / ( {'A': 440, .....} * Math.pow(2,Math.floor(i/12)) )  "
pare "i%12 == [0,2,4,5,7,9,11]"
save "notes.wav"


play 5 (play 5th note)
play 2 8 (play sounds 2 through 8)
```



or this could somehow be simplified as:

```shell
new collection 81 -d track1
	=> track1

save "pianonote.wav"
```
