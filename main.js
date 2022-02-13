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


Beatmaker's arena -> alive, exciting, electric,  500608471
gold 	  rgb(255,215,0) w=33
orange  rgb(255,165,0) w=33
crimson rgb(220,20,60) w=33

Time to dream -> 500607433
cotton candy pink  rgb(255,182,193) w=30
light blue rgb(240,248,255) w=70

Dreamy Flow 500342341 (rap lol)
cotton candy pink  rgb(255,182,193) w=30
light blue rgb(240,248,255) w=30
red rgb(255, 0, 0) w=40

On the Rocks -> Red, hot, fire  500606825
orange fire (226,88,34) w=50
red rgb(255,0,0) w=50

Cool Instrumentals -> snazzy, calming, blue or green  500605606
hot pink rgb(255,105,180)  w=40
white rgb(255, 255, 255) w=10
light sky blue rgb(135,206,250) w=50


Chill Zone -> regular blue  500605176
deep sky blue rgb(0,191,255) w=100

Urban -> it's rap 500604904
royal blue 	rgb(65,105,225) w=50
crimson rgb(220,20,60) w=50 


Electro Waves -> hot pink and bright baby blue, Mystical, Spacey,  500602528
fuchsia rgb(255,0,255) w=20
light sky blue rgb(135,206,250) w=40
blue violet rgb(138,43,226) w=40


Just piano ->   500599669
white rgb(255, 255, 255) w=50
black rgb(0, 0, 0) w=50

Back to school -> rock, green?  500337324
dodger blue rgb(30,144,255) w=30
chartreuse rgb(127,255,0) w=70

Long live the king -> brown  500510544
peachpuff rgb(255,218,185) w=30
saddlebrown rgb(139,69,19) w=70

Stranger than summer -> spooky, electronic, mysterious, lighter grey to white  500509197
orange rgb(255,165,0) w=80
black rgb(0,0,0) w=20

Sparks and stars -> cool, last day of school, satisifed, blue
500508615  
cadet blue rgb(95,158,160) w=50
spring green rgb(0,255,127) w=50 

To infinity and beyond -> mysterious, thinking, curious, beige, classy  500506299
beige rgb(245,245,220) w=100

Don't hold the door -> battle, red fury hot enraged  500491533
red rgb(255, 0, 0) w=100


Life Lessons & Resolutions -> 500466416
forest green rgb(34,139,34) w=50
mediumspringgreen rgb(0,250,154) w=50

Post-Rock Textures -> sad and intense rock  500459477
blue rgb(0,0,255) w=50
red rgb(255, 0, 0) w=50

That's Folk, Folks! -> country  500456046
old lace rgb(253,245,230) w=50 
white (255, 255, 255) w=50 

Spanish Guitar Masters -> 500441382
purple rgb(148,0,211) w=10
red rgb(220,20,60) w=30
green rgb(152,251,152) w=60

Look Up To The Stars -> 500440545
purple rgb(138,43,226) w=45
blue rgb(65,105,225) w=45
green  rgb(0,255,127) w=10

Psyched In A Trance -> 500434220
red rgb(255,0,0) w=17
orange rgb(255,165,0) w=17
yellow rgb(255,255,0) w=17
green rgb(127,255,0) w=17
blue rgb(0,0,255) w=16
purple 	rgb(128,0,128) w=16

Unforgettable Russia -> 500432775
red  rgb(255, 0, 0) w=50
white rgb(255, 255, 255) w=50

Salsa Picante -> 500431178
red rgb(255, 0, 0) w=90
green rgb(0,100,0) w=10

Be the bop -> jazz 500427847
blue rgb(0,0,255) w=80
black rgb(0,0,0) w=20

Blame It On The Glitch 500426279
red rgb(255, 0, 0) w=33 
green rgb(0, 255, 0) w=34
blue rgb(0, 0, 255) w=33

Cinematic dubstep 500423230
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

100% Reggaeton 500382081
green rgb(0,128,0) w=40
gold rgb(255,215,0) w=20
black (0,0,0) w=40

Girls On The Rise 500379690
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
orange red rgb(255,69,0) w=70
blue rgb(106,90,205) w=30

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

class RGBW {
  constructor(r, g, b, weight) {
    this.r = r 
    this.g = g 
    this.b = b 
    this.weight = weight / 100
    this.rgbValue = colorValue(r, g , b)
  }
  format() {
    return `rgb(${this.r},${this.g},${this.b})`
  }
}

function getWeightedAverage(paletteList) {
  let weightedAverage = 0
  for (let i = 0; i < paletteList.length; i++) {
    weightedAverage += paletteList[i].weight * (  paletteList[i].rgbValue )
  }
  return weightedAverage
}

class PlaylistToPaletteInfo {
  constructor(name, palette, id) {
    this.name = name
    this.palette = palette
    this.id = id 
    this.weightedAverage = getWeightedAverage(palette)
  }
}

let PlaylistsToPalette = [
  new PlaylistToPaletteInfo(
    "Metal",
    [
      new RGBW(0,0,139,50),
      new RGBW(0,0,0,25),
      new RGBW(128,128,128,25),
    ],
    500608898
  ),
  new PlaylistToPaletteInfo(
    "Beatmaker's arena",
    [
      new RGBW(255,215,0,33),
      new RGBW(255,165,0,34),
      new RGBW(220,20,60,33),
    ],
    500608471
  ),

  new PlaylistToPaletteInfo(
    "Time To Dream",
    [
      new RGBW(255,182,193,30),
      new RGBW(240,248,255,70),
    ],
    500607433
  ),

  new PlaylistToPaletteInfo(
    "Dreamy Flow",
    [
      new RGBW(255,182,193,30),
      new RGBW(240,248,255,30),
      new RGBW(255, 0, 0,40),
    ],
    500342341
  ),

  new PlaylistToPaletteInfo(
    "On the Rocks",
    [
      new RGBW(226,88,34,50),
      new RGBW(255,0,0,50),
    ],
    500606825
  ),

  new PlaylistToPaletteInfo(
    "Cool Instrumentals",
    [
      new RGBW(255,105,180,40),
      new RGBW(255, 255, 255,10),
      new RGBW(135,206,250,50),
    ],
    500605606
  ),

  new PlaylistToPaletteInfo(
    "Chill Zone",
    [
      new RGBW(0,191,255,100),
    ],
    500605176
  ),

  new PlaylistToPaletteInfo(
    "Urban",
    [
      new RGBW(65,105,225,50),
      new RGBW(220,20,60,50),
    ],
    500604904
  ),

  new PlaylistToPaletteInfo(
    "Electro Waves",
    [
      new RGBW(255,0,255,20),
      new RGBW(135,206,250,40),
      new RGBW(138,43,226,40),
    ],
    500602528
  ),

  new PlaylistToPaletteInfo(
    "Just Piano",
    [
      new RGBW(255, 255, 255,50),
      new RGBW(0,0,0,50),
    ],
    500599669
  ),

  new PlaylistToPaletteInfo(
    "Back to school",
    [
      new RGBW(30,144,255,30),
      new RGBW(127,255,0,70),
    ],
    500337324
  ),

  new PlaylistToPaletteInfo(
    "Long live the king",
    [
      new RGBW(255,218,185,30),
      new RGBW(139,69,19,70),
    ],
    500510544
  ),

  new PlaylistToPaletteInfo(
    "Stranger than summer",
    [
      new RGBW(255,165,0,80),
      new RGBW(0,0,0,20),
    ],
    500509197
  ),

  new PlaylistToPaletteInfo(
    "Sparks and stars",
    [
      new RGBW(95,158,160,50),
      new RGBW(0,255,127,50),
    ],
    500508615
  ),

  new PlaylistToPaletteInfo(
    "To infinity and beyond",
    [
      new RGBW(245,245,220,100),
    ],
    500506299
  ),

  new PlaylistToPaletteInfo(
    "Don't hold the door",
    [
      new RGBW(255,0,0,100),
    ],
    500491533
  ),

  new PlaylistToPaletteInfo(
    "Life Lessons & Resolutions",
    [
      new RGBW(34,139,34,50),
      new RGBW(0,250,154,50),
    ],
    500466416
  ),

  new PlaylistToPaletteInfo(
    "Post-Rock Textures",
    [
      new RGBW(0,0,255,50),
      new RGBW(255,0,0,50),
    ],
    500459477
  ),

  new PlaylistToPaletteInfo(
    "That's Folk, Folks!",
    [
      new RGBW(253,245,230,50),
      new RGBW(255, 255, 255,50),
    ],
    500456046
  ),

  new PlaylistToPaletteInfo(
    "Spanish Guitar Masters",
    [
      new RGBW(148,0,211,10),
      new RGBW(220,20,60,30),
      new RGBW(152,251,152,60),
    ],
    500441382
  ),

  new PlaylistToPaletteInfo(
    "Look Up To The Stars ",
    [
      new RGBW(138,43,226,45),
      new RGBW(65,105,225,45),
      new RGBW(0,255,127,10),
    ],
    500440545
  ),

  new PlaylistToPaletteInfo(
    "Psyched In A Trance",
    [
      new RGBW(255,0,0,17),
      new RGBW(255,165,0,17),
      new RGBW(255,255,0,17),
      new RGBW(127,255,0,17),
      new RGBW(0,0,255,16),
      new RGBW(128,0,128,16),
    ],
    500434220
  ),

  new PlaylistToPaletteInfo(
    "Unforgettable Russia",
    [
      new RGBW(255,0,0,50),
      new RGBW(255,255,255,50),
    ],
    500432775
  ),

  new PlaylistToPaletteInfo(
    "Salsa Picante",
    [
      new RGBW(255, 0, 0,90),
      new RGBW(0,100,0,10),
    ],
    500431178
  ),

  new PlaylistToPaletteInfo(
    "Be the bop",
    [
      new RGBW(0,0,205,80),
      new RGBW(0,0,0,20),
    ],
    500427847
  ),

  new PlaylistToPaletteInfo(
    "Blame It On The Glitch",
    [
      new RGBW(255, 0, 0,33),
      new RGBW(0, 255, 0,34),
      new RGBW(0, 0, 255,33),
    ],
    500426279
  ),

  new PlaylistToPaletteInfo(
    "Cinematic dubstep ",
    [
      new RGBW(240,128,128,45),
      new RGBW(100,149,237,45),
      new RGBW(255,255,255,10),
    ],
    500423230
  ),

  new PlaylistToPaletteInfo(
    "Override Dance",
    [
      new RGBW(245,245,220,40),
      new RGBW(255, 0, 0,20),
      new RGBW(0, 255, 0,20),
      new RGBW(0, 0, 255,20),
    ],
    500414147
  ),

  new PlaylistToPaletteInfo(
    "Sweet Dreams",
    [
      new RGBW(230,230,250,70),
      new RGBW(240,248,255,30),
    ],
    500405631
  ),

  new PlaylistToPaletteInfo(
    "Easter Holidays",
    [
      new RGBW(245,222,179,50),
      new RGBW(188,143,143,50),
    ],
    500399624
  ),

  new PlaylistToPaletteInfo(
    "Cinematic Landscapes",
    [
      new RGBW(0,0,255,90),
      new RGBW(255,165,0,10),
    ],
    500395082
  ),

  new PlaylistToPaletteInfo(
    "Electro Funk Frenzy",
    [
      new RGBW(255,215,0,20),
      new RGBW(138,43,226,40),
      new RGBW(65,105,225,40),
    ],
    500390216
  ),

  new PlaylistToPaletteInfo(
    "Valentine's Day",
    [
      new RGBW(255, 0, 0,80),
      new RGBW(139,69,19,20),
    ],
    500386475
  ),

  new PlaylistToPaletteInfo(
    "100% Reggaeton",
    [
      new RGBW(0,128,0,40),
      new RGBW(255,215,0,20),
      new RGBW(0,0,0,40),
    ],
    500382081
  ),

  new PlaylistToPaletteInfo(
    "Girls On The Rise",
    [
      new RGBW(255,192,203,100),
    ],
    500379690
  ),

  new PlaylistToPaletteInfo(
    "Oh deer, it's Christmas!",
    [
      new RGBW(255,255,255,33),
      new RGBW(255,0,0,34),
      new RGBW(0,255,0,33),
    ],
    500371356
  ),

  new PlaylistToPaletteInfo(
    "World Is Calling: Traditional Recipes",
    [
      new RGBW(255,140,0,20),
      new RGBW(250,128,114,20),
      new RGBW(0,0,139,20),
      new RGBW(154,205,50,20),
      new RGBW(75,0,130,20),
    ],
    500369284
  ),

  new PlaylistToPaletteInfo(
    "Dub The Riddim",
    [
      new RGBW(255, 0, 0,33),
      new RGBW(255,215,0,34),
      new RGBW(0, 255, 0,33),
    ],
    500366792
  ),

  new PlaylistToPaletteInfo(
    "Escape To A Reverie",
    [
      new RGBW(0,0,139,40),
      new RGBW(0,0,0,20),
      new RGBW(255,255,255,40),
    ],
    500361729
  ),

  new PlaylistToPaletteInfo(
    "The Breakbeat Goes On",
    [
      new RGBW(255,69,0,70),
      new RGBW(106,90,205,30),
    ],
    500359352
  ),

  new PlaylistToPaletteInfo(
    "Zentitude",
    [
      new RGBW(0,255,0,70),
      new RGBW(176,224,230,30),
    ],
    500356501
  ),

  new PlaylistToPaletteInfo(
    "Stranger than halloween",
    [
      new RGBW(255,165,0,50),
      new RGBW(0,0,0,20),
      new RGBW(0,191,255,30),
    ],
    500351513
  ),

  new PlaylistToPaletteInfo(
    "Icy Mindscapes",
    [
      new RGBW(240,248,255,100),
    ],
    500349856
  ),

  new PlaylistToPaletteInfo(
    "Running on Sinking Sand",
    [
      new RGBW(0,0,128,55),
      new RGBW(0,0,0,45),
    ],
    500343359
  ),

  new PlaylistToPaletteInfo(
    "From Nashville to Memphis ",
    [
      new RGBW(245,245,220,30),
      new RGBW(70,130,180,70),
    ],
    500339697
  ),

  new PlaylistToPaletteInfo(
    "Midnight Jazz",
    [
      new RGBW(0,0,0,59),
      new RGBW(255,0,0,41),
    ],
    500332577
  ),

  new PlaylistToPaletteInfo(
    "Fasten Your Seat Belt",
    [
      new RGBW(138,43,226,55),
      new RGBW(30,144,255,45),
    ],
    500330186
  ),

  new PlaylistToPaletteInfo(
    "Before The Wild Night",
    [
      new RGBW(253, 94, 83,60),
      new RGBW(252,156,84,20),
      new RGBW(255,227,115,20),
    ],
    500327838
  ),

  new PlaylistToPaletteInfo(
    "Sip That Caïpirinha",
    [
      new RGBW(135,206,235,70),
      new RGBW(255,255,51,10),
      new RGBW(124,252,0,20),
    ],
    500325591
  ),

  new PlaylistToPaletteInfo(
    "Stories From The Sea",
    [
      new RGBW(30,144,255,80),
      new RGBW(65,105,225,20),
    ],
    500320879
  ),

  new PlaylistToPaletteInfo(
    "Deep Is My House",
    [
      new RGBW(245,245,220,30),
      new RGBW(70,130,180,30),
      new RGBW(173,255,47,40),
    ],
    500317937
  ),

  new PlaylistToPaletteInfo(
    "Back To Classics",
    [
      new RGBW(0,0,0,33),
      new RGBW(255,255,255,34),
      new RGBW(128,128,128,33),
    ],
    500315543
  ),

  new PlaylistToPaletteInfo(
    "Feel good",
    [
      new RGBW(248,230,82,25),
      new RGBW(251,189,128,25),
      new RGBW(209,239,154,25),
      new RGBW(129,219,198,25),
    ],
    500307898
  ),

  new PlaylistToPaletteInfo(
    "Straight Chillin'",
    [
      new RGBW(22,178,182,33),
      new RGBW(31,131,15,33),
      new RGBW(19,78,101,34),
    ],
    500294369
  ),

  new PlaylistToPaletteInfo(
    "Latin Flavor",
    [
      new RGBW(146,0,30,25),
      new RGBW(172,74,8,25),
      new RGBW(225,238,80,25),
      new RGBW(54,57,42,25),
    ],
    500228504
  ),

  new PlaylistToPaletteInfo(
    "Election Day",
    [
      new RGBW(255, 0, 0,33),
      new RGBW(255,255,255,34),
      new RGBW(0,0,255,33),
    ],
    500227543
  ),

  new PlaylistToPaletteInfo(
    "Halloween",
    [
      new RGBW(255,154,0,25),
      new RGBW(0,0,0,25),
      new RGBW(9,255,0,25),
      new RGBW(201,0,255,25),
    ],
    500224355
  ),

  new PlaylistToPaletteInfo(
    "Road Trippin",
    [
      new RGBW(199,80,92,20),
      new RGBW(232,187,97,20),
      new RGBW(237,234,133,20),
      new RGBW(140,207,168,20),
      new RGBW(74,162,230,20),
    ],
    500204816
  ),

  new PlaylistToPaletteInfo(
    "Play It Loud",
    [
      new RGBW(255,10,156,33),
      new RGBW(174,24,87,34),
      new RGBW(24,218,141,33),
    ],
    500193575
  ),

  new PlaylistToPaletteInfo(
    "Summer Jams ",
    [
      new RGBW(255,78,80,27),
      new RGBW(252,145,58,26),
      new RGBW(249,214,46,27),
      new RGBW(234,227,116,10),
      new RGBW(226,244,199,10),
    ],
    500199905
  ),

  new PlaylistToPaletteInfo(
    "Hip-hop indie stars",
    [
      new RGBW(0,0,255,25),
      new RGBW(105,105,105,25),
      new RGBW(255,69,0,50),
    ],
    500168958
  ),

  new PlaylistToPaletteInfo(
    "Hipster BBQ",
    [
      new RGBW(255,245,155,20),
      new RGBW(255,155,162,30),
      new RGBW(255,245,155,50),
    ],
    500194396
  ),

  new PlaylistToPaletteInfo(
    "Party With Friends",
    [
      new RGBW(154,143,232,25),
      new RGBW(255,162,229,25),
      new RGBW(210,161,247,25),
      new RGBW(166,125,204,25),
    ],
    500168943
  ),

  new PlaylistToPaletteInfo(
    "Late Night Wind Down",
    [
      new RGBW(219,194,207,25),
      new RGBW(159,162,178,25),
      new RGBW(60,122,137,25),
      new RGBW(46,71,86,25),
    ],
    500180942
  ),

  new PlaylistToPaletteInfo(
    "The 5 Sickest Metal Tracks",
    [
      new RGBW(152,3,3,25),
      new RGBW(242,32,32,25),
      new RGBW(69,7,7,25),
      new RGBW(107,38,20,25),
    ],
    500176479
  ),

  new PlaylistToPaletteInfo(
    "Power Workout",
    [
      new RGBW(255,255,0,57),
      new RGBW(255,165,0,43),
    ],
    500175269
  ),

  new PlaylistToPaletteInfo(
    "Ode to Winter",
    [
      new RGBW(211,225,255,20),
      new RGBW(184,205,251,20),
      new RGBW(165,193,253,20),
      new RGBW(149,182,253,20),
      new RGBW(138,175,255,20),
    ],
    500170891
  ),

  new PlaylistToPaletteInfo(
    "Best Of Metal",
    [
      new RGBW(0,0,0,59),
      new RGBW(255,0,0,41),
    ],
    500157248
  ),

  new PlaylistToPaletteInfo(
    "New Resolutions",
    [
      new RGBW(0,191,255,20),
      new RGBW(0,255,0,30),
      new RGBW(255,255,0,50),
    ],
    500157769
  ),

]

// console.log(PlaylistsToPalette)


function colorValue(r,g,b) {
  return r + g*256 + b*65536
}


function equalRGB(rgb1, rgb2, differenceThreshold) {
  return Math.abs(colorValue(rgb1.r, rgb1.g, rgb1.b) - colorValue(rgb2.r, rgb2.g, rgb2.b)) <= differenceThreshold
} 

// difference threshold starts at 1000. 
// if sum < 95, mult the difference threshold by 10. 

AverageRGB("./images/colorful.png", 1000)

async function AverageRGB(file, differenceThreshold) {
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
            } else  {
              let pass = true
              for (let i = 0; i < colorPalette.length; i++) {
                 if (equalRGB(colorPalette[i], currentPixelRGB, differenceThreshold)) {
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

        let sum = 0 
        const colorAndWeightList = []
        console.log(`Colors: ${Object.keys(colorAndWeight).length}`)

        if (Object.keys(colorAndWeight).length >= 1000) {
          console.log("********TOO LONG, REDO*******")
          AverageRGB(file, differenceThreshold*10)
          return; 
        }

        for (const color in colorAndWeight) {
          let colorWeight = parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
          if (colorWeight >= 1) {
            colorAndWeightList.push({
              color: color, 
              weight: parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
            })
            sum += parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
          }
            

        }

        colorAndWeightList.sort((a, b) => b.weight - a.weight)
        console.log(colorAndWeightList)
        console.log(sum)
        console.log({r: Math.round(avgRed / pixels), g: Math.round(avgGreen / pixels), b: Math.round(avgBlue / pixels)})

        if (sum < 95) {
          console.log("********REDO*******")
          AverageRGB(file, differenceThreshold*10)
        }   
    });
}



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