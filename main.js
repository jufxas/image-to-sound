const file = "images/blackhole.jpg"
const jimp = require("jimp") // https://www.npmjs.com/package/jimp
const scribble = require('scribbletune'); // https://scribbletune.com/documentation/core/clip#notes
const synth = require('synth-js');
const fs = require('fs');

// piano notes to frequencies: https://pages.mtu.edu/~suits/notefreqs.html 

const NoteToFrequencyRangeTable = {
    C2: 65, 
    D2: 73,
    E2: 82,
    F2: 87,
    G2: 98,
    A2: 110,
    B2: 123,
    C3: 130,
    D3: 146,
    E3: 164,
    F3: 174, 
    G3: 196, 
    A3: 220, 
    B3: 246, 
    
    // Cm to Bm are not accurate values like at all 
    // Cm: 138,   
    // Dm: 155, 
    // Em: 170, 
    // Fm: 185, 
    // Gm: 207, 
    // Am: 233, 
    // Bm: 250,  


    C4: 261,  
    D4: 293,
    E4: 329,
    F4: 349, 
    G4: 392, 
    A4: 440, 
    B4: 493, 
    C5: 523,
    D5: 587, 
    E5: 659,
    F5: 698,
    G5: 783, 
}
let NOTES = ""

const RNote = (r) => closestNote(594 + r*((783-594)/255))
const GNote = (g) => closestNote(347 + g*((593-347)/255))
const BNote = (b) => closestNote(65  + b*((346-65)/255))
const timer = (ms) => new Promise(res => setTimeout(res, ms));

// 100x100 area = 15 seconds of music 
// (100*100)k = 15    k = 15/(100*100)
// 1x1 area = 15/(100*x100) seconds of music 
// 1x1 area = 0.0015 seconds of music 
// ~666 pixels = 1 second of music 

async function doStuff() {
    let Notes = []

    async function h() {
        console.log("1")
        await jimp.read(file, function (err, image) {
            // image.getPixelColor(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
            if (err) throw err
            
            let iterator = 0 

            let avgRed = 0 
            let avgGreen = 0 
            let avgBlue = 0 
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                // x, y is the position of this pixel on the image
                // idx is the position start position of this rgba tuple in the bitmap Buffer
                let red = this.bitmap.data[idx + 0];
                let green = this.bitmap.data[idx + 1];
                let blue = this.bitmap.data[idx + 2];

                avgRed += red 
                avgGreen += green
                avgBlue += blue 

                if (iterator % 1200 === 0 && iterator !== 0) {
                    avgRed /= 1200 
                    avgGreen /= 1200 
                    avgBlue /= 1200 

                    Notes.push([RNote(avgRed), GNote(avgGreen), BNote(avgBlue)])

                    avgRed = 0 
                    avgGreen = 0 
                    avgBlue = 0
                }

                // if (iterator < 1000)  Notes.push([RNote(red), GNote(green), BNote(blue)])
               

               


                iterator++
            })

            let clip = scribble.clip({
                notes: Notes,  
                pattern: "x".repeat(Notes.length),   
                subdiv: "4n",   // 1n, 2n, 4n, 8n, 16n  
                amp: 2 , 
                accentLow: 1, 
                accent: "-",
            });
            
            
            scribble.midi(clip, 'song.mid');
            let midBuffer = fs.readFileSync('song.mid');
            let wavBuffer = synth.midiToWav(midBuffer).toBuffer();
            fs.writeFileSync('song.wav', wavBuffer, {encoding: 'binary'});

        });
        console.log("3")
    }


    await h()
    console.log("4")
    return n 
}



jimp.read(file, function (err, image) {
    // image.getPixelColor(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
    if (err) throw err


    // console.log(jimp.intToRGBA(image.getPixelColor(0, 0)));
    // let pixels = image.bitmap.width * image.bitmap.height

    // let averageRed = 0 
    // let averageGreen = 0 
    // let averageBlue = 0 
    //  image.bitmap.width, image.bitmap.height

    // image.scan(0, 0, 5, 5, function(x, y, idx) {
    //     // x, y is the position of this pixel on the image
    //     // idx is the position start position of this rgba tuple in the bitmap Buffer
    //     let red = this.bitmap.data[idx + 0];
    //     let green = this.bitmap.data[idx + 1];
    //     let blue = this.bitmap.data[idx + 2];

    //     averageRed += red 
    //     averageGreen += green 
    //     averageBlue += blue

    //     NOTES += RNote(red) + " "
    //     NOTES += GNote(green) + " "
    //     NOTES += BNote(blue) + " "

    // })

    
    // averageRed = Math.round(averageRed / pixels)
    // averageGreen = Math.round(averageGreen / pixels)
    // averageBlue = Math.round(averageBlue / pixels)

    // console.log(averageRed, averageGreen, averageBlue);


    // let clip = scribble.clip({
    //     notes: doStuff(),  
    //     pattern: "x".repeat(50),   
    //     subdiv: "4n",    
    //     amp: 2 , 
    //     accentLow: 1, 
    //     accent: "-",
    // });
    
    
    
    // scribble.midi(clip, 'song.mid');
    // let midBuffer = fs.readFileSync('song.mid');
    // let wavBuffer = synth.midiToWav(midBuffer).toBuffer();
    // fs.writeFileSync('song.wav', wavBuffer, {encoding: 'binary'});

});

async function ok() {
    let k = await doStuff(); 
    console.log(k)
}
ok()

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


function closestNote(num) {
    let p = []
    for (const note in NoteToFrequencyRangeTable) {
        p.push({ note: note, difference: Math.abs(num - NoteToFrequencyRangeTable[note]) })
    }

    return p.sort((a, b) => a.difference - b.difference)[0].note
}



// let clip = scribble.clip({
//     notes: ['c4', ['C2', 'e4', 'g4']],  
//     pattern: "x".repeat(50),   
//     subdiv: "4n",    
//     amp: 2 , 
//     accentLow: 1, 
//     accent: "-",
// });



// scribble.midi(clip, 'song.mid');
// let midBuffer = fs.readFileSync('song.mid');
// let wavBuffer = synth.midiToWav(midBuffer).toBuffer();
// fs.writeFileSync('song.wav', wavBuffer, {encoding: 'binary'});
