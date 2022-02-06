const scribble = require('scribbletune'); // https://scribbletune.com/documentation/core/clip#notes
const synth = require('synth-js');
const fs = require('fs');

let clip = scribble.clip({
    notes: scribble.scale('C4 major'),
    pattern: 'x'.repeat(7) + '_'
});

clip = scribble.clip({
    notes: "C4 D4 C4 D4",
    pattern: "x".repeat(5),
});

clip = scribble.clip({
    notes: "C4 D4 E4 A4",
    pattern: "xxxx".repeat(12),   // x -> note, - -> rest, _ -> hold, [...] basically doubles the speed  
    subdiv: "16n",    // controls the quarter of the notes. notes are typically 4n  (quarter note)
    // sizzle: "sin",    // fluctuates volume like a trig function 
    // sizzleReps: 4,  // combined w/ sizzle to create a repeating shape 
    // accent: "x--x",   // another way to fluctuate the volume but more precisely. amp and accentLow properties (value->number) can control what volume an x and a '-' correlate to. 
});

clip = scribble.clip({
    notes: "C4 D4 E4 A4",
    pattern: "xxxx".repeat(12),   
    subdiv: "16n",    
});

// scales 

clip = scribble.clip({
    notes: scribble.scale('C4 major'),  // you can find all scales by calling scribble.scales() or look at https://scribbletune.com/documentation/core/scale
    pattern: "x".repeat(26),   
    subdiv: "16n",    
    amp: 2 , 
    accentLow: 1, 
    accent: "-",
});



// chords


// a chord is 2-3 notes combined 
clip = scribble.clip({
    notes:  `Cm FM Gm AM ${scribble.chord('C5 M').join(" ")} C6`,  // M -> Major, m -> minor
    pattern: "x__".repeat(26),   
    subdiv: "16n",    
    amp: 2 , 
    accentLow: 1, 
    accent: "-",
});

// list of cords available via scribble.cords() or https://scribbletune.com/documentation/core/chord 

// arpeggiate (arp)
// An arpeggio is a broken chord, or a chord in which individual notes are struck one by one, rather than all together at once
// Scribbletune can generate arpeggios from chords   (it basically breaks the cords down)

clip = scribble.clip({
    notes: scribble.arp('CM FM CM GM'),
    pattern: 'x'.repeat(32),
    subdiv: "16n",    
    amp: 2 , 
    accentLow: 1, 
    accent: "-",
});


scribble.midi(clip, 'song.mid');
let midBuffer = fs.readFileSync('song.mid');
let wavBuffer = synth.midiToWav(midBuffer).toBuffer();
fs.writeFileSync('song.wav', wavBuffer, {encoding: 'binary'});