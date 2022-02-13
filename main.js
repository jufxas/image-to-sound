const jimp = require("jimp") // https://www.npmjs.com/package/jimp
const https = require('https')
const fs = require('fs');
const client_id = "7c0725d4"
const id = "500608900"

/*
    w is the weight, from 1 to 100 

Metal -> Greyish, black. 
Palette: Dark blue, black, & silver/grey
dark blue   rgb(0,0,139)      w=50
black       rgb(0,0,0)        w=25
grey        rgb(128,128,128)  w=25     


Beatmaker's arena -> alive, exciting, electric, 
gold 	  rgb(255,215,0) w=33
orange  rgb(255,165,0) w=33
crimson rgb(220,20,60) w=33

Time to dream ->
cotton candy pink  rgb(255,182,193) w=30
light blue rgb(240,248,255) w=70

Dreamy Flow 500342341 (rap lol)
cotton candy pink  rgb(255,182,193) w=30
light blue rgb(240,248,255) w=30
red rgb(255, 0, 0) w=40

On the Rocks -> Red, hot, fire 
orange fire (226,88,34) w=50
red rgb(255,0,0) w=50

Cool Instrumentals -> snazzy, calming, blue or green 
hot pink rgb(255,105,180)  w=40
white rgb(255, 255, 255) w=10
light sky blue rgb(135,206,250) w=50


Chill Zone -> regular blue 
deep sky blue rgb(0,191,255) w=100

Urban -> it's rap
royal blue 	rgb(65,105,225) w=50
crimson rgb(220,20,60) w=50 


Electro Waves -> hot pink and bright baby blue, Mystical, Spacey, 
fuchsia rgb(255,0,255) w=20
light sky blue rgb(135,206,250) w=40
blue violet rgb(138,43,226) w=40


Just piano ->  
white rgb(255, 255, 255) w=50
black rgb(0, 0, 0) w=50

Back to school -> rock, green? 
dodger blue rgb(30,144,255) w=30
chartreuse rgb(127,255,0) w=70

Long live the king -> brown 
peachpuff rgb(255,218,185) w=30
saddlebrown rgb(139,69,19) w=70

Stranger than summer -> spooky, electronic, mysterious, lighter grey to white 
orange rgb(255,165,0) w=80
black rgb(0,0,0) w=20

Sparks and stars -> cool, last day of school, satisifed, blue 
cadet blue rgb(95,158,160) w=50
spring green rgb(0,255,127) w=50 

To infinity and beyond -> mysterious, thinking, curious, beige, classy 
beige rgb(245,245,220) w=100

Don't hold the door -> battle, red fury hot enraged 
red rgb(255, 0, 0) w=100

Life Lessons & Resolutions ->
forest green rgb(34,139,34) w=50
mediumspringgreen rgb(0,250,154) w=50

Post-Rock Textures -> sad and intense rock 
blue rgb(0,0,255) w=50
red rgb(255, 0, 0) w=50

That's Folk, Folks! -> country 
old lace rgb(253,245,230) w=50 
white (255, 255, 255) w=50 

Spanish Guitar Masters ->
purple rgb(148,0,211) w=10
red rgb(220,20,60) w=30
green rgb(152,251,152) w=60

Look Up To The Stars -> 
purple rgb(138,43,226) w=45
blue rgb(65,105,225) w=45
green  rgb(0,255,127) w=10

Psyched In A Trance -> 
red rgb(255,0,0) w=17
orange rgb(255,165,0) w=17
yellow rgb(255,255,0) w=17
green rgb(127,255,0) w=17
blue rgb(0,0,255) w=16
purple 	rgb(128,0,128) w=16

Unforgettable Russia -> 
red  rgb(255, 0, 0) w=50
white rgb(255, 255, 255) w=50

Salsa Picante -> 
red rgb(255, 0, 0) w=90
green rgb(0,100,0) w=10

Be the bop -> jazz 
blue rgb(0,0,255) w=80
black rgb(0,0,0) w=20

Blame It On The Glitch
red rgb(255, 0, 0) w=33 
green rgb(0, 255, 0) w=34
blue rgb(0, 0, 255) w=33

Cinematic dubstep 
red rgb(240,128,128) w=45 
blue rgb(100,149,237) w=45
white rgb(255,255,255) w=10

Override Dance 500414147 
beige rgb(245,245,220) w=40
red rgb(255, 0, 0) w=20
green rgb(0, 255, 0) w=20
blue rgb(0, 0, 255) w=20

Sweet Dreams 500405631
lavender rgb(230,230,250) w=70
alice blue rgb(240,248,255) w=30

Easter Holidays 500399624
wheat rgb(245,222,179) w=50
rosy brown rgb(188,143,143) w=50

Cinematic Landscapes 500395082
blue 	rgb(0,0,255) w=90
orange rgb(255,165,0) w=10


Electro Funk Frenzy 500390216
gold rgb(255,215,0) w=20
purple rgb(138,43,226) w=40
blue rgb(65,105,225) w=40

Valentine's Day 500386475
red rgb(255, 0, 0) w=80
brown rgb(139,69,19) w=20

100% Reggaeton
green rgb(0,128,0) w=40
gold rgb(255,215,0) w=20
black (0,0,0) w=40

Girls On The Rise
pink rgb(255,192,203) w=100

Oh deer, it's Christmas! 500371356
white rgb(255,255,255) w=33
red rgb(255,0,0) w=34
green rgb(0,255,0) w=33

World Is Calling: Traditional Recipes 500369284
orange rgb(255,140,0) w=20
red rgb(250,128,114) w=20
blue rgb(0,0,139) w=20
green rgb(154,205,50) w=20
purple rgb(75,0,130) w=20

Dub The Riddim 500366792
red rgb(255, 0, 0) w=33
gold rgb(255,215,0) w=34
green rgb(0, 255, 0) w=33

Escape To A Reverie 500361729
blue rgb(0,0,139) w=40
black rgb(0,0,0) w=20
white rgb(255, 255, 255) w=40

The Breakbeat Goes On 500359352
orange red rgb(255,69,0)
blue rgb(106,90,205)

Zentitude 500356501
green rgb(0,255,0) w=70
blue rgb(176,224,230) w=30

Stranger than halloween 500351513
orange rgb(255,165,0) w=50
black rgb(0,0,0) w=20
blue rgb(0,191,255) w=30

Icy Mindscapes 500349856
alice blue rgb(240,248,255) w=100

Running on Sinking Sand (sad) 500343359
navy rgb(0,0,128) w=55 
black rgb(0,0,0) w=45

From Nashville to Memphis  500339697
beige rgb(245,245,220) w=30
blue rgb(70,130,180) w=70

Midnight Jazz 500332577 (slow)
black rgb(0,0,0) w=59
red rgb(255, 0, 0) w=41

Fasten Your Seat Belt 500330186
purple rgb(138,43,226) w=55
blue rgb(30,144,255) w=45

Before The Wild Night 500327838
sunset colors: 
rgb(253, 94, 83) w=60
rgb(252,156,84) w=20
rgb(255,227,115) w=20

Sip That Caïpirinha 500325591 (summer)
blue rgb(135,206,235) w=70
yellow rgb(255,255,51) w=10
green rgb(124,252,0) w=20


Stories From The Sea 500320879
blue rgb(30,144,255)  w=80
royal blue rgb(65,105,225) w=20


Deep Is My House 500317937
beige rgb(245,245,220) w=30
blue rgb(70,130,180) w=30
green 	rgb(173,255,47) w=40


Back To Classics 500315543 ochestral 1690s type beat 
black rgb(0,0,0) w=33
white rgb(255,255,255) w=34
grey rgb(128,128,128) w=33

Feel good 500307898 

rgb(248,230,82) w=25
rgb(251,189,128) w=25
rgb(209,239,154) w=25
rgb(129,219,198) w=25    from https://www.color-hex.com/color-palette/60852 

Straight Chillin' 500294369
rgb(22,178,182) w=33
rgb(31,131,152) w=33
rgb(19,78,101) w=34 from https://www.color-hex.com/color-palette/29299

Latin Flavor 500228504 
rgb(146,0,30) w=25
rgb(172,74,8) w=25
rgb(225,238,80) w=25
rgb(54,57,42) w=25 from https://www.color-hex.com/color-palette/78465

Election Day 500227543 
red rgb(255, 0, 0) w=33
white rgb(255,255,255) w=34
blue rgb(0,0,255) w=33

Halloween 500224355
rgb(255,154,0) w=25
rgb	(0,0,0) w=25
rgb	(9,255,0) w=25
rgb	(201,0,255) w=25  from https://www.color-hex.com/color-palette/3399

Road Trippin' 500204816
(199,80,92) w=20
(232,187,97) w=20
(237,234,133) w=20
(140,207,168) w=20
(74,162,230) w=20 from https://www.color-hex.com/color-palette/825


Play It Loud 500193575
(255,10,156) w=33
(174,24,87) w=34
(24,218,141) w=33 from    https://www.color-hex.com/color-palette/6502

Summer Jams 500199905
(255,78,80) w=27
(252,145,58) w=26
(249,214,46) w=27
(234,227,116) w=10
(226,244,199) w=10

Hip-hop indie stars 500168958
blue rgb(0,0,255) w=25
black rgb(105,105,105) w=25
orange red rgb(255,69,0) w=50

Hipster BBQ 500194396
(255,245,155) w=20
(255,155,162) w=30
(255,245,155) w=50

Party With Friends 500168943
(154,143,232) w=25
(255,162,229) w=25
(210,161,247) w=25
(166,125,204) w=25 from https://www.color-hex.com/color-palette/19075


Late Night Wind Down 500180942   relaxing 
(219,194,207) w=25
(159,162,178) w=25
(60,122,137) w=25
(46,71,86) w=25 from https://www.color-hex.com/color-palette/4151

The 5 Sickest Metal Tracks 500176479
(152,3,3) w=25
(242,32,32) w=25
(69,7,7) w=25
(107,38,20) w=25 from https://www.color-hex.com/color-palette/13618 

Power Workout 500175269 
rgb(255,255,0) w=57
rgb(255,165,0) w=43

Ode to Winter 500170891
(211,225,255) w=20
(184,205,251) w=20
(165,193,253) w=20
(149,182,253) w=20
(138,175,255) w=20 from https://www.color-hex.com/color-palette/1607

Best Of Metal 500157248
black (0,0,0) w=59
red (255,0,0) w=41

New Resolutions 500157769
blue rgb(0,191,255) w=20
green  rgb(0,255,0) w=30
yellow rgb(255,255,0) w=50


there are a few more but this is enough lol
*/ 

class RGB {
  constructor(r, g, b) {
    this.r = r 
    this.g = g 
    this.b = b 
  }
  format() {
    return `rgb(${this.r},${this.g},${this.b})`
  }
}

function equalRGB(rgb1, rgb2) {
  return Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b) <= 100
} 



async function AverageRGB(file) {
    await jimp.read(file, function (err, image) {
        if (err) throw err
        let iterator = 0 
        let avgRed = 0 
        let avgGreen = 0 
        let avgBlue = 0 
        let colorPalette = []
        let colorAndWeight = {}

        const pixels = image.bitmap.width * image.bitmap.height
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {

            let red = this.bitmap.data[idx + 0]
            let green = this.bitmap.data[idx + 1]
            let blue = this.bitmap.data[idx + 2]
            let currentPixelRGB = new RGB(red, green, blue) 
            avgRed += red 
            avgGreen += green
            avgBlue += blue 

            if (colorPalette.length === 0) {
              colorPalette.push(currentPixelRGB) 
              colorAndWeight[currentPixelRGB.format()] = 1 
            } else {
              let pass = true
              for (let i = 0; i < colorPalette.length; i++) {
                 if (equalRGB(colorPalette[i], currentPixelRGB)) {
                  colorAndWeight[colorPalette[i].format()] += 1 
                   pass = false 
                   break
                 }
              }
              if (pass) {
                colorPalette.push(currentPixelRGB)
                colorAndWeight[currentPixelRGB.format()] = 1 
              }
            }

            iterator++
        })

        
        const colorAndWeightList = []
        for (const color in colorAndWeight) {
          let colorWeight = parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
          if (colorWeight >= 1)
            colorAndWeightList.push({
              color: color, 
              weight: parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
            })

        }

        colorAndWeightList.sort((a, b) => b.weight - a.weight)
        console.log(colorAndWeightList)

        console.log({r: Math.round(avgRed / pixels), g: Math.round(avgGreen / pixels), b: Math.round(avgBlue / pixels)})
    });
}

AverageRGB("./images/amogus.png")

/*
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


*/