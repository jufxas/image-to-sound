const jimp = require("jimp") // https://www.npmjs.com/package/jimp
const scribble = require('scribbletune'); // https://scribbletune.com/documentation/core/clip#notes
const synth = require('synth-js');
const fs = require('fs');

// piano notes to frequencies: https://pages.mtu.edu/~suits/notefreqs.html 

const NoteToFrequencyRangeTable = {
    C2: 65,   D2: 73,  E2: 82,  F2: 87,  G2: 98,  A2: 110, B2: 123,
    C3: 130,  D3: 146, E3: 164, F3: 174, G3: 196, A3: 220, B3: 246, 
    C4: 261,  D4: 293, E4: 329, F4: 349, G4: 392, A4: 440, B4: 493, 
    C5: 523,  D5: 587, E5: 659, F5: 698, G5: 783, 
}



function closestNote(frequency) {
    let noteDifferenceObjectArray = []
    for (const note in NoteToFrequencyRangeTable) 
        noteDifferenceObjectArray.push({ note: note, difference: Math.abs(frequency - NoteToFrequencyRangeTable[note]) })
    return noteDifferenceObjectArray.sort((a, b) => a.difference - b.difference)[0].note
}



const RNote = (r) => closestNote(594 + r*((783-594)/255))
const GNote = (g) => closestNote(347 + g*((593-347)/255))
const BNote = (b) => closestNote(65  + b*((346-65)/255))

async function GenerateSong(file, pixelsPerNote) {
    let Notes = []
    await jimp.read(file, function (err, image) {
        if (err) throw err
        let iterator = 0 
        let avgRed = 0 
        let avgGreen = 0 
        let avgBlue = 0 
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            let red = this.bitmap.data[idx + 0];
            let green = this.bitmap.data[idx + 1];
            let blue = this.bitmap.data[idx + 2];

            avgRed += red 
            avgGreen += green
            avgBlue += blue 

            if (iterator % pixelsPerNote === 0 && iterator !== 0) {
                avgRed /= pixelsPerNote 
                avgGreen /= pixelsPerNote 
                avgBlue /= pixelsPerNote 

                Notes.push([RNote(avgRed), GNote(avgGreen), BNote(avgBlue)])

                avgRed = 0 
                avgGreen = 0 
                avgBlue = 0
            }

            iterator++
        })

        let clip = scribble.clip({
            notes: Notes,  
            pattern: "x".repeat(Notes.length),   
            subdiv: "2n",   // 1n, 2n, 4n, 8n, 16n  
            amp: 2 , 
            accentLow: 1, 
            accent: "-",
        });
        scribble.midi(clip, 'song.mid');
        let midBuffer = fs.readFileSync('song.mid');
        let wavBuffer = synth.midiToWav(midBuffer).toBuffer();
        fs.writeFileSync('song.wav', wavBuffer, {encoding: 'binary'});
    });
}


// GenerateSong("images/omo.png", 3000)

// CDEFGAB   lowest to highest frequencies  from 0 to 9. 8+ are  ear piercingly high frequency
// C2 to G5 are a good range of frequencies 
// C2 D2 E2 F2 G2 A2 B2 C3 D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5

// chord  
// Cm Dm Em Fm Gm Am Bm


// C2 D2 E2 F2 G2 A2 B2 C3 D3 E3 F3 G3 A3 B3 Cm Dm Em Fm Gm Am Bm C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5 

// RGB will generate 3 notes 
// R will correspond to a higher frequency notes 
// G is middle notes 
// B is lower notes 

// R -> 594 to 783    0 -> 594, 255 -> 783 
// G -> 347 to 593    0 -> 347, 255 -> 593
// B -> 65  to 346    0 -> 65,  255 -> 346 




const client_id = "7c0725d4"
const id = "500608900"
const https = require('https')


const newFile = fs.createWriteStream("test.mp3")
const options = {
  hostname: 'api.jamendo.com',
  port: 443,
  path: `/v3.0/playlists/tracks?client_id=${client_id}&id=${id}&limit=200`,
  method: 'GET',
}

let str = ""
let givenTracks

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', data => {
    // process.stdout.write(data)
    str += data
  })
  res.on('end', () => {
    // console.log(JSON.parse(str).results[0].tracks.length)
    givenTracks = JSON.parse(str).results[0].tracks

    
    const request = https.get(givenTracks[0].audiodownload, function(response) {
      let failed = true 
      for (let i = 0; i < response.rawHeaders.length; i++) {
        if (response.rawHeaders[i].includes("attachment;")) failed = false 
      }
      if (failed) console.log(`Request for ${id} failed.`)
      else {
        console.log(`Request for ${id} succeeded.`)
        response.pipe(newFile);
      }
    });
    


  })
})
req.on('error', error => {
  console.error(error)
})
req.end()


