var FACES = [];
var STOR = require("Storage");
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var lastface = STOR.readJSON("wecare.json")||{pinned:0};
var iface = lastface.pinned;
var face = FACES[iface]();
var intervalRefSec;

if (STOR.read("mqtt.js")) eval(STOR.read("mqtt.js"));

function stopdraw() {
  if (face.kill) face.kill();
  if(intervalRefSec) {intervalRefSec=clearInterval(intervalRefSec);}
  g.clear();
}

function startdraw() {
  g.clear();
  g.reset();
  Bangle.drawWidgets();
  face.init();
  if (face.tick) intervalRefSec = setInterval(face.tick,1000);
}

global.SCREENACCESS = {
  withApp:true,
  request:function(){
    this.withApp=false;
    stopdraw();
  },
  release:function(){
    this.withApp=true;
    startdraw();
  }
};

function setControl(){
  function newFace(inc){
    var n = FACES.length-1;
    iface+=inc;
    iface = iface>n?0:iface<0?n:iface;
    stopdraw();
    face = FACES[iface]();
    startdraw();
  }
  function finish(){
    if (lastface.pinned!=iface){
        lastface.pinned=iface;
        STOR.write("wecare.json",lastface);
    }
    Bangle.showLauncher();
  }
  Bangle.on('swipe',(dir) => {
    if (SCREENACCESS.withApp)
      newFace(dir);
  });
  Bangle.on('lock', (on) => {
    //Bangle.setLCDPower(!on);
  });
  Bangle.on('lcdPower', function(on){
    if (on){
      startdraw();
    } else stopdraw();
  });
  /*Bangle.on('touch', () => {
    if(iface == 0) {
      mqtt.publish("act", "call");
      Bangle.buzz();
    }
    console.log("App:",iface);
  });*/
  setWatch(finish,BTN1,{edge:"falling"});
}

mqtt.on("cmd", function(msg){
   E.showMessage(msg.message, msg.topic);
});

mqtt.on("hrm?", function(msg){
   E.showMessage(msg.message, msg.topic);
});

// Show launcher when button pressed
Bangle.setUI("clock");

Bangle.loadWidgets();
g.clear();
startdraw();
setControl();
